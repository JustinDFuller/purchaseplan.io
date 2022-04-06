package service

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	plan "github.com/justindfuller/purchaseplan.io/backend"
	planner "github.com/justindfuller/purchaseplan.io/backend"
	"github.com/justindfuller/purchaseplan.io/backend/analytics"
	"github.com/justindfuller/purchaseplan.io/backend/config"
	"github.com/justindfuller/purchaseplan.io/backend/datastore"
	"github.com/justindfuller/purchaseplan.io/backend/storage"
	"github.com/magiclabs/magic-admin-go"
	"github.com/magiclabs/magic-admin-go/client"
	"github.com/magiclabs/magic-admin-go/token"
	"github.com/pkg/errors"
)

const headerAuthorization = "Authorization"
const authCookieName = "Authorization"
const authBearer = "Bearer"

// S is a service.
type S struct {
	Config     config.C
	Router     *mux.Router
	datastore  datastore.Client
	storage    storage.Client
	httpClient *http.Client
}

// Close will run any cleanup needed for a service to close.
func (s S) Close() {
	s.datastore.Close()
}

// New creates a service.
func New(opts ...Option) (S, error) {
	var s S

	for _, opt := range opts {
		if err := opt(&s); err != nil {
			return s, err
		}
	}

	if s.httpClient == nil {
		s.httpClient = &http.Client{}
	}

	ctx := context.Background()

	c, err := config.New()
	if err != nil {
		return s, errors.Wrap(err, "error creating config")
	}
	s.Config = c

	ds, err := datastore.New(ctx, c.GoogleCloudProject)
	if err != nil {
		return s, errors.Wrap(err, "error connecting to datastore")
	}
	s.datastore = ds

	st, err := storage.New(ctx, c.GoogleCloudProject, c.ImageStorageBucket)
	if err != nil {
		return s, errors.Wrap(err, "error connecting to storage")
	}
	s.storage = st

	a, err := analytics.New(ctx, c.GoogleCloudProject)
	if err != nil {
		return s, errors.Wrap(err, "error connecting to analytics")
	}

	r := mux.NewRouter()
	r.Use(mux.CORSMethodMiddleware(r))

	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Add("Access-Control-Allow-Origin", "http://localhost:3000")
			w.Header().Add("Access-Control-Allow-Credentials", "true")
			w.Header().Add("Access-Control-Allow-Headers", fmt.Sprintf("%s,content-type,sentry-trace", headerAuthorization))

			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, r)
		})
	})

	// POST /v1/users/sessions will create a JWT cookie for the user.
	// It will also create a DB entry if it does not exist.
	r.HandleFunc("/v1/users/sessions", func(w http.ResponseWriter, r *http.Request) {
		if !strings.HasPrefix(r.Header.Get(headerAuthorization), authBearer) {
			log.Printf("Missing Bearer in X-Authorization header: %s", r.Header.Get(headerAuthorization))
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		did := r.Header.Get(headerAuthorization)[len(authBearer)+1:]
		if did == "" {
			log.Printf("Missing DID token: %s", r.Header.Get(headerAuthorization))
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		tk, err := token.NewToken(did)
		if err != nil {
			log.Printf("Unable to parse DID Token: %s", did)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		if err := tk.Validate(); err != nil {
			log.Printf("Invalid DID token: %s", err)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		m := client.New(c.MagicSecretKey, magic.NewDefaultClient())
		metadata, err := m.User.GetMetadataByIssuer(tk.GetIssuer())
		if err != nil {
			log.Printf("Unable to retrieve user metadata: %s", err)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		// TODO: Should this really all happen here?
		u, err := ds.GetUser(r.Context(), metadata.Email)
		if datastore.IsNotFound(err) {
			// Login + Not found == create new user
			if err := ds.PutUser(r.Context(), plan.User{Email: metadata.Email}); err != nil {
				log.Printf("Unable to create new user during login: %s", err)
				w.WriteHeader(http.StatusUnauthorized)
				return
			}
		} else if err != nil {
			log.Printf("Unable to get user: %s", err)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		oneYear := time.Now().Add(time.Hour * 24 * 365)
		j := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), jwt.MapClaims{
			"issuer":        metadata.Issuer,
			"publicAddress": metadata.PublicAddress,
			"email":         metadata.Email,
			"exp":           oneYear.String(),
		})

		signed, err := j.SignedString([]byte(c.JwtSecret))
		if err != nil {
			log.Printf("Unable to sign JWT: %s", err)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		http.SetCookie(w, &http.Cookie{
			Name:     authCookieName,
			Value:    signed,
			Expires:  oneYear,
			Path:     "/",
			Secure:   true,
			HttpOnly: true,
			SameSite: http.SameSiteStrictMode,
		})

		if err := json.NewEncoder(w).Encode(u); err != nil {
			log.Printf("Error encoding json to response: %s", err)
			w.WriteHeader(http.StatusInternalServerError)
		}
	}).Methods(http.MethodPost, http.MethodOptions)

	// DELETE /v1/users/sessions removes the Authorization cookie and logs out a user.
	r.HandleFunc("/v1/users/sessions", func(w http.ResponseWriter, r *http.Request) {
		http.SetCookie(w, &http.Cookie{
			Name:     authCookieName,
			Value:    "",
			Expires:  time.Time{},
			Path:     "/",
			Secure:   true,
			HttpOnly: true,
			SameSite: http.SameSiteStrictMode,
		})
	}).Methods(http.MethodDelete, http.MethodOptions)

	// PUT /users will update the current user.
	r.HandleFunc("/v1/users", withAuthentication(func(w http.ResponseWriter, r *http.Request) {
		val := r.Context().Value(emailContextKey)
		email, ok := val.(string)
		if !ok {
			log.Printf("Unexpected email value: %s", email)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		b, err := ioutil.ReadAll(r.Body)
		if err != nil {
			log.Printf("Error reading body: %s", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		var u plan.User
		if err := json.Unmarshal(b, &u); err != nil {
			log.Printf("Error unmarshaling json: %s", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		// Force the correct email, even if they tried to change it.
		u.Email = email

		if err := plan.Process(&u); err != nil {
			log.Printf("Error processing user: %s", err)

			// TODO: Switch based on error.
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		if err := ds.PutUser(ctx, u); err != nil {
			log.Printf("Error storing user: %s", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		if err := json.NewEncoder(w).Encode(&u); err != nil {
			log.Printf("Error encoding json to response: %s", err)
		}
	}, c)).Methods(http.MethodPut, http.MethodOptions)

	// GET /users will return the currect user.
	r.HandleFunc("/v1/users", withAuthentication(func(w http.ResponseWriter, r *http.Request) {
		val := r.Context().Value(emailContextKey)
		email, ok := val.(string)
		if !ok {
			log.Printf("Unexpected email value: %s", email)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		u, err := ds.GetUser(r.Context(), email)
		if err != nil {
			log.Printf("Couldn't find user from context: %s", err)
			w.WriteHeader(http.StatusNotFound)
			return
		}

		u.Email = email

		if err := plan.Process(&u); err != nil {
			log.Printf("Couldn't process user: %s", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(u); err != nil {
			log.Printf("Error encoding json to response: %s", err)
			w.WriteHeader(http.StatusInternalServerError)
		}
	}, c)).Methods(http.MethodGet, http.MethodOptions)

	r.HandleFunc("/products", withAuthentication(func(w http.ResponseWriter, r *http.Request) {
		u := r.URL.Query().Get("url")

		req, err := http.NewRequestWithContext(ctx, http.MethodGet, u, nil)
		if err != nil {
			log.Printf("Error creating request: %s", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		req.Header.Add("user-agent", "Mozilla/5.0 (compatible; PurchasePlan/1.0; +https://www.purchaseplan.io/crawler)")

		res, err := s.httpClient.Do(req)
		if err != nil {
			log.Printf("Error during GET %s: %s", u, err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		defer res.Body.Close()

		b, err := ioutil.ReadAll(res.Body)
		if err != nil {
			log.Printf("Error reading body: %s", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		p, err := planner.NewDefaultParser(u, b, s.Config).Product(ctx)
		if err != nil {
			log.Printf("Error parsing product: %s", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		p, err = p.Normalize(u)
		if err != nil {
			log.Printf("Error normalizing product: %s", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		image, err := st.PutImage(r.Context(), p.Image)
		if err != nil {
			log.Printf("Unable to save image: %s", err)
		}
		p.OriginalImage = p.Image
		p.Image = image

		go func() {
			if err := a.PutProduct(context.Background(), u, p); err != nil {
				log.Printf("Unable to save product analytics: %s", err)
			}
		}()

		if err := json.NewEncoder(w).Encode(p); err != nil {
			log.Printf("Error encoding JSON: %s", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}, c)).Methods(http.MethodGet, http.MethodOptions)

	r.HandleFunc("/v1/tracking", withOptionalAuthentication(func(w http.ResponseWriter, r *http.Request) {
		var tracking plan.Tracking
		if err := json.NewDecoder(r.Body).Decode(&tracking); err != nil {
			log.Printf("Error decoding tracking request: %s", err)
			http.Error(w, "Error decoding tracking request", http.StatusInternalServerError)
			return
		}

		if tracking.PageViewID == "" {
			msg := "Missing PageViewID"
			log.Printf("%s: %s", msg, err)
			http.Error(w, msg, http.StatusBadRequest)
			return
		}

		if tracking.Type == "" {
			msg := "Missing Type"
			log.Printf("%s: %s", msg, err)
			http.Error(w, msg, http.StatusBadRequest)
			return
		}

		if tracking.Name == "" {
			msg := "Missing Name"
			log.Printf("%s: %s", msg, err)
			http.Error(w, msg, http.StatusBadRequest)
			return
		}

		if tracking.URL == "" {
			msg := "Missing URL"
			log.Printf("%s: %s", msg, err)
			http.Error(w, msg, http.StatusBadRequest)
			return
		}

		if tracking.Time.IsZero() {
			msg := "Missing Time"
			log.Printf("%s: %s", msg, err)
			http.Error(w, msg, http.StatusBadRequest)
			return
		}

		tracking.Host = r.Host
		tracking.UserAgent = r.Header.Get("User-Agent")
		tracking.Referer = r.Header.Get("Referer")
		tracking.Country = r.Header.Get("X-Appengine-Country")
		tracking.Region = r.Header.Get("X-Appengine-Region")
		tracking.Trace = r.Header.Get("X-Cloud-Trace-Context")

		val := r.Context().Value(emailContextKey)
		email, ok := val.(string)
		if ok {
			u, err := ds.GetUser(r.Context(), email)
			if err != nil {
				log.Printf("Couldn't find user from context: %s", err)
			}
			tracking.UserID = u.ID
		}

		if err := a.Track(r.Context(), &tracking); err != nil {
			log.Printf("Unable to save tracking analytics: %s", err)
		}
	}, c)).Methods(http.MethodPost, http.MethodOptions)

	s.Router = r

	return s, nil
}

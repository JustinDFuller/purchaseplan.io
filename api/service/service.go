package service

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"

	"github.com/gorilla/mux"
	planner "github.com/justindfuller/purchase-saving-planner/api"
	"github.com/justindfuller/purchase-saving-planner/api/internal/config"
	"github.com/justindfuller/purchase-saving-planner/api/internal/datastore"
	"github.com/justindfuller/purchase-saving-planner/api/internal/schemaorg"
)

// S is a service.
type S struct {
	Router    *mux.Router
	datastore datastore.Client
}

// Close will run any cleanup needed for a service to close.
func (s S) Close() {
	s.datastore.Close()
}

// New creates a service.
func New(ctx context.Context, c config.C) (S, error) {
	var s S

	ds, err := datastore.New(ctx, c.GoogleCloudProject)
	if err != nil {
		return s, err
	}
	s.datastore = ds

	r := mux.NewRouter()
	r.Use(mux.CORSMethodMiddleware(r))

	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Add("Access-Control-Allow-Origin", "http://localhost:3000")

			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, r)
		})
	})

	r.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) {
		b, err := ioutil.ReadAll(r.Body)
		if err != nil {
			log.Printf("Error reading body: %s", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		var u planner.User
		if err := json.Unmarshal(b, &u); err != nil {
			log.Printf("Error unmarshaling json: %s", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		if err := ds.PutUser(ctx, u); err != nil {
			log.Printf("Error storing user: %s", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		w.WriteHeader(http.StatusCreated)
		if err := json.NewEncoder(w).Encode(u); err != nil {
			log.Printf("Error encoding json to response: %s", err)
			w.WriteHeader(http.StatusInternalServerError)
		}
	}).Methods(http.MethodPut, http.MethodOptions)

	r.HandleFunc("/users/{id}", func(w http.ResponseWriter, r *http.Request) {
		u, err := ds.GetUser(ctx, mux.Vars(r)["id"])
		if err != nil {
			log.Printf("Error retrieving user: %s", err)
			w.WriteHeader(http.StatusNotFound)
			return
		}

		w.WriteHeader(http.StatusCreated)
		if err := json.NewEncoder(w).Encode(u); err != nil {
			log.Printf("Error encoding json to response: %s", err)
			w.WriteHeader(http.StatusInternalServerError)
		}
	}).Methods(http.MethodGet, http.MethodOptions)

	r.HandleFunc("/products", func(w http.ResponseWriter, r *http.Request) {
		u, err := url.QueryUnescape(r.URL.Query().Get("url"))
		if err != nil {
			log.Printf("Error unescaping query: %s", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		log.Printf("Searching for schema from: %s", u)

		req, err := http.NewRequestWithContext(ctx, http.MethodGet, u, nil)
		if err != nil {
			log.Printf("Error creating request: %s", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		req.Header.Add("user-agent", "Mozilla/5.0 (X11; CrOS x86_64 13421.89.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36")

		c := http.Client{}
		res, err := c.Do(req)
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

		p, err := schemaorg.ParseHTML(u, b)
		if err != nil {
			log.Printf("Error finding product from html: %s", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		json.NewEncoder(w).Encode(p)
	}).Methods(http.MethodGet, http.MethodOptions)

	s.Router = r

	return s, nil
}

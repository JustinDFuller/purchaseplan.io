package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"time"

	"cloud.google.com/go/datastore"
	"github.com/PuerkitoBio/goquery"
	"github.com/gorilla/mux"
	"github.com/kelseyhightower/envconfig"
)

type config struct {
	PORT                 int
	GOOGLE_CLOUD_PROJECT string
}

func main() {
	ctx := context.Background()

	var c config
	if err := envconfig.Process("", &c); err != nil {
		log.Fatalf("Error processing config: %s", err)
	}

	ds, err := datastore.NewClient(ctx, c.GOOGLE_CLOUD_PROJECT)
	if err != nil {
		log.Fatalf("Error connecting to datastore: %s", err)
	}
	defer ds.Close()

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

		var u User
		if err := json.Unmarshal(b, &u); err != nil {
			log.Printf("Error unmarshaling json: %s", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		k := datastore.NameKey("Users", u.Email, nil)
		if _, err := ds.Put(ctx, k, &u); err != nil {
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
		var u User
		k := datastore.NameKey("Users", mux.Vars(r)["id"], nil)
		if err := ds.Get(ctx, k, &u); err != nil {
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
		url, err := url.QueryUnescape(r.URL.Query().Get("url"))
		if err != nil {
			log.Printf("Error unescaping query: %s", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
		if err != nil {
			log.Printf("Error creating request: %s", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		req.Header.Add("user-agent", "Mozilla/5.0 (X11; CrOS x86_64 13421.89.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36")

		c := http.Client{}
		res, err := c.Do(req)
		if err != nil {
			log.Printf("Error during GET %s: %s", url, err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		defer res.Body.Close()

		doc, err := goquery.NewDocumentFromReader(res.Body)
		if err != nil {
			log.Printf("Error parsing document: %s", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		doc.Find(`script[type="application/ld+json"]`).Each(func(i int, s *goquery.Selection) {
			var schemas []SchemaOrg

			if err := json.Unmarshal([]byte(s.Text()), &schemas); err != nil {
				log.Printf("Found invalid SchemaOrg JSON/LD: %s", err)
				return
			}

			for _, s := range schemas {
				if s.Type == "Product" {
					if err := json.NewEncoder(w).Encode(s); err != nil {
						log.Printf("Error encoding schema to response: %s", err)
						w.WriteHeader(http.StatusInternalServerError)
						return
					}
					return
				}
			}

		})
	}).Methods(http.MethodGet, http.MethodOptions)

	http.Handle("/", r)
	log.Printf("Listening on port %d", c.PORT)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", c.PORT), nil))
}

type (
	User struct {
		Email         string     `json:"email"`
		Saved         int64      `json:"saved"`
		Contributions int64      `json:"contributions"`
		Frequency     string     `json:"frequency"`
		LastPaycheck  *time.Time `json:"lastPaycheck"`
		Purchases     []Purchase `json:"purchases"`
	}

	Purchase struct {
		Name  string `json:"name"`
		Price int64  `json:"price"`
		URL   string `json:"url"`
	}

	SchemaOrg struct {
		Context     string `json:"@context"`
		Type        string `json:"@type"`
		Description string `json:"description"`
		Image       string `json:"image"`
		Name        string `json:"name"`
		Offers      struct {
			Price         float64 `json:"price"`
			PriceCurrency string  `json:"priceCurrency"`
		} `json:"offers"`
	}
)

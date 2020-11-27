package main

import (
	"cloud.google.com/go/datastore"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/kelseyhightower/envconfig"
	"io/ioutil"
	"log"
	"net/http"
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

	// Create a datastore client. In a typical application, you would create
	// a single client which is reused for every datastore operation.
	ds, err := datastore.NewClient(ctx, c.GOOGLE_CLOUD_PROJECT)
	if err != nil {
		log.Fatalf("Error connecting to datastore: %s".err)
	}
	defer ds.Close()

	r := mux.NewRouter()

	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Add("Access-Control-Allow-Origin", "http://localhost:3000")
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
		if _, err := ds.Put(ctx, k, u); err != nil {
			log.Printf("Error storing user: %s", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		w.WriteHeader(http.StatusCreated)
		if err := json.NewEncoder(w).Encode(u); err != nil {
			log.Printf("Error encoding json to response: %s", err)
			w.WriteHeader(http.StatusInternalServerError)
		}
	}).Methods("PUT")

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
		if err := dsClient.Get(ctx, k, &u); err != nil {
			log.Printf("Error retrieving user: %s", err)
			w.WriteHeader(http.StatusNotFound)
			return
		}

		w.WriteHeader(http.StatusCreated)
		if err := json.NewEncoder(w).Encode(u); err != nil {
			log.Printf("Error encoding json to response: %s", err)
			w.WriteHeader(http.StatusInternalServerError)
		}
	}).Methods("GET")

	http.Handle("/", r)
	log.Printf("Listening on port %d", c.PORT)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", c.PORT), nil))
}

type (
	User struct {
		Email string
	}
)

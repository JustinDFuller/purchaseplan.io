package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/justindfuller/purchase-saving-planner/api/service"
)

func main() {
	s, err := service.New()
	if err != nil {
		log.Fatalf("Error creating service: %s", err)
	}
	defer s.Close()

	http.Handle("/", s.Router)
	log.Printf("Listening on port %d", s.Config.Port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", s.Config.Port), nil))
}

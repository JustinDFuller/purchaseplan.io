package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/justindfuller/purchase-saving-planner/api/internal/config"
	"github.com/justindfuller/purchase-saving-planner/api/service"
)

func main() {
	ctx := context.Background()

	c, err := config.New()
	if err != nil {
		log.Fatalf("Error processing config: %s", err)
	}

	s, err := service.New(ctx, c)
	if err != nil {
		log.Fatalf("Error creating service: %s", err)
	}
	defer s.Close()

	http.Handle("/", s.Router)
	log.Printf("Listening on port %d", c.Port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", c.Port), nil))
}

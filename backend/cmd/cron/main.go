package main

import (
	"context"
	"log"

	"github.com/justindfuller/purchaseplan.io/backend/config"
	"github.com/justindfuller/purchaseplan.io/backend/datastore"
)

func main() {
	ctx := context.Background()

	c, err := config.New()
	if err != nil {
		log.Fatal(err)
	}

	_, err = datastore.New(ctx, c.GoogleCloudProject)
	if err != nil {
		log.Fatal(err)
	}
}

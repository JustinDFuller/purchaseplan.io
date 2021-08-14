package main

import (
	"context"
	"log"
	"time"

	"github.com/justindfuller/purchaseplan.io/backend/config"
	"github.com/justindfuller/purchaseplan.io/backend/datastore"
	"github.com/justindfuller/purchaseplan.io/plan"
)

func main() {
	ctx := context.Background()
	ctx, cancel := context.WithTimeout(ctx, time.Hour)
	defer cancel()

	c, err := config.New()
	if err != nil {
		log.Fatal(err)
	}

	ds, err := datastore.New(ctx, c.GoogleCloudProject)
	if err != nil {
		log.Fatal(err)
	}

	process := func(u *plan.User) error {
		if err := plan.Process(u); err != nil {
			return err
		}
		if err := ds.PutUser(ctx, *u); err != nil {
			return err
		}
		return nil
	}

	log.Print("CRON STARTED")

	if err := ds.QueryUsers(ctx, process); err != nil {
		log.Fatal(err)
	}

	log.Print("CRON FINISHED")
}

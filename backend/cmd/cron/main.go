package main

import (
	"context"
	"log"
	"time"

	plan "github.com/justindfuller/purchaseplan.io/backend"
	"github.com/justindfuller/purchaseplan.io/backend/config"
	"github.com/justindfuller/purchaseplan.io/backend/datastore"
	expo "github.com/oliveroneill/exponent-server-sdk-golang/sdk"
	"github.com/pkg/errors"
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

	var tokens []expo.ExponentPushToken

	process := func(u *plan.User) error {
		if err := plan.Process(u); err != nil {
			return err
		}

		var notify bool
		for i := range u.Purchases {
			p := u.Purchases[i]
			if p.CanNotify() {
				notify = true
				u.Purchases[i].Notified = true
			}
		}

		if !notify {
			return nil
		}

		for _, t := range u.PushNotificationTokens {
			if t.ExpoToken == "" {
				continue
			}

			token, err := expo.NewExponentPushToken(t.ExpoToken)
			if err != nil {
				log.Printf("error generating push token: %s", err)
				continue
			}

			tokens = append(tokens, token)
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

	log.Print("QUERY AND UPDATE FINISHED")

	if err := sendPushNotifications(tokens); err != nil {
		log.Printf("Send push notifications error: %s", err)
	}

	log.Print("CRON FINISHED")
}

func sendPushNotifications(tokens []expo.ExponentPushToken) error {
	if len(tokens) == 0 {
		log.Print("SKIPPING PUSH NOTIFICATION SEND")
		return nil
	}

	log.Print("START PUSH NOTIFICATION SEND")
	client := expo.NewPushClient(nil)
	response, err := client.Publish(
		&expo.PushMessage{
			To:       tokens,
			Body:     "Your purchase is ready!",
			Sound:    "default",
			Title:    "Purchase Plan",
			Priority: expo.DefaultPriority,
		},
	)
	if err != nil {
		return errors.Wrap(err, "error sending push notification")
	}
	if response.ValidateResponse() != nil {
		return errors.Errorf("failed push notification: %#v", response.PushMessage)
	}
	return nil
}

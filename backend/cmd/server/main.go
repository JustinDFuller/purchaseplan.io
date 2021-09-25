package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/justindfuller/purchaseplan.io/backend/service"
)

func main() {
	s, err := service.New()
	if err != nil {
		log.Fatalf("Error creating service: %s", err)
	}
	defer s.Close()

	done := make(chan os.Signal, 1)
	signal.Notify(done, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)

	http.Handle("/", s.Router)

	go func() {
		log.Printf("Listening on port %d", s.Config.Port)
		if err := http.ListenAndServe(fmt.Sprintf(":%d", s.Config.Port), nil); err != nil {
			log.Printf("Error listening: %s", err)
		}
	}()

	<-done
	log.Print("Server Stopped")
}

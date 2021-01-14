package config

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
)

// C is the struct that holds all configuration properties.
type C struct {
	Port                int    `envconfig:"PORT"`
	GoogleCloudProject  string `envconfig:"GOOGLE_CLOUD_PROJECT"`
	AmazonPAPIAccessKey string `envconfig:"AMAZON_PAPI_ACCESS_KEY"`
	AmazonPAPISecretKey string `envconfig:"AMAZON_PAPI_SECRET_KEY"`
}

// New parses config values from environment variables.
func New() (C, error) {
	var c C

	// Same dir in app engine
	if err := godotenv.Load("./.env"); err != nil {
		// Up one dir when running locally
		if err := godotenv.Load("../.env"); err != nil {
			// Up two dirs when running tests
			if err := godotenv.Load("../../.env"); err != nil {
				log.Printf("Error loading .env file: %s", err)
			}
		}
	}

	if err := envconfig.Process("", &c); err != nil {
		return c, err
	}

	return c, nil
}

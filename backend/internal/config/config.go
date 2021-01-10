package config

import (
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

	// It's expected the .env is in the root dir of the project.
	if err := godotenv.Load("../.env"); err != nil {
		// Retry one more dir up.
		if err := godotenv.Load("../../.env"); err != nil {
			return c, err
		}
	}

	if err := envconfig.Process("", &c); err != nil {
		return c, err
	}

	return c, nil
}

package config

import (
	"github.com/justindfuller/secretmanager"
	"github.com/kelseyhightower/envconfig"
)

// C is the struct that holds all configuration properties.
type C struct {
	Port                int    `envconfig:"PORT"`
	ENV                 string `envconfig:"ENV"`
	GoogleCloudProject  string `envconfig:"GOOGLE_CLOUD_PROJECT"`
	ImageStorageBucket  string `envconfig:"PURCHASE_PLAN_IMAGE_BUCKET"`
	AmazonPAPIAccessKey string `secretmanager:"AMAZON_PAPI_ACCESS_KEY"`
	AmazonPAPISecretKey string `secretmanager:"AMAZON_PAPI_SECRET_KEY"`
	MagicSecretKey      string `secretmanager:"MAGIC_SECRET_KEY"`
	MagicTestSecretKey  string `secretmanager:MAGIC_TEST_SECRET_KEY`
	JwtSecret           string `secretmanager:"JWT_SECRET"`
}

// New parses config values from environment variables.
func New() (C, error) {
	var c C

	if err := envconfig.Process("", &c); err != nil {
		return c, err
	}

	if err := secretmanager.Parse(&c); err != nil {
		return c, err
	}

	return c, nil
}

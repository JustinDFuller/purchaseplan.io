package config

import "github.com/kelseyhightower/envconfig"

// C is the struct that holds all configuration properties.
type C struct {
	Port               int    `envconfig:"PORT"`
	GoogleCloudProject string `envconfig:"GOOGLE_CLOUD_PROJECT"`
}

// New parses config values from environment variables.
func New() (C, error) {
	var c C
	err := envconfig.Process("", &c)
	return c, err
}

package service

import "net/http"

type Option func(*S) error

func WithHttpClient(c *http.Client) Option {
	return func(s *S) error {
		s.httpClient = c
		return nil
	}
}

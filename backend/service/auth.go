package service

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/justindfuller/purchase-saving-planner/api/internal/config"
)

type contextKey string

const emailContextKey contextKey = "auth_email"

func withAuthentication(h http.HandlerFunc, cfg config.C) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		c, err := r.Cookie(authCookieName)
		if err != nil {
			log.Printf("Missing auth cookie: %s", err)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		t, err := jwt.Parse(c.Value, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Unexpected signing method: %v", t.Header["alg"])
			}

			return []byte(cfg.JwtSecret), nil
		})
		if err != nil {
			log.Printf("Unable to parse jwt: %s", err)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		if !t.Valid {
			log.Print("JWT token is invalid")
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		claims, ok := t.Claims.(jwt.MapClaims)
		if !ok {
			log.Printf("JWT Claims are invalid: ok=%t, claims:%s", ok, claims)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		email, ok := claims["email"].(string)
		if !ok {
			log.Printf("email claim is not a string: %s", claims[email])
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), emailContextKey, email)
		r = r.WithContext(ctx)
		h(w, r)
	}
}

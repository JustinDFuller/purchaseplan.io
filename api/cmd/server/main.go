package main

import (
	"database/sql"
	"fmt"
	"github.com/kelseyhightower/envconfig"
	"log"

	_ "github.com/lib/pq"
)

type config struct {
	PGUSER     string
	PGPASSWORD string
	PGDB       string
	PGSSLMODE  string
	PGHOST     string
}

func main() {
	var c config
	if err := envconfig.Process("", &c); err != nil {
		log.Fatalf("Error processing config: %s", err)
	}

	connStr := fmt.Sprintf("password=%s host=%s user=%s dbname=%s sslmode=%s", c.PGPASSWORD, c.PGHOST, c.PGUSER, c.PGDB, c.PGSSLMODE)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Error processing db connection: %s", err)
	}

	if _, err := db.Exec("CREATE TABLE IF NOT EXISTS users (id INT GENERATED ALWAYS AS IDENTITY, email TEXT NOT NULL UNIQUE);"); err != nil {
		log.Fatalf("Error initializing user table: %s", err)
	}

	log.Print("Started successfully.")
}

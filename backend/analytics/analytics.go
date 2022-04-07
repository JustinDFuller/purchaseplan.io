package analytics

import (
	"context"
	"net/url"
	"time"

	"cloud.google.com/go/bigquery"
	plan "github.com/justindfuller/purchaseplan.io/backend"
	"github.com/pkg/errors"
)

// Client encapsulates connections to bigquery.
type Client struct {
	products *bigquery.Table
	tracking *bigquery.Table
}

// New creates a new Client.
func New(ctx context.Context, project string) (Client, error) {
	var c Client

	client, err := bigquery.NewClient(ctx, project)
	if err != nil {
		return c, err
	}

	d := client.Dataset("default")
	c.products = d.Table("products")
	c.tracking = d.Table("tracking")

	return c, nil
}

type product struct {
	Hostname    string
	RequestURL  string
	Name        string
	Description string
	Price       int64
	URL         string
	Image       string
	Time        time.Time
}

// PutProduct will save a product to bigquery.
func (c Client) PutProduct(ctx context.Context, requestURL string, p plan.Product) error {
	u, err := url.Parse(requestURL)
	if err != nil {
		return errors.Wrap(err, "product analytics unable to parse requestURL")
	}

	if err := c.products.Inserter().Put(ctx, product{
		Hostname:    u.Hostname(),
		RequestURL:  requestURL,
		Name:        p.Name,
		Description: p.Description,
		Price:       p.Price,
		URL:         p.URL,
		Image:       p.OriginalImage,
		Time:        time.Now(),
	}); err != nil {
		return errors.Wrap(err, "unable to save product to analytics")
	}
	return nil
}

func (c Client) Track(ctx context.Context, t *plan.Tracking) error {
	if err := c.tracking.Inserter().Put(ctx, t); err != nil {
		return errors.Wrap(err, "unable to save tracking to analytics")
	}
	return nil
}

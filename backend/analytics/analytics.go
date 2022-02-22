package analytics

import (
	"context"
	"net/url"

	"cloud.google.com/go/bigquery"
	"github.com/justindfuller/purchaseplan.io/plan"
	"github.com/pkg/errors"
)

// Client encapsulates connections to bigquery.
type Client struct {
	products *bigquery.Table
}

// New creates a new Client.
func New(ctx context.Context, project string) (Client, error) {
	var c Client

	client, err := bigquery.NewClient(ctx, project)
	if err != nil {
		return c, err
	}

	c.products = client.Dataset("default").Table("products")

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
	}); err != nil {
		return errors.Wrap(err, "unable to save product to analytics")
	}
	return nil
}

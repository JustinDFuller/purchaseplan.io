package planner

import (
	"context"
	"html"
	"net/url"
	"sync"
)

// Producter is an interface for retrieving products.
type Producter interface {
	// Product returns a Product and an error.
	Product(ctx context.Context) (Product, error)
}

func mergeProducts(ctx context.Context, producters ...Producter) (Product, error) {
	var wg sync.WaitGroup
	var m sync.Mutex

	errors := make([]error, len(producters))
	products := make([]Product, len(producters))

	for i, p := range producters {
		wg.Add(1)

		i := i
		p := p

		go func() {
			defer wg.Done()

			p, err := p.Product(ctx)
			m.Lock()
			defer m.Unlock()
			if err != nil {
				errors[i] = err
				return
			}
			products[i] = p
		}()
	}

	wg.Wait()

	var p Product

	for _, err := range errors {
		if err != nil {
			return p, err
		}
	}

	for _, product := range products {
		p = p.merge(product)
	}

	return p, nil
}

// merge takes another product and replaces zero values.
func (p Product) merge(p2 Product) Product {
	var merged Product

	merged.Name = p.Name
	if merged.Name == "" {
		merged.Name = p2.Name
	}

	merged.Description = p.Description
	if merged.Description == "" {
		merged.Description = p2.Description
	}

	merged.Price = p.Price
	if merged.Price == 0 {
		merged.Price = p2.Price
	}

	merged.URL = p.URL
	if merged.URL == "" {
		merged.URL = p2.URL
	}

	merged.Image = p.Image
	if merged.Image == "" {
		merged.Image = p2.Image
	}

	merged.OriginalImage = p.OriginalImage
	if merged.OriginalImage == "" {
		merged.OriginalImage = p2.OriginalImage
	}

	return merged
}

func (p Product) Normalize(requestURL string) (Product, error) {
	u, err := normalizeURL(requestURL, p.URL)
	if err != nil {
		return p, err
	}
	p.URL = u

	p.Name = html.UnescapeString(p.Name)
	p.Description = html.UnescapeString(p.Description)

	return p, nil
}

func normalizeURL(requestURL, foundURL string) (string, error) {
	if foundURL == "" {
		return requestURL, nil
	}

	u, err := url.Parse(foundURL)
	if err != nil {
		return "", err
	}
	u.Scheme = "https"

	reqU, err := url.Parse(requestURL)
	if err != nil {
		return "", err
	}

	// Not a valid URL? Fall back to request URL.
	if u.Host == "" {
		return reqU.String(), nil
	}

	return u.String(), nil
}

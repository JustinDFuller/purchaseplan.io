package plan

import (
	"html"
	"net/url"
)

// merge takes another product and replaces zero values.
func (p Product) Merge(p2 Product) Product {
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

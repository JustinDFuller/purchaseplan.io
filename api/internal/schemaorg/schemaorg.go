package schemaorg

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/url"
	"strconv"
	"strings"

	"github.com/PuerkitoBio/goquery"
	planner "github.com/justindfuller/purchase-saving-planner/api"
	"github.com/namsral/microdata"
)

type (
	// graph is the top level of schema.org data.
	// This data is used to retrieve a Product from a URL.
	graph struct {
		Contexts []context `json:"@graph"`
	}

	// context is one of many schema contexts that a website can have.
	// TODO: Change to contextContext
	context struct {
		Context     string      `json:"@context"`
		Type        string      `json:"@type"`
		Description string      `json:"description"`
		Image       interface{} `json:"image"`
		Name        string      `json:"name"`
		URL         string      `json:"url"`
		Offers      struct {
			Price interface{} `json:"price"`
			URL   string      `json:"url"`
		} `json:"offers"`
	}
)

func (c context) ToProduct() planner.Product {
	var price int64

	log.Printf("Price type %T", c.Offers.Price)

	switch p := c.Offers.Price.(type) {
	case string:
		price, _ = strconv.ParseInt(p, 10, 64)
	case float64:
		price = int64(p)
	}

	var image string
	switch i := c.Image.(type) {
	case string:
		image = i
	case []interface{}:
		for _, i := range i {
			if i, ok := i.(string); ok {
				image = i
				break
			}
		}
	}

	url := c.URL
	if url == "" {
		url = c.Offers.URL
	}

	return planner.Product{
		Name:        strings.TrimSpace(c.Name),
		Description: strings.TrimSpace(c.Description),
		Price:       price,
		Image:       image,
		URL:         url,
	}
}

// ParseHTML will attempt to find a Product from an HTML page.
func ParseHTML(URL string, b []byte) (planner.Product, error) {
	var p planner.Product

	doc, err := goquery.NewDocumentFromReader(ioutil.NopCloser(bytes.NewBuffer(b)))
	if err != nil {
		return p, err
	}

	doc.Find(`script[type="application/ld+json"]`).Each(func(i int, s *goquery.Selection) {
		var c context
		json.Unmarshal([]byte(s.Text()), &c)
		if c.Type == "Product" {
			p = c.ToProduct()
		}

		var g graph
		if err := json.Unmarshal([]byte(s.Text()), &g.Contexts); err != nil {
			log.Printf("Found invalid context array, trying graph: %s", err)

			if err := json.Unmarshal([]byte(s.Text()), &g); err != nil {
				log.Printf("Found invalid graph, looking for microdata instead: %s", err)
				return
			}
		}

		log.Printf("Found valid schema from application/ld+json: %v", g)

		for _, c := range g.Contexts {
			if c.Type == "Product" {
				p = c.ToProduct()
				break
			}
		}
	})

	parsedURL, err := url.Parse(URL)
	if err != nil {
		return p, err
	}

	data, err := microdata.ParseHTML(ioutil.NopCloser(bytes.NewBuffer(b)), "", parsedURL)
	if err != nil {
		return p, err
	}

	for _, i := range data.Items {
		if isProduct(i.Types) {
			log.Printf("Convert to product? %s", i)
		}
	}

	return p, nil
}

func isProduct(types []string) bool {
	for _, t := range types {
		if t == "Product" {
			return true
		}
	}

	return false
}

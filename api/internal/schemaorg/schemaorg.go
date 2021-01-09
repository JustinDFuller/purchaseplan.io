package schemaorg

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"strconv"
	"strings"

	"github.com/PuerkitoBio/goquery"
	planner "github.com/justindfuller/purchase-saving-planner/api"
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

	switch p := c.Offers.Price.(type) {
	case string:
		var err error
		price, err = strconv.ParseInt(p, 10, 64)
		if err != nil {
			p, err := strconv.ParseFloat(p, 64)
			if err != nil {
				log.Printf("Error parsing price: %s", err)
			}
			price = int64(p)
		}
	case float64:
		price = int64(p)
	default:
		log.Printf("Price type %T", c.Offers.Price)
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
	case map[string]interface{}:
		url, ok := i["url"].(string)
		if ok {
			image = url
		}
	default:
		log.Printf("Image type %T", c.Image)
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
			if err := json.Unmarshal([]byte(s.Text()), &g); err != nil {
				log.Printf("Found invalid graph, looking for microdata instead: %s", err)
				return
			}
		}

		for _, c := range g.Contexts {
			if c.Type == "Product" {
				p = c.ToProduct()
				break
			}
		}
	})

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

package planner

import (
	"bytes"
	"encoding/json"
	"html"
	"io/ioutil"
	"log"
	"regexp"
	"strconv"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

type (
	//HTMLParser looks through the HTML for certain values.
	// It's not very accurate but can make a last-ditch attempt.
	HTMLParser struct {
		URL  string
		Body []byte
	}

	// MetaTagParser is more accurate than HTMLParser but will not
	// be able to gather all info.
	MetaTagParser struct {
		URL  string
		Body []byte
	}

	// OpenGraphParser is generally very accurate but pricing is not used widely.
	OpenGraphParser struct {
		URL  string
		Body []byte
	}

	// SchemaOrgParser is VERY accurate because it's what is intended to be shown
	// On search engines.
	SchemaOrgParser struct {
		URL  string
		Body []byte
	}

	// DefaultParser combines the above parsers in a single convenient parser.
	DefaultParser struct {
		AmazonParser    AmazonParser
		SchemaOrgParser SchemaOrgParser
		OpenGraphParser OpenGraphParser
		HTMLParser      HTMLParser
		MetaTagParser   MetaTagParser
	}

	// AmazonParser is made specifically for parsing Amazon.com
	AmazonParser struct {
		URL  string
		Body []byte
	}
)

// NewDefaultParser creates a new parser than combines other parsers.
func NewDefaultParser(url string, body []byte) DefaultParser {
	return DefaultParser{
		AmazonParser:    AmazonParser{url, body},
		SchemaOrgParser: SchemaOrgParser{url, body},
		OpenGraphParser: OpenGraphParser{url, body},
		MetaTagParser:   MetaTagParser{url, body},
		HTMLParser:      HTMLParser{url, body},
	}
}

// Product returns the result of combining other Producters.
func (parser DefaultParser) Product() (Product, error) {
	// the order here is important. Top takes precedence,
	// so the more accurate parsers should go first.
	return mergeProducts(
		parser.AmazonParser,
		parser.OpenGraphParser,
		parser.SchemaOrgParser,
		parser.MetaTagParser,
		parser.HTMLParser,
	)
}

// Product parses the HTML for a product.
func (parser HTMLParser) Product() (Product, error) {
	var p Product

	doc, err := goquery.NewDocumentFromReader(ioutil.NopCloser(bytes.NewBuffer(parser.Body)))
	if err != nil {
		log.Printf("HTMLParser error reading document: %s", err)
		return p, err
	}

	var withAlt string
	var withoutAlt string

	doc.Find("img").Each(func(i int, s *goquery.Selection) {
		var foundAlt bool

		src, ok := s.Attr("src")
		if !ok || src == "" {
			return
		}

		alt, ok := s.Attr("alt")
		if ok && alt != "" {
			foundAlt = true
		}

		if p.Description == "" {
			p.Description = alt
		}

		if p.Image == "" && len(src) < 1500 {
			if foundAlt && withAlt == "" {
				withAlt = src
			} else if !foundAlt && withoutAlt == "" {
				withoutAlt = src
			}
		}
	})

	if p.Image == "" {
		if withAlt != "" {
			p.Image = withAlt
		} else {
			p.Image = withoutAlt
		}
	}

	doc.Find(`*`).Each(func(i int, s *goquery.Selection) {
		if p.Price != 0 {
			return
		}

		t := s.Text()
		match, err := regexp.MatchString(`^\$\d{0,5}\.?\d{0,2}$`, t)
		if err == nil && match {
			t := strings.ReplaceAll(t, "$", "")
			f, err := strconv.ParseFloat(t, 64)
			// Somewhat arbitrary guess about the range of prices.
			if err == nil {
				p.Price = int64(f)
			}
		}
	})

	return p, nil
}

// Product parses meta tags for product information.
func (parser MetaTagParser) Product() (Product, error) {
	var p Product

	doc, err := goquery.NewDocumentFromReader(ioutil.NopCloser(bytes.NewBuffer(parser.Body)))
	if err != nil {
		log.Printf("MetaTagParser error reading document: %s", err)
		return p, err
	}

	doc.Find("meta").Each(func(i int, s *goquery.Selection) {
		attr, ok := s.Attr("name")
		content, _ := s.Attr("content")
		if ok {
			switch attr {
			case "title":
				p.Name = content
			case "description":
				p.Description = content
			}
		}
	})

	doc.Find(`link[rel="canonical"]`).Each(func(i int, s *goquery.Selection) {
		href, ok := s.Attr("href")
		if ok {
			p.URL = href
		}
	})

	return p, nil
}

// Product parses opengraph meta tags for product information.
func (parser OpenGraphParser) Product() (Product, error) {
	var p Product

	doc, err := goquery.NewDocumentFromReader(ioutil.NopCloser(bytes.NewBuffer(parser.Body)))
	if err != nil {
		log.Printf("OpenGraph error reading document: %s", err)
		return p, err
	}

	doc.Find("meta").Each(func(i int, s *goquery.Selection) {
		attr, ok := s.Attr("property")
		if !ok {
			attr, ok = s.Attr("name")
		}
		content, _ := s.Attr("content")
		if ok {
			switch attr {
			case "og:title":
				p.Name = content
			case "og:image":
				p.Image = content
			case "og:description":
				p.Description = content
			case "og:url":
				p.URL = content
			case "product:price:amount", "PriceValue", "MSRPValue", "SalePriceValue":
				f, err := strconv.ParseFloat(content, 64)
				if err == nil {
					p.Price = int64(f)
				}
			}
		}
	})

	return p, nil
}

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

func (c context) toProduct() Product {
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

	return Product{
		Name:        strings.TrimSpace(c.Name),
		Description: strings.TrimSpace(c.Description),
		Price:       price,
		Image:       image,
		URL:         url,
	}
}

// Product parses schema org JSON for data about a product.
func (parser SchemaOrgParser) Product() (Product, error) {
	var p Product

	doc, err := goquery.NewDocumentFromReader(ioutil.NopCloser(bytes.NewBuffer(parser.Body)))
	if err != nil {
		return p, err
	}

	doc.Find(`script[type="application/ld+json"]`).Each(func(i int, s *goquery.Selection) {
		var c context
		if err := json.Unmarshal([]byte(s.Text()), &c); err == nil {
			if c.Type == "Product" {
				p = c.toProduct()
			}
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
				p = c.toProduct()
				break
			}
		}
	})

	return p, nil
}

// Product parses amazon.com html for product information.
func (parser AmazonParser) Product() (Product, error) {
	var p Product

	doc, err := goquery.NewDocumentFromReader(ioutil.NopCloser(bytes.NewBuffer(parser.Body)))
	if err != nil {
		return p, err
	}

	doc.Find("#productDescription > p").Each(func(i int, s *goquery.Selection) {
		if t := s.Text(); t != "" {
			p.Description = strings.TrimSpace(html.UnescapeString(t))
		}
	})

	doc.Find("#priceblock_ourprice").Each(func(i int, s *goquery.Selection) {
		if t := s.Text(); t != "" {
			t := strings.TrimSpace(strings.ReplaceAll(t, "$", ""))
			if f, err := strconv.ParseFloat(t, 64); err == nil {
				p.Price = int64(f)
			}
		}
	})

	doc.Find("#productTitle").Each(func(i int, s *goquery.Selection) {
		if t := s.Text(); t != "" {
			p.Name = strings.TrimSpace(t)
		}
	})

	doc.Find("#landingImage").Each(func(i int, s *goquery.Selection) {
		src, ok := s.Attr("data-old-hires")
		if ok && src != "" && len(src) < 1500 {
			p.Image = src
		}
	})

	return p, nil
}

package planner

import (
	"bytes"
	"context"
	"encoding/json"
	"html"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/aws/aws-sdk-go/aws/credentials"
	signer "github.com/aws/aws-sdk-go/aws/signer/v4"
	"github.com/justindfuller/purchaseplan.io/backend/config"
	"github.com/pkg/errors"
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
		AmazonPAPIParser AmazonPAPIParser
		AmazonParser     AmazonParser
		SchemaOrgParser  SchemaOrgParser
		OpenGraphParser  OpenGraphParser
		HTMLParser       HTMLParser
		MetaTagParser    MetaTagParser
	}

	// AmazonParser is made specifically for parsing Amazon.com
	AmazonParser struct {
		URL  string
		Body []byte
	}

	// AmazonPAPIParser parses amazon.com links with their Product API.
	AmazonPAPIParser struct {
		URL    string
		Body   []byte
		config config.C
	}
)

// NewDefaultParser creates a new parser than combines other parsers.
func NewDefaultParser(url string, body []byte, c config.C) DefaultParser {
	return DefaultParser{
		AmazonPAPIParser: AmazonPAPIParser{url, body, c},
		AmazonParser:     AmazonParser{url, body},
		SchemaOrgParser:  SchemaOrgParser{url, body},
		OpenGraphParser:  OpenGraphParser{url, body},
		MetaTagParser:    MetaTagParser{url, body},
		HTMLParser:       HTMLParser{url, body},
	}
}

// Product returns the result of combining other Producters.
func (parser DefaultParser) Product(ctx context.Context) (Product, error) {
	// the order here is important. Top takes precedence,
	// so the more accurate parsers should go first.
	return mergeProducts(
		ctx,
		parser.AmazonPAPIParser,
		parser.AmazonParser,
		parser.OpenGraphParser,
		parser.SchemaOrgParser,
		parser.MetaTagParser,
		parser.HTMLParser,
	)
}

// Product parses the HTML for a product.
func (parser HTMLParser) Product(_ context.Context) (Product, error) {
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
func (parser MetaTagParser) Product(_ context.Context) (Product, error) {
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
func (parser OpenGraphParser) Product(_ context.Context) (Product, error) {
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
				if p.Name == "" {
					p.Name = content
				}
			case "og:image":
				if p.Image == "" {
					p.Image = content
				}
			case "og:description":
				if p.Description == "" {
					p.Description = content
				}
			case "og:url":
				if p.URL == "" {
					p.URL = content
				}
			case "product:price:amount", "PriceValue", "MSRPValue", "SalePriceValue":
				f, err := strconv.ParseFloat(content, 64)
				if err == nil {
					if p.Price == 0 {
						p.Price = int64(f)
					}
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
		Contexts []graphContext `json:"@graph"`
	}

	// context is one of many schema contexts that a website can have.
	graphContext struct {
		Context     string      `json:"@context"`
		Type        string      `json:"@type"`
		Description string      `json:"description"`
		Image       interface{} `json:"image"`
		Name        string      `json:"name"`
		URL         string      `json:"url"`
		Offers      interface{} `json:"offers"`
	}

	offer struct {
		Price interface{} `json:"price"`
		URL   string      `json:"url"`
	}
)

func (c graphContext) toProduct() Product {
	var price int64

	var offers []offer

	switch o := c.Offers.(type) {
	case []interface{}:
		for _, o := range o {
			if o, ok := o.(map[string]interface{}); ok {
				var offer offer
				p, ok := o["price"]
				if ok {
					offer.Price = p
				}

				u, ok := o["url"].(string)
				if ok {
					offer.URL = u
				}

				offers = append(offers, offer)
			}
		}
	case interface{}:
		if o, ok := o.(map[string]interface{}); ok {
			var offer offer
			p, ok := o["price"]
			if ok {
				offer.Price = p
			}

			u, ok := o["url"].(string)
			if ok {
				offer.URL = u
			}

			offers = append(offers, offer)
		}
	default:
		log.Printf("Found other offer: %v", o)
	}

	for _, offer := range offers {
		if price != 0 {
			break
		}

		switch p := offer.Price.(type) {
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
			log.Printf("Price type %T", offer.Price)
		}
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
	for _, offer := range offers {
		if url == "" {
			url = offer.URL
		}
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
func (parser SchemaOrgParser) Product(_ context.Context) (Product, error) {
	var p Product

	doc, err := goquery.NewDocumentFromReader(ioutil.NopCloser(bytes.NewBuffer(parser.Body)))
	if err != nil {
		return p, err
	}

	doc.Find(`script[type="application/ld+json"]`).Each(func(i int, s *goquery.Selection) {

		var c graphContext

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
func (parser AmazonParser) Product(_ context.Context) (Product, error) {
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

	doc.Find("#imgBlkFront").Each(func(i int, s *goquery.Selection) {
		if p.Image != "" {
			return
		}

		src, ok := s.Attr("src")
		if ok && src != "" && len(src) < 1500 {
			p.Image = src
		}
	})

	return p, nil
}

type PAPIResponse struct {
	Errors []struct {
		Message string
	}
	ItemsResult struct {
		Items []struct {
			DetailPageURL string
			ItemInfo      struct {
				Title struct {
					DisplayValue string
				}
			}
			Offers struct {
				Listings []struct {
					Price struct {
						Amount float64
					}
				}
			}
			Images struct {
				Primary struct {
					Large struct {
						URL string
					}
				}
			}
		}
	}
}

type PAPIRequest struct {
	ItemIds     []string
	PartnerTag  string
	PartnerType string
	Marketplace string
	Operation   string
	Resources   []string
}

func (parser AmazonPAPIParser) Product(ctx context.Context) (Product, error) {
	var p Product

	u, err := url.Parse(parser.URL)
	if err != nil {
		return p, err
	}

	domains := []string{
		"amazon.com",
		"www.amazon.com",
		"smile.amazon.com",
	}

	var found bool
	for _, domain := range domains {
		if domain == u.Hostname() {
			found = true
			break
		}
	}

	if !found {
		return p, nil
	}

	paths := strings.Split(u.Path, "/")
	if l := len(paths); l < 3 {
		return p, errors.Errorf("invalid path: not enough paths: expected 3, got %d", l)
	}

	var asin int
	for i, path := range paths {
		if path == "dp" {
			asin = i + 1
		}
	}

	if asin == 0 || len(paths)-1 < asin {
		return p, errors.Errorf("invalid path: should contain dp, got %s", u.Path)
	}

	if path := paths[asin]; path == "" || len(path) != 10 {
		return p, errors.Errorf("invalid path: second path should be ASIN code, got %s", path)
	}

	body, err := json.Marshal(&PAPIRequest{
		ItemIds:     []string{paths[asin]},
		PartnerTag:  "purchaseplan-20",
		PartnerType: "Associates",
		Marketplace: "www.amazon.com",
		Operation:   "GetItems",
		Resources: []string{
			"ItemInfo.Title",
			"Images.Primary.Large",
			"Offers.Listings.Price",
		},
	})
	if err != nil {
		return p, errors.Wrap(err, "unable to create PAPI request")
	}

	b := bytes.NewReader(body)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, "https://webservices.amazon.com/paapi5/getitems", b)
	if err != nil {
		return p, errors.Wrap(err, "error making PAPI request")
	}

	req.Header.Set("Accept", "application/json, text/javascript")
	req.Header.Set("Accept-Language", "en-US")
	req.Header.Set("Content-Type", "application/json; charset=UTF-8")
	req.Header.Set("X-Amz-Target", "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems")
	req.Header.Set("Content-Encoding", "amz-1.0")

	creds := credentials.NewStaticCredentials(parser.config.AmazonPAPIAccessKey, parser.config.AmazonPAPISecretKey, "")
	if _, err := signer.NewSigner(creds).Sign(req, b, "ProductAdvertisingAPI", "us-east-1", time.Now()); err != nil {
		return p, errors.Wrap(err, "unable to sign PAPI request")
	}

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return p, errors.Wrap(err, "error sending request to PAPI")
	}

	var r PAPIResponse
	if err := json.NewDecoder(res.Body).Decode(&r); err != nil {
		return p, errors.Wrap(err, "error decoding PAPI response")
	}

	if len(r.ItemsResult.Items) == 0 {
		return p, errors.New("PAPI returned no items")
	}

	p.Name = r.ItemsResult.Items[0].ItemInfo.Title.DisplayValue
	p.URL = r.ItemsResult.Items[0].DetailPageURL
	p.Image = r.ItemsResult.Items[0].Images.Primary.Large.URL

	if len(r.ItemsResult.Items[0].Offers.Listings) > 0 {
		p.Price = int64(r.ItemsResult.Items[0].Offers.Listings[0].Price.Amount)
	}

	return p, nil
}

package metatags

import (
	"bytes"
	"io/ioutil"
	"log"

	"github.com/PuerkitoBio/goquery"
	planner "github.com/justindfuller/purchase-saving-planner/api"
)

// ParseHTML parses the html for OpenGraph tags and returns a product.
func ParseHTML(URL string, b []byte) (planner.Product, error) {
	var p planner.Product

	doc, err := goquery.NewDocumentFromReader(ioutil.NopCloser(bytes.NewBuffer(b)))
	if err != nil {
		log.Printf("OpenGraph error reading document: %s", err)
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

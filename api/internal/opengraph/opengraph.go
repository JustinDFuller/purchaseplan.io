package opengraph

import (
	"bytes"
	"io/ioutil"
	"log"
	"strconv"

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

		attr, ok := s.Attr("property")
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
			case "product:price:amount":
				f, err := strconv.ParseFloat(content, 64)
				if err == nil {
					p.Price = int64(f)
				}
			}
		}
	})

	return p, nil
}

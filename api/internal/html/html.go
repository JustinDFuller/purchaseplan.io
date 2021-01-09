package html

import (
	"bytes"
	"io/ioutil"
	"log"
	"regexp"
	"strconv"
	"strings"

	"github.com/PuerkitoBio/goquery"
	planner "github.com/justindfuller/purchase-saving-planner/api"
)

// ParseHTML parses the html for images and prices.
func ParseHTML(URL string, b []byte) (planner.Product, error) {
	var p planner.Product

	doc, err := goquery.NewDocumentFromReader(ioutil.NopCloser(bytes.NewBuffer(b)))
	if err != nil {
		log.Printf("OpenGraph error reading document: %s", err)
		return p, err
	}

	doc.Find("img").Each(func(i int, s *goquery.Selection) {
		src, ok := s.Attr("src")
		if !ok || src == "" {
			return
		}

		alt, ok := s.Attr("alt")
		if !ok || alt == "" {
			return
		}

		if p.Description == "" {
			p.Description = alt
		}

		if p.Image == "" && len(src) < 1500 {
			p.Image = src
		}
	})

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

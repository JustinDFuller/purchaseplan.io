package plan

import (
	"html"
	"log"
	"net/url"
	"strings"

	"github.com/google/uuid"
	"github.com/pkg/errors"
)

type Processor func(*User) error

var Processors = []Processor{
	// Process validation after defaults to account for missing values.
	ProcessDefaults,
	ProcessValidation,
	ProcessSaved,
	ProcessLastPaycheck,
	ProcessPurchaseAvailability,
	ProcessProducts,
}

func Process(u *User) error {
	for _, p := range Processors {
		if err := p(u); err != nil {
			return err
		}
	}
	return nil
}

func ProcessDefaults(u *User) error {
	if u.ID == "" {
		id, err := uuid.NewRandom()
		if err != nil {
			return errors.Wrap(err, "error creating user ID")
		}
		u.ID = id.String()
	}

	// A quick google search shows that bi-weekly is the most
	// common pay frequency in the US.
	if u.Frequency == "" {
		u.Frequency = biweekly
	}

	// Can't process availabilities without last paycheck.
	if u.LastPaycheck == nil {
		u.LastPaycheck = now()
	}

	for i := range u.Purchases {
		if u.Purchases[i].ID == "" {
			id, err := newID()
			if err != nil {
				return err
			}
			u.Purchases[i].ID = id
		}

		if u.Purchases[i].Quantity < 1 {
			u.Purchases[i].Quantity = 1
		}
	}

	return nil
}

func ProcessValidation(u *User) error {
	if u.Email == "" {
		return ErrMissingEmail
	}

	frequencies := []frequency{
		weekly,
		biweekly,
		monthly,
		twiceMonthly,
	}

	var found bool
	for _, f := range frequencies {
		if f == u.Frequency {
			found = true
		}
	}

	if !found {
		return ErrInvalidFrequency
	}

	for _, p := range u.Purchases {
		if p.Product.Name == "" {
			return ErrMissingProductName
		}

		if p.Product.Price == 0 {
			return ErrMissingProductPrice
		}
	}

	return nil
}

func ProcessSaved(u *User) error {
	f, err := NewFrequency(u)
	if err != nil {
		return err
	}

	if f == nil {
		return ErrInvalidAvailability
	}

	saved, err := f.Saved()
	if err != nil {
		return err
	}

	u.Saved = saved
	return nil
}

func ProcessLastPaycheck(u *User) error {
	f, err := NewFrequency(u)
	if err != nil {
		return err
	}

	if f == nil {
		return ErrInvalidAvailability
	}

	lastPaycheck, err := f.LastPaycheck()
	if err != nil {
		return err
	}

	u.LastPaycheck = lastPaycheck
	return nil
}

func ProcessPurchaseAvailability(u *User) error {
	if u.Contributions == 0 {
		return nil
	}

	f, err := NewFrequency(u)
	if err != nil {
		return err
	}

	if f == nil {
		return ErrInvalidAvailability
	}

	for i, p := range u.Purchases {
		d, err := f.PurchaseDate(&p)
		if err != nil {
			return err
		}

		p.Date = d
		u.Purchases[i] = p
	}

	return nil
}

func ProcessProducts(u *User) error {
	for i, purchase := range u.Purchases {
		u.Purchases[i].Product.Name = html.UnescapeString(purchase.Product.Name)
		u.Purchases[i].Product.Description = html.UnescapeString(purchase.Product.Description)
		u.Purchases[i].Product.AffiliateURL = processAffiliateURL(purchase.Product.URL)
	}
	return nil
}

func processAffiliateURL(original string) string {
	u, err := url.Parse(original)
	if err != nil {
		log.Printf("error parsing original url: %s", err)
		return ""
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
		return ""
	}

	paths := strings.Split(u.Path, "/")
	if l := len(paths); l < 3 {
		log.Printf("invalid path: not enough paths: expected 3, got %d", l)
		return ""
	}

	var foundASIN bool
	for i, path := range paths {
		if len(path) == 10 && paths[i-1] == "dp" {
			foundASIN = true
		}
	}

	if !foundASIN {
		log.Printf("invalid path: asin not found: %s", u)
		return ""
	}

	q := u.Query()
	q.Set("tag", "purchaseplan-20")
	u.RawQuery = q.Encode()

	return u.String()
}

package planner

import "time"

type (
	// User is the top level struct for, you guessed it, user data.
	// The data is stored in an object database, so purchases
	// Are stored as a property on the user, rather than by association.
	User struct {
		Email         string     `json:"email"`
		Saved         int64      `json:"saved"`
		Contributions int64      `json:"contributions"`
		Frequency     string     `json:"frequency"`
		LastPaycheck  *time.Time `json:"lastPaycheck"`
		Purchases     []Purchase `json:"purchases"`
	}

	// Purchase is something a User wants to buy.
	// TODO: Link it more appropriately with Product.
	Purchase struct {
		Date    *time.Time `json:"date"`
		Product Product    `json:"product"`
	}

	// Product contains information about the thing a User wants to buy.
	Product struct {
		Name           string   `json:"name"`
		Description    string   `json:"description"`
		Price          int64    `json:"price"`
		URL            string   `json:"url"`
		Image          string   `json:"image"`
		OriginalImage  string   `json:"originalImage"`
		PossibleImages []string `json:"possibleImages"`
	}
)

// Merge takes another product and replaces zero values.
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

	merged.PossibleImages = p.PossibleImages
	if merged.PossibleImages == nil {
		merged.PossibleImages = p2.PossibleImages
	}

	return merged
}

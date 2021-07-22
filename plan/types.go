package plan

import "time"

type (
	// User is the top level struct for, you guessed it, user data.
	// The data is stored in an object database, so purchases
	// Are stored as a property on the user, rather than by association.
	User struct {
		Email         string     `json:"email"`
		Saved         int64      `json:"saved,omitempty"`
		Contributions int64      `json:"contributions,omitempty"`
		Frequency     Frequency  `json:"frequency,omitempty"`
		LastPaycheck  *time.Time `json:"lastPaycheck,omitempty"`
		Purchases     []Purchase `json:"purchases,omitempty"`
	}

	// Purchase is something a User wants to buy.
	Purchase struct {
		ID          string     `json:"id"`
		Deleted     bool       `json:"deleted"`
		Purchased   bool       `json:"purchased"`
		PurchasedAt *time.Time `json:"purchasedAt"`
		Date        *time.Time `json:"date"`
		Product     Product    `json:"product"`
		Quantity    int32      `json:"quantity"`
	}

	// Product contains information about the thing a User wants to buy.
	Product struct {
		Name          string `datastore:",noindex" json:"name"`
		Description   string `datastore:",noindex" json:"description"`
		Price         int64  `json:"price"`
		URL           string `json:"url"`
		Image         string `json:"image"`
		OriginalImage string `datastore:",noindex" json:"originalImage"`
	}

	Frequency string
)

const (
	EveryWeek   Frequency = "Every Week"
	Every2Weeks           = "Every 2 Weeks"
	OnceAMonth            = "Once A Month"
)

package plan

import "time"

type (
	// User is the top level struct for, you guessed it, user data.
	// The data is stored in an object database, so purchases
	// Are stored as a property on the user, rather than by association.
	User struct {
		ID                     string                  `json:"id"`
		Issuer                 string                  `json:"issuer"`
		Email                  string                  `json:"email"`
		Saved                  int64                   `json:"saved,omitempty"`
		Contributions          int64                   `json:"contributions,omitempty"`
		Frequency              frequency               `json:"frequency,omitempty"`
		LastPaycheck           *time.Time              `json:"lastPaycheck,omitempty"`
		Purchases              []Purchase              `json:"purchases,omitempty"`
		PushNotificationTokens []PushNotificationToken `json:"pushNotificationTokens,omitempty"`
	}

	// Purchase is something a User wants to buy.
	Purchase struct {
		ID          string     `json:"id"`
		Deleted     bool       `json:"deleted"`
		Purchased   bool       `json:"purchased"`
		PurchasedAt *time.Time `json:"purchasedAt"`
		Date        *time.Time `json:"date"`
		Product     Product    `json:"product"`
		Quantity    int64      `json:"quantity"`
		Notified    bool       `json:"notified"`
	}

	// Product contains information about the thing a User wants to buy.
	Product struct {
		Name          string `datastore:",noindex" json:"name"`
		Description   string `datastore:",noindex" json:"description"`
		Price         int64  `json:"price"`
		URL           string `datastore:",noindex" json:"url"`
		AffiliateURL  string `datastore:",noindex" json:"affiliateURL"`
		Image         string `datastore:",noindex" json:"image"`
		OriginalImage string `datastore:",noindex" json:"originalImage"`
	}

	frequency string

	// PushNotificationToken is used to save a user's device and expo push tokens.
	// It also stores the type of push token, which determines where to send manual
	// push notifications to if expo notifications don't work.
	PushNotificationToken struct {
		// DeviceToken is the IOS or Android device's push notification token.
		DeviceToken string `datastore:",noindex" json:"deviceToken,omitempty"`
		// DeviceTokenType is "ios" or "android"
		DeviceTokenType string `datastore:",noindex" json:"deviceTokenType,omitempty"`
		// Expo token is used to send messages with expo's push notification service.
		ExpoToken string `datastore:",noindex" json:"expoToken,omitempty"`
	}
)

const (
	weekly       frequency = "Every Week"
	biweekly               = "Every 2 Weeks"
	monthly                = "Once A Month"
	twiceMonthly           = "1st and 15th"
)

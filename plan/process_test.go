package plan

import (
	"errors"
	"reflect"
	"testing"
	"time"

	"github.com/kr/pretty"
)

func TestProcess(t *testing.T) {
	// During tests, we need time.Now to always return the same value.
	now = func() *time.Time {
		n := time.Date(2020, time.July, 22, 10, 43, 0, 0, time.UTC)
		return &n
	}

	newID = func() (string, error) {
		return "776867e6-c0e4-4911-9789-7dcee8a5678f", nil
	}

	tests := []struct {
		name     string
		given    User
		expected User
		error    error
	}{
		{
			name:     "process_validation_missing_email",
			given:    User{},
			expected: User{},
			error:    ErrMissingEmail,
		},
		{
			name: "process_defaults",
			given: User{
				Email: "foobar",
				Purchases: []Purchase{
					{
						ID: "",
						Product: Product{
							Name:  "test",
							URL:   "https://example.com",
							Price: 1,
						},
					},
				},
			},
			expected: User{
				Email:        "foobar",
				Frequency:    Biweekly,
				LastPaycheck: now(),
				Purchases: []Purchase{
					{
						ID: "776867e6-c0e4-4911-9789-7dcee8a5678f",
						Product: Product{
							Name:  "test",
							URL:   "https://example.com",
							Price: 1,
						},
					},
				},
			},
		},
		{
			name: "process_validation_purchase_product_name",
			given: User{
				Email: "foobar",
				Purchases: []Purchase{
					{
						ID:      "0747aef7-fd62-4daa-973f-733b1190961f",
						Product: Product{},
					},
				},
			},
			error: ErrMissingProductName,
		},
		{
			name: "process_validation_purchase_product_price",
			given: User{
				Email: "foobar",
				Purchases: []Purchase{
					{
						ID: "0747aef7-fd62-4daa-973f-733b1190961f",
						Product: Product{
							Name: "my product",
						},
					},
				},
			},
			error: ErrMissingProductPrice,
		},
		{
			name: "process_validation_purchase_product_URL",
			given: User{
				Email: "foobar",
				Purchases: []Purchase{
					{
						ID: "0747aef7-fd62-4daa-973f-733b1190961f",
						Product: Product{
							Name:  "my product",
							Price: 10,
						},
					},
				},
			},
			error: ErrMissingProductURL,
		},
		{
			name: "process_validation_frequency",
			given: User{
				Email:     "foobar",
				Frequency: "Invalid",
			},
			error: ErrInvalidFrequency,
		},
		{
			name: "process_availability_weekly",
			given: User{
				Email:         "foobar",
				Frequency:     Weekly,
				Contributions: 100,
				LastPaycheck:  now(),
				Purchases: []Purchase{
					{
						ID:      "0747aef7-fd62-4daa-973f-733b1190961f",
						Deleted: true,
						Product: Product{
							URL:   "https://example.com",
							Name:  "deleted",
							Price: 100,
						},
					},
					{
						ID:        "18a0dc32-b08e-495a-b0bc-bac0fb51e6e2",
						Purchased: true,
						Product: Product{
							URL:   "https://example.com",
							Name:  "deleted",
							Price: 100,
						},
					},
					{
						ID:       "3b557e55-76a4-4023-87bd-90bc6dc14eeb",
						Quantity: 2,
						Product: Product{
							URL:   "https://example.com",
							Name:  "test",
							Price: 300,
						},
					},
				},
			},
			expected: User{
				Email:         "foobar",
				Frequency:     Weekly,
				Contributions: 100,
				LastPaycheck:  now(),
				Purchases: []Purchase{
					{
						ID:      "0747aef7-fd62-4daa-973f-733b1190961f",
						Deleted: true,
						Product: Product{
							URL:   "https://example.com",
							Name:  "deleted",
							Price: 100,
						},
					},
					{
						ID:        "18a0dc32-b08e-495a-b0bc-bac0fb51e6e2",
						Purchased: true,
						Product: Product{
							URL:   "https://example.com",
							Name:  "deleted",
							Price: 100,
						},
					},
					{
						ID:       "3b557e55-76a4-4023-87bd-90bc6dc14eeb",
						Quantity: 2,
						Date:     fromNow(time.Hour * 24 * 7 * 6),
						Product: Product{
							URL:   "https://example.com",
							Name:  "test",
							Price: 300,
						},
					},
				},
			},
		},
		{
			name: "process_availability_weekly_no_contributions",
			given: User{
				Email:        "foobar",
				Frequency:    Weekly,
				LastPaycheck: now(),
				Purchases: []Purchase{
					{
						ID:       "0747aef7-fd62-4daa-973f-733b1190961f",
						Quantity: 2,
						Product: Product{
							URL:   "https://example.com",
							Name:  "test",
							Price: 300,
						},
					},
				},
			},
			expected: User{
				Email:        "foobar",
				Frequency:    Weekly,
				LastPaycheck: now(),
				Purchases: []Purchase{
					{
						ID:       "0747aef7-fd62-4daa-973f-733b1190961f",
						Quantity: 2,
						Product: Product{
							URL:   "https://example.com",
							Name:  "test",
							Price: 300,
						},
					},
				},
			},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if err := Process(&test.given); err != nil {
				if test.error == nil {
					t.Fatal(err)
				}

				if test.error != nil {
					if !errors.Is(err, test.error) {
						t.Fatalf("Expected '%s', got '%s'.", test.error, err)
					}

					// Stop if an error is expected.
					return
				}
			}

			if test.error != nil {
				t.Fatalf("Expected error: %s", test.error)
			}

			if !reflect.DeepEqual(test.given, test.expected) {
				diff := pretty.Diff(test.given, test.expected)
				for _, d := range diff {
					t.Log(d)
				}
				t.Fatal("Actual vs Expected")
			}
		})
	}
}

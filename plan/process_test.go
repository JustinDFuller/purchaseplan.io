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
			},
			expected: User{
				Email:        "foobar",
				Frequency:    Biweekly,
				LastPaycheck: now(),
			},
		},
		{
			name: "process_validation_purchase_product_name",
			given: User{
				Email: "foobar",
				Purchases: []Purchase{
					{
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

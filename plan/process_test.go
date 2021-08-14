package plan

import (
	"errors"
	"testing"
	"time"

	"github.com/google/go-cmp/cmp"
)

func TestProcess(t *testing.T) {
	// During tests, we need time.Now to always return the same value.
	mockNow := func() *time.Time {
		n := time.Date(2020, time.July, 22, 10, 43, 0, 0, time.UTC)
		return &n
	}

	newID = func() (string, error) {
		return "776867e6-c0e4-4911-9789-7dcee8a5678f", nil
	}

	now = mockNow

	tests := []struct {
		name     string
		given    User
		expected User
		error    error
		now      func() *time.Time
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
			name: "process_last_paycheck_weekly",
			given: User{
				Email:         "foobar",
				Frequency:     Weekly,
				Contributions: 100,
				LastPaycheck:  fromNow(-oneDay * 8),
			},
			expected: User{
				Email:         "foobar",
				Frequency:     Weekly,
				Contributions: 100,
				LastPaycheck:  fromNow(-oneDay),
			},
		},
		{
			name: "process_last_paycheck_biweekly",
			given: User{
				Email:         "foobar",
				Frequency:     Biweekly,
				Contributions: 100,
				LastPaycheck:  fromNow(-oneDay * 15),
			},
			expected: User{
				Email:         "foobar",
				Frequency:     Biweekly,
				Contributions: 100,
				LastPaycheck:  fromNow(-oneDay),
			},
		},
		{
			name: "process_last_paycheck_monthly",
			given: User{
				Email:         "foobar",
				Frequency:     Monthly,
				Contributions: 100,
				LastPaycheck:  fromNow(-oneDay * 32),
			},
			expected: User{
				Email:         "foobar",
				Frequency:     Monthly,
				Contributions: 100,
				LastPaycheck:  fromNow(-oneDay * 2),
			},
		},
		{
			name: "process_last_paycheck_twicemonthly_(15th)",
			given: User{
				Email:         "foobar",
				Frequency:     TwiceMonthly,
				Contributions: 100,
			},
			expected: User{
				Email:         "foobar",
				Frequency:     TwiceMonthly,
				Contributions: 100,
				LastPaycheck:  fromNow(-oneWeek),
			},
		},
		{
			name: "process_last_paycheck_twicemonthly_(1st)",
			given: User{
				Email:         "foobar",
				Frequency:     TwiceMonthly,
				Contributions: 100,
			},
			expected: User{
				Email:         "foobar",
				Frequency:     TwiceMonthly,
				Contributions: 100,
				LastPaycheck:  fromNow(-oneDay * 21),
			},
			now: func() *time.Time {
				n := time.Date(2020, time.July, 12, 10, 43, 0, 0, time.UTC)
				return &n
			},
		},
		{
			name: "process_availability_weekly",
			given: User{
				Email:         "foobar",
				Frequency:     Weekly,
				Contributions: 100,
				LastPaycheck:  fromNow(-oneWeek * 2),
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
						Date:     fromNow(oneWeek * 6),
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
			name: "process_availability_weekly_off_week",
			given: User{
				Email:         "foobar",
				Frequency:     Weekly,
				Contributions: 100,
				LastPaycheck:  fromNow(-(oneWeek + (oneDay))),
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
				LastPaycheck:  fromNow(-oneDay),
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
						Date:     fromNow(-oneDay + oneWeek*6),
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
		{
			name: "process_availability_biweekly",
			given: User{
				Email:         "foobar",
				Frequency:     Biweekly,
				Contributions: 100,
				LastPaycheck:  fromNow(-oneWeek * 2),
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
				Frequency:     Biweekly,
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
						Date:     fromNow(oneWeek * 12),
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
			name: "process_availability_biweekly_off_week",
			given: User{
				Email:         "foobar",
				Frequency:     Biweekly,
				Contributions: 100,
				LastPaycheck:  fromNow(-(oneWeek*2 + oneDay)),
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
				Frequency:     Biweekly,
				Contributions: 100,
				LastPaycheck:  fromNow(-oneDay),
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
						Date:     fromNow(-oneDay + oneWeek*12),
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
			name: "process_availability_biweekly_no_contributions",
			given: User{
				Email:        "foobar",
				Frequency:    Biweekly,
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
				Frequency:    Biweekly,
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
		{
			name: "process_availability_monthly",
			given: User{
				Email:         "foobar",
				Frequency:     Monthly,
				Contributions: 100,
				LastPaycheck:  fromNow(-oneWeek * 5),
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
				Frequency:     Monthly,
				Contributions: 100,
				LastPaycheck:  fromNow(-oneWeek + oneDay*2),
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
						Date:     fromNow(oneWeek*25 + oneDay*4),
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
			name: "process_availability_twicemonthly_15th",
			given: User{
				Email:         "foobar",
				Frequency:     TwiceMonthly,
				Contributions: 100,
				LastPaycheck:  now(), // July 15th
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
				Frequency:     TwiceMonthly,
				Contributions: 100,
				LastPaycheck:  fromNow(-oneWeek),
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
						Date:     fromNow(oneWeek*12 + oneDay),
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
			name: "process_availability_twicemonthly_1st",
			given: User{
				Email:         "foobar",
				Frequency:     TwiceMonthly,
				Contributions: 100,
				LastPaycheck:  fromNow(-oneWeek * 50), // July 1st
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
				Frequency:     TwiceMonthly,
				Contributions: 100,
				LastPaycheck:  fromNow(-oneWeek * 3),
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
						Date:     fromNow(oneWeek*10 + oneDay),
						Product: Product{
							URL:   "https://example.com",
							Name:  "test",
							Price: 300,
						},
					},
				},
			},
			now: func() *time.Time {
				n := time.Date(2020, time.July, 5, 10, 43, 0, 0, time.UTC)
				return &n
			},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			now = mockNow
			if test.now != nil {
				now = test.now
			}

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

			if diff := cmp.Diff(test.expected, test.given); diff != "" {
				t.Errorf("(-expected +actual):\n%s", diff)
			}
		})
	}
}

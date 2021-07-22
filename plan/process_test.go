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
				Frequency:    Every2Weeks,
				LastPaycheck: now(),
			},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if err := Process(&test.given); err != nil {
				if test.error == nil {
					t.Fatal(err)
				}

				if !errors.Is(err, test.error) {
					t.Fatalf("Expected '%s', got '%s'.", test.error, err)
				}
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

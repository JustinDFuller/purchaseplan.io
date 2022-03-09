package plan

import (
	"testing"
	"time"
)

func TestCanNotify(t *testing.T) {
	tests := []struct {
		name     string
		purchase Purchase
		expected bool
	}{
		{
			name: "already_notified",
			purchase: Purchase{
				Notified: true,
			},
			expected: false,
		},
		{
			name: "not_ready",
			purchase: Purchase{
				Notified: false,
				Date:     fromNow(time.Hour),
			},
			expected: false,
		},
		{
			name: "purchased",
			purchase: Purchase{
				Notified:  false,
				Date:      fromNow(-time.Hour),
				Purchased: true,
			},
			expected: false,
		},
		{
			name: "deleted",
			purchase: Purchase{
				Notified:  false,
				Date:      fromNow(-time.Hour),
				Purchased: false,
				Deleted:   true,
			},
			expected: false,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if c := test.purchase.CanNotify(); c != test.expected {
				t.Errorf("Expected %v, got %v", test.expected, c)
			}
		})
	}
}

package user

import (
	"reflect"
	"testing"
	"time"

	plan "github.com/justindfuller/purchaseplan.io/plan"
	"github.com/kr/pretty"
)

func TestUser(t *testing.T) {
	tests := []struct {
		name   string
		action plan.Actioner
		user   plan.User
	}{
		{
			name: "set_last_paycheck",
			action: SetLastPaycheck{
				Date: "2018-07-22",
			},
			user: plan.User{
				LastPaycheck: date(2018, time.July, 22, 0, 0, 0, 0, time.UTC),
			},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			var u plan.User
			if err := test.action.Act(&u); err != nil {
				t.Error(err)
			}

			if !reflect.DeepEqual(&test.user, &u) {
				for _, d := range pretty.Diff(&test.user, &u) {
					t.Log(d)
				}
				t.Error("Expected vs Actual")
			}
		})
	}
}

func date(year int, month time.Month, day, hour, minute, second, nsecond int, loc *time.Location) *time.Time {
	d := time.Date(year, month, day, hour, minute, second, nsecond, loc)
	return &d
}

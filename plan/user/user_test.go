package user

import (
	"errors"
	"reflect"
	"testing"
	"time"

	plan "github.com/justindfuller/purchaseplan.io/plan"
	"github.com/kr/pretty"
)

func TestUser(t *testing.T) {
	tests := []struct {
		name   string
		action plan.Action
		given  plan.User
		want   plan.User
		err    error
	}{
		{
			name: "set_last_paycheck",
			action: SetLastPaycheck{
				Date: "2018-07-22",
			},
			want: plan.User{
				LastPaycheck: date(2018, time.July, 22, 0, 0, 0, 0, time.UTC),
			},
		},
		{
			name: "update_last_paycheck",
			action: SetLastPaycheck{
				Date: "2020-04-02",
			},
			given: plan.User{
				LastPaycheck: date(2018, time.July, 22, 0, 0, 0, 0, time.UTC),
			},
			want: plan.User{
				LastPaycheck: date(2020, time.April, 2, 0, 0, 0, 0, time.UTC),
			},
		},
		{
			name: "missing_date",
			action: SetLastPaycheck{
				Date: "",
			},
			err: ErrMissingDate,
		},
		{
			name: "invalid_date",
			action: SetLastPaycheck{
				Date: "09-02-202009-02-2020",
			},
			err: ErrInvalidDate,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			err := test.action.Act(&test.given)

			if test.err == nil && err != nil {
				t.Fatal(err)
			}

			if test.err != nil && !errors.Is(err, test.err) {
				t.Fatalf("Got error '%s' wanted '%s'", err, test.err)
			}

			if !reflect.DeepEqual(&test.want, &test.given) {
				for _, d := range pretty.Diff(&test.want, &test.given) {
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

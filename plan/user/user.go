package user

import (
	"time"

	"github.com/justindfuller/purchaseplan.io/plan"
	"github.com/pkg/errors"
)

type SetLastPaycheck struct {
	Date string
}

func (s SetLastPaycheck) Act(u *plan.User) error {
	d, err := time.Parse("2006-01-02", s.Date)
	if err != nil {
		return errors.Wrap(err, "error parsing time SetLastPaycheck.Act")
	}

	u.LastPaycheck = &d

	return nil
}

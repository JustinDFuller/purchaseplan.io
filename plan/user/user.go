package user

import (
	"fmt"
	"time"

	"github.com/justindfuller/purchaseplan.io/plan"
	"github.com/pkg/errors"
)

var (
	ErrMissingDate = errors.New("missing date")
	ErrInvalidDate = errors.New("invalid date format")
)

const (
	ActionSetLastPaycheck = "setLastPaycheck"
)

type SetLastPaycheck struct {
	Date string
}

func (s SetLastPaycheck) Act(u *plan.User) error {
	if s.Date == "" {
		return ErrMissingDate
	}

	d, err := time.Parse("2006-01-02", s.Date)
	if err != nil {
		return fmt.Errorf("%w: %v", ErrInvalidDate, err)
	}

	u.LastPaycheck = &d

	return nil
}

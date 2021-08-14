package plan

import (
	"time"
)

type PurchaseCalculator interface {
	Calculate(*User, *Purchase) (*time.Time, error)
	LastPaycheck(*User) (*time.Time, error)
}

func GetPurchaseCalculator(u *User) (PurchaseCalculator, error) {
	switch u.Frequency {
	case Weekly:
		return WeeklyCalculator{
			Contributions: u.Contributions,
		}, nil
	case Biweekly:
		return BiWeeklyCalculator{
			Contributions: u.Contributions,
		}, nil
	case Monthly:
		return MonthlyCalculator{
			Contributions: u.Contributions,
		}, nil
	case TwiceMonthly:
		return TwiceMonthlyCalculator{
			Contributions: u.Contributions,
		}, nil
	}

	return nil, ErrInvalidAvailabilityCalculator
}

type WeeklyCalculator struct {
	Contributions int64
}

func (w WeeklyCalculator) Calculate(u *User, p *Purchase) (*time.Time, error) {
	var total int64

	if p.Deleted || p.Purchased {
		return nil, nil
	}

	for _, p := range u.Purchases {
		if p.Deleted || p.Purchased {
			continue
		}

		total += p.Quantity * p.Product.Price
	}

	s := u.Saved
	n, err := w.LastPaycheck(u)
	if err != nil {
		return nil, err
	}

	for s < total {
		d := n.Add(oneWeek)
		n = &d
		s += u.Contributions
	}

	return n, nil
}

func (w WeeklyCalculator) LastPaycheck(u *User) (*time.Time, error) {
	lastPaycheck := *u.LastPaycheck
	n := now()

	for n.Sub(lastPaycheck) >= oneWeek {
		lastPaycheck = lastPaycheck.Add(oneWeek)
	}

	return &lastPaycheck, nil
}

type BiWeeklyCalculator struct {
	Contributions int64
}

func (w BiWeeklyCalculator) Calculate(u *User, p *Purchase) (*time.Time, error) {
	var total int64

	if p.Deleted || p.Purchased {
		return nil, nil
	}

	for _, p := range u.Purchases {
		if p.Deleted || p.Purchased {
			continue
		}

		total += p.Quantity * p.Product.Price
	}

	s := u.Saved
	n, err := w.LastPaycheck(u)
	if err != nil {
		return nil, err
	}

	for s < total {
		d := n.Add(oneWeek * 2)
		n = &d
		s += u.Contributions
	}

	return n, nil
}

func (w BiWeeklyCalculator) LastPaycheck(u *User) (*time.Time, error) {
	lastPaycheck := *u.LastPaycheck
	n := now()

	for n.Sub(lastPaycheck) >= oneWeek*2 {
		lastPaycheck = lastPaycheck.Add(oneWeek * 2)
	}

	return &lastPaycheck, nil
}

type MonthlyCalculator struct {
	Contributions int64
}

func (w MonthlyCalculator) Calculate(u *User, p *Purchase) (*time.Time, error) {
	var total int64

	if p.Deleted || p.Purchased {
		return nil, nil
	}

	for _, p := range u.Purchases {
		if p.Deleted || p.Purchased {
			continue
		}

		total += p.Quantity * p.Product.Price
	}

	s := u.Saved
	n, err := w.LastPaycheck(u)
	if err != nil {
		return nil, err
	}

	for s < total {
		d := time.Date(n.Year(), n.Month()+1, n.Day(), n.Hour(), n.Minute(), n.Second(), n.Nanosecond(), time.UTC)
		n = &d
		s += u.Contributions
	}

	return n, nil
}

func (w MonthlyCalculator) LastPaycheck(u *User) (*time.Time, error) {
	lastPaycheck := *u.LastPaycheck
	n := now()

	for lastPaycheck.AddDate(0, 1, 0).Before(*n) {
		lastPaycheck = lastPaycheck.AddDate(0, 1, 0)
	}

	return &lastPaycheck, nil
}

type TwiceMonthlyCalculator struct {
	Contributions int64
}

func (w TwiceMonthlyCalculator) Calculate(u *User, p *Purchase) (*time.Time, error) {
	return nil, nil
}

func (w TwiceMonthlyCalculator) LastPaycheck(u *User) (*time.Time, error) {
	n := now()
	l := u.LastPaycheck

	year, month, day := n.Date()

	if day < 15 {
		d := time.Date(year, month, 1, l.Hour(), l.Minute(), l.Second(), l.Nanosecond(), time.UTC)
		return &d, nil
	}

	d := time.Date(year, month, 15, l.Hour(), l.Minute(), l.Second(), l.Nanosecond(), time.UTC)
	return &d, nil
}

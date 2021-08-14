package plan

import (
	"time"
)

type PurchaseCalculator interface {
	Calculate(*User, *Purchase) (*time.Time, error)
	LastPaycheck(*User) (*time.Time, error)
	Saved(*User) (int64, error)
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

func (w WeeklyCalculator) Saved(u *User) (int64, error) {
	saved := u.Saved
	lastPaycheck := *u.LastPaycheck
	n := now()

	for n.Sub(lastPaycheck) >= oneWeek {
		lastPaycheck = lastPaycheck.Add(oneWeek)
		saved += u.Contributions
	}

	return saved, nil
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

func (w BiWeeklyCalculator) Saved(u *User) (int64, error) {
	saved := u.Saved
	lastPaycheck := *u.LastPaycheck
	n := now()

	for n.Sub(lastPaycheck) >= oneWeek*2 {
		lastPaycheck = lastPaycheck.Add(oneWeek * 2)
		saved += u.Contributions
	}

	return saved, nil
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

func (w MonthlyCalculator) Saved(u *User) (int64, error) {
	saved := u.Saved
	lastPaycheck := *u.LastPaycheck
	n := now()

	for lastPaycheck.AddDate(0, 1, 0).Before(*n) {
		lastPaycheck = lastPaycheck.AddDate(0, 1, 0)
		saved += u.Contributions
	}

	return saved, nil
}

type TwiceMonthlyCalculator struct {
	Contributions int64
}

func (w TwiceMonthlyCalculator) Calculate(u *User, p *Purchase) (*time.Time, error) {
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
		var d time.Time
		if n.Day() < 15 {
			d = time.Date(n.Year(), n.Month(), 15, n.Hour(), n.Minute(), n.Second(), n.Nanosecond(), time.UTC)
		} else {
			d = time.Date(n.Year(), n.Month()+1, 1, n.Hour(), n.Minute(), n.Second(), n.Nanosecond(), time.UTC)
		}
		n = &d
		s += u.Contributions
	}

	return n, nil
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

func (w TwiceMonthlyCalculator) Saved(u *User) (int64, error) {
	n := now()
	saved := u.Saved
	t := *u.LastPaycheck
	for {
		if t.Day() >= 15 {
			t = time.Date(t.Year(), t.Month()+1, 1, t.Hour(), t.Minute(), t.Second(), t.Nanosecond(), time.UTC)
		} else {
			t = time.Date(t.Year(), t.Month(), 15, t.Hour(), t.Minute(), t.Second(), t.Nanosecond(), time.UTC)
		}

		if n.Before(t) {
			return saved, nil
		} else {
			saved += u.Contributions
		}
	}
}

package plan

import (
	"time"
)

type FrequencyCalculator interface {
	Calculate(*Purchase) (*time.Time, error)
	LastPaycheck() (*time.Time, error)
	Saved() (int64, error)
}

func NewFrequencyCalculator(u *User) (FrequencyCalculator, error) {
	switch u.Frequency {
	case Weekly:
		return WeeklyCalculator{
			user: u,
		}, nil
	case Biweekly:
		return BiWeeklyCalculator{
			user: u,
		}, nil
	case Monthly:
		return MonthlyCalculator{
			user: u,
		}, nil
	case TwiceMonthly:
		return TwiceMonthlyCalculator{
			user: u,
		}, nil
	}

	return nil, ErrInvalidAvailabilityCalculator
}

type WeeklyCalculator struct {
	user *User
}

func (w WeeklyCalculator) Calculate(p *Purchase) (*time.Time, error) {
	var total int64

	if p.Deleted || p.Purchased {
		return nil, nil
	}

	for _, p := range w.user.Purchases {
		if p.Deleted || p.Purchased {
			continue
		}

		total += p.Quantity * p.Product.Price
	}

	s := w.user.Saved
	n, err := w.LastPaycheck()
	if err != nil {
		return nil, err
	}

	for s < total {
		d := n.Add(oneWeek)
		n = &d
		s += w.user.Contributions
	}

	return n, nil
}

func (w WeeklyCalculator) LastPaycheck() (*time.Time, error) {
	lastPaycheck := *w.user.LastPaycheck
	n := now()

	for n.Sub(lastPaycheck) >= oneWeek {
		lastPaycheck = lastPaycheck.Add(oneWeek)
	}

	return &lastPaycheck, nil
}

func (w WeeklyCalculator) Saved() (int64, error) {
	saved := w.user.Saved
	lastPaycheck := *w.user.LastPaycheck
	n := now()

	for n.Sub(lastPaycheck) >= oneWeek {
		lastPaycheck = lastPaycheck.Add(oneWeek)
		saved += w.user.Contributions
	}

	return saved, nil
}

type BiWeeklyCalculator struct {
	user *User
}

func (w BiWeeklyCalculator) Calculate(p *Purchase) (*time.Time, error) {
	var total int64

	if p.Deleted || p.Purchased {
		return nil, nil
	}

	for _, p := range w.user.Purchases {
		if p.Deleted || p.Purchased {
			continue
		}

		total += p.Quantity * p.Product.Price
	}

	s := w.user.Saved
	n, err := w.LastPaycheck()
	if err != nil {
		return nil, err
	}

	for s < total {
		d := n.Add(oneWeek * 2)
		n = &d
		s += w.user.Contributions
	}

	return n, nil
}

func (w BiWeeklyCalculator) LastPaycheck() (*time.Time, error) {
	lastPaycheck := *w.user.LastPaycheck
	n := now()

	for n.Sub(lastPaycheck) >= oneWeek*2 {
		lastPaycheck = lastPaycheck.Add(oneWeek * 2)
	}

	return &lastPaycheck, nil
}

func (w BiWeeklyCalculator) Saved() (int64, error) {
	saved := w.user.Saved
	lastPaycheck := *w.user.LastPaycheck
	n := now()

	for n.Sub(lastPaycheck) >= oneWeek*2 {
		lastPaycheck = lastPaycheck.Add(oneWeek * 2)
		saved += w.user.Contributions
	}

	return saved, nil
}

type MonthlyCalculator struct {
	user *User
}

func (w MonthlyCalculator) Calculate(p *Purchase) (*time.Time, error) {
	var total int64

	if p.Deleted || p.Purchased {
		return nil, nil
	}

	for _, p := range w.user.Purchases {
		if p.Deleted || p.Purchased {
			continue
		}

		total += p.Quantity * p.Product.Price
	}

	s := w.user.Saved
	n, err := w.LastPaycheck()
	if err != nil {
		return nil, err
	}

	for s < total {
		d := time.Date(n.Year(), n.Month()+1, n.Day(), n.Hour(), n.Minute(), n.Second(), n.Nanosecond(), time.UTC)
		n = &d
		s += w.user.Contributions
	}

	return n, nil
}

func (w MonthlyCalculator) LastPaycheck() (*time.Time, error) {
	lastPaycheck := *w.user.LastPaycheck
	n := now()

	for lastPaycheck.AddDate(0, 1, 0).Before(*n) {
		lastPaycheck = lastPaycheck.AddDate(0, 1, 0)
	}

	return &lastPaycheck, nil
}

func (w MonthlyCalculator) Saved() (int64, error) {
	saved := w.user.Saved
	lastPaycheck := *w.user.LastPaycheck
	n := now()

	for lastPaycheck.AddDate(0, 1, 0).Before(*n) {
		lastPaycheck = lastPaycheck.AddDate(0, 1, 0)
		saved += w.user.Contributions
	}

	return saved, nil
}

type TwiceMonthlyCalculator struct {
	user *User
}

func (w TwiceMonthlyCalculator) Calculate(p *Purchase) (*time.Time, error) {
	var total int64

	if p.Deleted || p.Purchased {
		return nil, nil
	}

	for _, p := range w.user.Purchases {
		if p.Deleted || p.Purchased {
			continue
		}

		total += p.Quantity * p.Product.Price
	}

	s := w.user.Saved
	n, err := w.LastPaycheck()
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
		s += w.user.Contributions
	}

	return n, nil
}

func (w TwiceMonthlyCalculator) LastPaycheck() (*time.Time, error) {
	n := now()
	l := w.user.LastPaycheck

	year, month, day := n.Date()

	if day < 15 {
		d := time.Date(year, month, 1, l.Hour(), l.Minute(), l.Second(), l.Nanosecond(), time.UTC)
		return &d, nil
	}

	d := time.Date(year, month, 15, l.Hour(), l.Minute(), l.Second(), l.Nanosecond(), time.UTC)
	return &d, nil
}

func (w TwiceMonthlyCalculator) Saved() (int64, error) {
	n := now()
	saved := w.user.Saved
	t := *w.user.LastPaycheck
	for {
		if t.Day() >= 15 {
			t = time.Date(t.Year(), t.Month()+1, 1, t.Hour(), t.Minute(), t.Second(), t.Nanosecond(), time.UTC)
		} else {
			t = time.Date(t.Year(), t.Month(), 15, t.Hour(), t.Minute(), t.Second(), t.Nanosecond(), time.UTC)
		}

		if n.Before(t) {
			return saved, nil
		} else {
			saved += w.user.Contributions
		}
	}
}

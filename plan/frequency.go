package plan

import (
	"time"
)

type Frequency interface {
	Saved() (int64, error)
	LastPaycheck() (*time.Time, error)
	PurchaseDate(*Purchase) (*time.Time, error)
}

func NewFrequency(u *User) (Frequency, error) {
	switch u.Frequency {
	case weekly:
		return Weekly{
			user: u,
		}, nil
	case biweekly:
		return BiWeekly{
			user: u,
		}, nil
	case monthly:
		return Monthly{
			user: u,
		}, nil
	case twiceMonthly:
		return TwiceMonthly{
			user: u,
		}, nil
	}

	return nil, ErrInvalidAvailability
}

type Weekly struct {
	user *User
}

func (w Weekly) PurchaseDate(p *Purchase) (*time.Time, error) {
	var total int64

	if p.Deleted || p.Purchased {
		return nil, nil
	}

	for _, p2 := range w.user.Purchases {
		if p2.Deleted || p2.Purchased {
			continue
		}

		total += p2.Quantity * p2.Product.Price

		if p.ID == p2.ID {
			break
		}
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

func (w Weekly) LastPaycheck() (*time.Time, error) {
	lastPaycheck := *w.user.LastPaycheck
	n := now()

	for n.Sub(lastPaycheck) >= oneWeek {
		lastPaycheck = lastPaycheck.Add(oneWeek)
	}

	return &lastPaycheck, nil
}

func (w Weekly) Saved() (int64, error) {
	saved := w.user.Saved
	lastPaycheck := *w.user.LastPaycheck
	n := now()

	for n.Sub(lastPaycheck) >= oneWeek {
		lastPaycheck = lastPaycheck.Add(oneWeek)
		saved += w.user.Contributions
	}

	return saved, nil
}

type BiWeekly struct {
	user *User
}

func (w BiWeekly) PurchaseDate(p *Purchase) (*time.Time, error) {
	var total int64

	if p.Deleted || p.Purchased {
		return nil, nil
	}

	for _, p2 := range w.user.Purchases {
		if p2.Deleted || p2.Purchased {
			continue
		}

		total += p2.Quantity * p2.Product.Price

		if p.ID == p2.ID {
			break
		}
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

func (w BiWeekly) LastPaycheck() (*time.Time, error) {
	lastPaycheck := *w.user.LastPaycheck
	n := now()

	for n.Sub(lastPaycheck) >= oneWeek*2 {
		lastPaycheck = lastPaycheck.Add(oneWeek * 2)
	}

	return &lastPaycheck, nil
}

func (w BiWeekly) Saved() (int64, error) {
	saved := w.user.Saved
	lastPaycheck := *w.user.LastPaycheck
	n := now()

	for n.Sub(lastPaycheck) >= oneWeek*2 {
		lastPaycheck = lastPaycheck.Add(oneWeek * 2)
		saved += w.user.Contributions
	}

	return saved, nil
}

type Monthly struct {
	user *User
}

func (w Monthly) PurchaseDate(p *Purchase) (*time.Time, error) {
	var total int64

	if p.Deleted || p.Purchased {
		return nil, nil
	}

	for _, p2 := range w.user.Purchases {
		if p2.Deleted || p2.Purchased {
			continue
		}

		total += p2.Quantity * p2.Product.Price

		if p.ID == p2.ID {
			break
		}
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

func (w Monthly) LastPaycheck() (*time.Time, error) {
	lastPaycheck := *w.user.LastPaycheck
	n := now()

	for lastPaycheck.AddDate(0, 1, 0).Before(*n) {
		lastPaycheck = lastPaycheck.AddDate(0, 1, 0)
	}

	return &lastPaycheck, nil
}

func (w Monthly) Saved() (int64, error) {
	saved := w.user.Saved
	lastPaycheck := *w.user.LastPaycheck
	n := now()

	for lastPaycheck.AddDate(0, 1, 0).Before(*n) {
		lastPaycheck = lastPaycheck.AddDate(0, 1, 0)
		saved += w.user.Contributions
	}

	return saved, nil
}

type TwiceMonthly struct {
	user *User
}

func (w TwiceMonthly) PurchaseDate(p *Purchase) (*time.Time, error) {
	var total int64

	if p.Deleted || p.Purchased {
		return nil, nil
	}

	for _, p2 := range w.user.Purchases {
		if p2.Deleted || p2.Purchased {
			continue
		}

		total += p2.Quantity * p2.Product.Price

		if p.ID == p2.ID {
			break
		}
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

func (w TwiceMonthly) LastPaycheck() (*time.Time, error) {
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

func (w TwiceMonthly) Saved() (int64, error) {
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

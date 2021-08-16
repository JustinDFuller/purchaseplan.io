package plan

import (
	"time"
)

const (
	oneDay  = time.Hour * 24
	oneWeek = oneDay * 7
)

var now = func() *time.Time {
	n := time.Now()
	return &n
}

func date(year int, month time.Month, day, hour, minute, second, nsecond int, loc *time.Location) *time.Time {
	d := time.Date(year, month, day, hour, minute, second, nsecond, loc)
	return &d
}

func fromNow(d time.Duration) *time.Time {
	t := now().Add(d)

	return &t
}

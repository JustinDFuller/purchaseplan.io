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

func fromNow(d time.Duration) *time.Time {
	t := now().Add(d)

	return &t
}

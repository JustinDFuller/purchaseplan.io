package plan

import (
	"time"
)

var now = func() *time.Time {
	n := time.Now()
	return &n
}

func fromNow(d time.Duration) *time.Time {
	t := now().Add(d)

	return &t
}

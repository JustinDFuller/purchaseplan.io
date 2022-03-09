package plan

import "time"

func fromNow(d time.Duration) *time.Time {
	t := now().Add(d)

	return &t
}

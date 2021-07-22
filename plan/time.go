package plan

import "time"

var now = func() *time.Time {
	n := time.Now()
	return &n
}

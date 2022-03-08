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

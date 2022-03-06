package plan

import "errors"

var (
	ErrMissingEmail        = errors.New("missing Email")
	ErrMissingProductName  = errors.New("missing product Name")
	ErrMissingProductPrice = errors.New("missing product Price")
	ErrMissingProductURL   = errors.New("missing product URL")
)

var (
	ErrInvalidFrequency    = errors.New("invalid contribution frequency")
	ErrInvalidAvailability = errors.New("invalid availability calculator")
)

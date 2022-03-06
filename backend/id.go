package plan

import (
	"github.com/google/uuid"
	"github.com/pkg/errors"
)

var newID = func() (string, error) {
	id, err := uuid.NewRandom()
	if err != nil {
		return "", errors.Wrap(err, "unable to create uuid")
	}

	return id.String(), nil
}

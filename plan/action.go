package plan

// Action modifies a User
type Action interface {
	// Act receives a pointer to a user, modifies it, or returns an error.
	Act(*User) error
}

type ErrAction struct {
	Err error
}

func (a *ErrAction) Act(u *User) error {
	return a.Err
}

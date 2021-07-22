package plan

type Processor func(*User) error

var Processors = []Processor{
	ProcessValidation,
	ProcessDefaults,
	ProcessLastPaycheck,
	ProcessPurchaseAvailability,
}

func Process(u *User) error {
	for _, p := range Processors {
		if err := p(u); err != nil {
			return err
		}
	}
	return nil
}

func ProcessValidation(u *User) error {
	if u.Email == "" {
		return ErrMissingEmail
	}

	return nil
}

func ProcessDefaults(u *User) error {
	// A quick google search shows that bi-weekly is the most
	// common pay frequency in the US.
	if u.Frequency == "" {
		u.Frequency = Every2Weeks
	}

	// Can't process availabilities without last paycheck.
	if u.LastPaycheck == nil {
		u.LastPaycheck = now()
	}

	return nil
}

func ProcessLastPaycheck(U *User) error {
	return nil
}

func ProcessPurchaseAvailability(u *User) error {
	return nil
}

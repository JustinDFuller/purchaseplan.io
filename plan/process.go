package plan

type Processor func(*User) error

var Processors = []Processor{
	// Process validation after defaults to account for missing values.
	ProcessDefaults,
	ProcessValidation,
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

func ProcessDefaults(u *User) error {
	// A quick google search shows that bi-weekly is the most
	// common pay frequency in the US.
	if u.Frequency == "" {
		u.Frequency = Biweekly
	}

	// Can't process availabilities without last paycheck.
	if u.LastPaycheck == nil {
		u.LastPaycheck = now()
	}

	return nil
}

func ProcessValidation(u *User) error {
	if u.Email == "" {
		return ErrMissingEmail
	}

	frequencies := []Frequency{
		Weekly,
		Biweekly,
		Monthly,
	}

	var found bool
	for _, f := range frequencies {
		if f == u.Frequency {
			found = true
		}
	}

	if !found {
		return ErrInvalidFrequency
	}

	for _, p := range u.Purchases {
		if p.Product.Name == "" {
			return ErrMissingProductName
		}

		if p.Product.Price == 0 {
			return ErrMissingProductPrice
		}

		if p.Product.URL == "" {
			return ErrMissingProductURL
		}
	}

	return nil
}

func ProcessLastPaycheck(U *User) error {
	return nil
}

func ProcessPurchaseAvailability(u *User) error {
	if u.Contributions == 0 {
		return nil
	}

	c, err := GetPurchaseCalculator(u)
	if err != nil {
		return err
	}

	if c == nil {
		return ErrInvalidAvailabilityCalculator
	}

	for i, p := range u.Purchases {
		d, err := c.Calculate(u, &p)
		if err != nil {
			return err
		}

		p.Date = d
		u.Purchases[i] = p
	}

	return nil
}

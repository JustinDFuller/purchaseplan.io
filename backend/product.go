package planner

import (
	"context"
	"sync"

	"github.com/justindfuller/purchaseplan.io/plan"
)

// Producter is an interface for retrieving products.
type Producter interface {
	// Product returns a Product and an error.
	Product(ctx context.Context) (plan.Product, error)
}

func mergeProducts(ctx context.Context, producters ...Producter) (plan.Product, error) {
	var wg sync.WaitGroup
	var m sync.Mutex

	errors := make([]error, len(producters))
	products := make([]plan.Product, len(producters))

	for i, p := range producters {
		wg.Add(1)

		i := i
		p := p

		go func() {
			defer wg.Done()

			p, err := p.Product(ctx)
			m.Lock()
			defer m.Unlock()
			if err != nil {
				errors[i] = err
				return
			}
			products[i] = p
		}()
	}

	wg.Wait()

	var p plan.Product

	for _, err := range errors {
		if err != nil {
			return p, err
		}
	}

	for _, product := range products {
		p = p.Merge(product)
	}

	return p, nil
}

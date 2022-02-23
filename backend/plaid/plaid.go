package plaid

import (
	"github.com/justindfuller/purchaseplan.io/backend/config"
	p "github.com/plaid/plaid-go/plaid"
)

type Client struct {
	client *p.APIClient
}

func New(c config.C) Client {
	cfg := p.NewConfiguration()
	cfg.AddDefaultHeader("PLAID-CLIENT-ID", c.PlaidClientID)
	cfg.AddDefaultHeader("PLAID-SECRET", c.PlaidSecretKey)
	cfg.UseEnvironment(p.Sandbox)

	return Client{
		client: p.NewAPIClient(cfg),
	}
}

/*

func (c Client) Link(ctx context.Context, user string) (string, error) {
	user := p.LinkTokenCreateRequestUser{
		ClientUserId: user,
	}

	request := p.NewLinkTokenCreateRequest(
		"Budget by Purchase Plan",
		"en",
		[]p.CountryCode{p.COUNTRYCODE_US},
		user,
	)
	request.SetProducts([]p.Products{p.PRODUCTS_AUTH})
	request.SetLinkCustomizationName("default")
	request.SetWebhook("https://www.purchaseplan.io/v1/plaid/webhook")
	request.SetRedirectUri("https://www.purchaseplan.io/budget/app/auth/plaid")
	request.SetAccountFilters(p.LinkTokenAccountFilters{
		Depository: &p.DepositoryFilter{
			AccountSubtypes: []p.AccountSubtype{p.ACCOUNTSUBTYPE_CHECKING, p.ACCOUNTSUBTYPE_SAVINGS},
		},
	})

	resp, _, err := c.client.PlaidApi.LinkTokenCreate(ctx).LinkTokenCreateRequest(*request).Execute()
	if err != nil {
		return "", err
	}

	linkToken := resp.GetLinkToken()
	return linkToken, nil
}

*/

package service

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	planner "github.com/justindfuller/purchase-saving-planner/api"
	"github.com/kr/pretty"
)

type testProducts struct {
	url     string
	product planner.Product
}

func TestService(t *testing.T) {
	tests := []testProducts{
		{
			// This one has multiple images
			url: "https://www.ikea.com/us/en/p/kolbjoern-cabinet-indoor-outdoor-green-00450347/",
			product: planner.Product{
				Name:        `KOLBJÖRN Cabinet, indoor/outdoor - green 31 1/2x31 7/8 "`,
				Description: `KOLBJÖRN Cabinet, indoor/outdoor - green 31 1/2x31 7/8 ". Suitable for both indoor and outdoor use. The cabinet is durable, easy to clean and protected from rust since it is made of powder-coated galvanized steel. Stands evenly on an uneven floor since the feet can be adjusted.`,
				Price:       79,
				URL:         "https://www.ikea.com/us/en/p/kolbjoern-cabinet-indoor-outdoor-green-00450347/",
				Image:       "https://www.ikea.com/us/en/images/products/kolbjoern-cabinet-indoor-outdoor-green__0762731_PE752182_S5.JPG",
			},
		},
		{
			// Sometimes this one gives null for price
			url: "https://www.lowes.com/pd/Char-Broil-Performance-62-in-Black-Fits-Most-Cover/1000115081",
			product: planner.Product{
				Name:        `Char-Broil Performance 62-in Black Fits Most Cover`,
				Description: `Performance 62-in Black Fits Most Cover`,
				Price:       34,
				Image:       "//mobileimages.lowes.com/product/converted/047362/047362763273.jpg",
				URL:         "https://www.lowes.com/pd/Char-Broil-Performance-62-in-Black-Fits-Most-Cover/1000115081",
			},
		},
		{
			// This one doesn't include price :(
			url: "https://www.target.com/p/ellis-tripod-floor-lamp-brass-project-62-153/-/A-53321427?preselect=17299858",
			product: planner.Product{
				Name:        "Ellis Tripod Floor Lamp Brass (Includes LED Light Bulb) - Project 62™",
				Description: "The Ellis Tripod Floor Lamp from Project 62™ will add effortless elegance to any space. Three brass posts topped with a simple white drum shade combine to create a tall, sleek look you’ll love to use in any room. This graceful, modern free-standing lamp will fill any nook with a welcoming glow. Use this minimalistic floor lamp alongside farmhouse or modern decor, and shed a little more light on your lovely home. <br><br>1962 was a big year. Modernist design hit its peak and moved into homes across the country. And in Minnesota, Target was born — with the revolutionary idea to celebrate design for all. Project 62 embodies this legacy with a collection of modern pieces made for everyday living.",
				URL:         "https://www.target.com/p/ellis-tripod-floor-lamp-brass-includes-led-light-bulb-project-62-8482/-/A-17299858",
				Image:       "https://target.scene7.com/is/image/Target/GUEST_51ec9b9d-ece7-4b45-b699-590cabd2c2ba",
			},
		},
		{
			// Multiple Images
			// Price with cents 14.32
			url: "https://www.homedepot.com/p/MTD-Genuine-Factory-Parts-21-in-Mulching-Walk-Behind-Mower-Blade-490-100-M084/202970675",
			product: planner.Product{
				Price:       14,
				Name:        "21 in. Mulching Walk-Behind Mower Blade",
				URL:         "https://www.homedepot.com/p/MTD-Genuine-Factory-Parts-21-in-Mulching-Walk-Behind-Mower-Blade-490-100-M084/202970675",
				Image:       "https://images.homedepot-static.com/productImages/f8e07aab-9335-405b-b595-d3843cb2625d/svn/mtd-genuine-factory-parts-outdoor-power-blades-490-100-m084-64_100.jpg",
				Description: "Use the parts your machine was born with, use the OEM factory blade. These blades have been specifically designed by the manufacturer to keep your machine running at its peak level. OEM blades offer the premium cutting benefits and safety as the blades that were installed at the factory.",
			},
		},
		{
			// This one showed price as { cents: 0, dollars: 219 }
			url: "https://www.lowes.com/pd/Weber-Master-Touch-22-in-Kettle-Charcoal-Grill/50450060",
			product: planner.Product{
				Price:       219,
				Name:        "Weber Master Touch 22-in Black Kettle Charcoal Grill",
				URL:         "https://www.lowes.com/pd/Weber-Master-Touch-22-in-Kettle-Charcoal-Grill/50450060",
				Image:       "//mobileimages.lowes.com/product/converted/077924/077924032264.jpg",
				Description: "Master Touch 22-in Black Kettle Charcoal Grill",
			},
		},
	}

	s, err := New()
	if err != nil {
		t.Fatal(err)
	}

	ts := httptest.NewServer(s.Router)
	defer ts.Close()

	for _, test := range tests {
		t.Run(test.url, func(t *testing.T) {
			res, err := http.Get(ts.URL + "/products?url=" + url.QueryEscape(test.url))
			if err != nil {
				t.Fatal(err)
			}

			body, err := ioutil.ReadAll(res.Body)
			res.Body.Close()
			if err != nil {
				t.Fatal(err)
			}

			var p planner.Product
			if err := json.Unmarshal(body, &p); err != nil {
				t.Fatal(err)
			}

			if p != test.product {
				for _, d := range pretty.Diff(p, test.product) {
					t.Log(d)
				}
				t.Fatal("Did not receive expected product.")
			}
		})
	}
}

package service

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"net/url"
	"reflect"
	"testing"

	planner "github.com/justindfuller/purchaseplan.io/backend"
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
				Name:          `KOLBJÖRN Cabinet, indoor/outdoor - green 31 1/2x31 7/8 "`,
				Description:   `KOLBJÖRN Cabinet, indoor/outdoor - green 31 1/2x31 7/8 ". Suitable for both indoor and outdoor use. The cabinet is durable, easy to clean and protected from rust since it is made of powder-coated galvanized steel. Stands evenly on an uneven floor since the feet can be adjusted.`,
				Price:         79,
				URL:           "https://www.ikea.com/us/en/p/kolbjoern-cabinet-indoor-outdoor-green-00450347/",
				OriginalImage: "https://www.ikea.com/us/en/images/products/kolbjoern-cabinet-indoor-outdoor-green__0762731_PE752182_S5.JPG",
				Image:         "https://storage.googleapis.com/download/storage/v1/b/purchase-plan-images-local/o/81d08b11c66d4a8c9edcc0cefaf2b7ec?alt=media",
			},
		},
		{
			// Sometimes this one gives null for price
			url: "https://www.lowes.com/pd/Char-Broil-Performance-62-in-Black-Fits-Most-Cover/1000115081",
			product: planner.Product{
				Name:          `Char-Broil Performance 62-in Black Fits Most Cover`,
				Description:   `Performance 62-in Black Fits Most Cover`,
				Price:         34,
				URL:           "https://www.lowes.com/pd/Char-Broil-Performance-62-in-Black-Fits-Most-Cover/1000115081",
				OriginalImage: "//mobileimages.lowes.com/product/converted/047362/047362763273.jpg",
				Image:         "https://storage.googleapis.com/download/storage/v1/b/purchase-plan-images-local/o/c0abf724f113eb41f2a05dc4cdff6226?alt=media",
			},
		},
		{
			// This one doesn't include price :(
			url: "https://www.target.com/p/ellis-tripod-floor-lamp-brass-project-62-153/-/A-53321427?preselect=17299858",
			product: planner.Product{
				Name:          "Ellis Tripod Floor Lamp Brass (Includes LED Light Bulb) - Project 62™",
				Description:   "The Ellis Tripod Floor Lamp from Project 62™ will add effortless elegance to any space. Three brass posts topped with a simple white drum shade combine to create a tall, sleek look you’ll love to use in any room. This graceful, modern free-standing lamp will fill any nook with a welcoming glow. Use this minimalistic floor lamp alongside farmhouse or modern decor, and shed a little more light on your lovely home. <br><br>1962 was a big year. Modernist design hit its peak and moved into homes across the country. And in Minnesota, Target was born — with the revolutionary idea to celebrate design for all. Project 62 embodies this legacy with a collection of modern pieces made for everyday living.",
				URL:           "https://www.target.com/p/ellis-tripod-floor-lamp-brass-includes-led-light-bulb-project-62-8482/-/A-17299858",
				OriginalImage: "https://target.scene7.com/is/image/Target/GUEST_51ec9b9d-ece7-4b45-b699-590cabd2c2ba",
				Image:         "https://storage.googleapis.com/download/storage/v1/b/purchase-plan-images-local/o/0f73da3fb97709464fa9da98ec98b087?alt=media",
			},
		},
		{
			// Multiple Images
			// Price with cents 14.32
			url: "https://www.homedepot.com/p/MTD-Genuine-Factory-Parts-21-in-Mulching-Walk-Behind-Mower-Blade-490-100-M084/202970675",
			product: planner.Product{
				Price:         14,
				Name:          "21 in. Mulching Walk-Behind Mower Blade",
				URL:           "https://www.homedepot.com/p/MTD-Genuine-Factory-Parts-21-in-Mulching-Walk-Behind-Mower-Blade-490-100-M084/202970675",
				Description:   "Use the parts your machine was born with, use the OEM factory blade. These blades have been specifically designed by the manufacturer to keep your machine running at its peak level. OEM blades offer the premium cutting benefits and safety as the blades that were installed at the factory.",
				OriginalImage: "https://images.homedepot-static.com/productImages/f8e07aab-9335-405b-b595-d3843cb2625d/svn/mtd-genuine-factory-parts-outdoor-power-blades-490-100-m084-64_100.jpg",
				Image:         "https://storage.googleapis.com/download/storage/v1/b/purchase-plan-images-local/o/1633bf9ffc17aeee8c230f600925e7cb?alt=media",
			},
		},
		{
			// This one showed price as { cents: 0, dollars: 219 }
			url: "https://www.lowes.com/pd/Weber-Master-Touch-22-in-Kettle-Charcoal-Grill/50450060",
			product: planner.Product{
				Price:         219,
				Name:          "Weber Master Touch 22-in Black Kettle Charcoal Grill",
				URL:           "https://www.lowes.com/pd/Weber-Master-Touch-22-in-Kettle-Charcoal-Grill/50450060",
				Description:   "Master Touch 22-in Black Kettle Charcoal Grill",
				OriginalImage: "//mobileimages.lowes.com/product/converted/077924/077924032264.jpg",
				Image:         "https://storage.googleapis.com/download/storage/v1/b/purchase-plan-images-local/o/7fbf5056f3cfa16839571aac3a2bac93?alt=media",
			},
		},
		{
			// Open Graph meta tags
			url: "https://egopowerplus.com/21-inch-self-propelled-mower-select-cut/",
			product: planner.Product{
				Name:          "Power+ 21",
				URL:           "https://egopowerplus.com/21-inch-self-propelled-mower-select-cut/",
				Description:   " The Select Cut™ multi-blade cutting system is equipped with two, interchangeable lower blades; the Premium Mulching Blade and the Premium Bagging Blade. ",
				OriginalImage: "https://egopowerplus.com/media/catalog/product/cache/02995e5077dda5c77697ad23ef8c2836/l/m/lm2130sp_v2_2.png",
				Image:         "https://storage.googleapis.com/download/storage/v1/b/purchase-plan-images-local/o/f435d1913f87b52f3d5e05231b095c9f?alt=media",
			},
		},
		{
			// Meta tags/amazon
			url: "https://www.amazon.com/gp/product/B0166R5ZEQ",
			product: planner.Product{
				Name:          "Suncast Commercial Black Blow Molded Tall 2 Shelf Storage Shed Cabinet for Indoor or Outdoor Use",
				Description:   `Upgrade your workplace storage with the Suncast Commercial 9 Cubic Ft. Heavy-Duty Resin Cabinet with 2 Shelves. This convenient cabinet allows you to keep tools, cleaning supplies, and other materials stored and secure. This cabinet's heavy-duty blow-molded resin construction resists scratches, dents, and rust for long-lasting use. The reinforced design of the 2 included shelves allow them to hold up to 200 lbs. per shelf and resist bending under the heavy weight. This storage cabinet also features a sliding latch at the bottom for extra security. The cabinet's built-in handles can be further secured with a pad lock (not included). With a simple design, assembling this cabinet on the job site is quick and easy. The Suncast Commercial 9 Cubic Ft. Heavy-Duty Resin Cabinet with 2 Shelves measures 30" x 20.25" x 36" for versatile storage without taking up too much space. Suncast takes pride in helping customers enhance their indoor and outdoor spaces with quality products that are stylishly designed. You take pride in creating a beautiful environment. We take pride in keeping it that way.`,
				URL:           "https://www.amazon.com/Suncast-Commercial-Blow-Molded-Cabinet/dp/B0166R5ZEQ",
				OriginalImage: "https://images-na.ssl-images-amazon.com/images/I/91eS8zD0K5L._AC_SL1500_.jpg",
				Image:         "https://storage.googleapis.com/download/storage/v1/b/purchase-plan-images-local/o/28ea694a682ca80a10e39fa0b8d79e96?alt=media",
				Price:         177,
			},
		},
		{
			// Slightly different Open Graph tags
			url: "https://www.electroluxappliances.com/Kitchen-Appliances/Wall-Ovens/Wall-Oven_Microwave-Combination/EW30MC65PS/",
			product: planner.Product{
				Name:          "30'' Wall Oven and Microwave Combination with Wave-Touch® Controls",
				Description:   "Compare microwave and convection oven combinations to find the best set for your kitchen. Get a microwave/convection oven combo to meet your cooking needs.",
				URL:           "https://www.electroluxappliances.com/Kitchen-Appliances/Wall-Ovens/Wall-Oven_Microwave-Combination/EW30MC65PS/",
				OriginalImage: "https://na2.electroluxmedia.com/Transparent/Electrolux/Electrolux%20Assets/Images/Product%20Photography/EW30MC65PS-HOV_531.png?impolicy=EA-PLP",
				Image:         "https://storage.googleapis.com/download/storage/v1/b/purchase-plan-images-local/o/92a4b4272738fec930c223cfe07f910e?alt=media",
				Price:         4399,
			},
		},
	}

	s, err := New()
	if err != nil {
		t.Fatal(err)
	}

	for _, test := range tests {
		test := test
		t.Run(test.url, func(t *testing.T) {
			t.Parallel()

			ts := httptest.NewServer(s.Router)
			defer ts.Close()

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

			if !reflect.DeepEqual(p, test.product) {
				for _, d := range pretty.Diff(p, test.product) {
					t.Log(d)
				}
				t.Fatal("Did not receive expected product.")
			}
		})
	}
}

package service

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"net/url"
	"path/filepath"
	"testing"

	"github.com/google/go-cmp/cmp"
	planner "github.com/justindfuller/purchaseplan.io/backend"
)

type testProducts struct {
	url     string
	product planner.Product
}

type fileTransport struct{}

func (t fileTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	b, err := ioutil.ReadFile(filepath.Join("./fixtures", url.QueryEscape(req.URL.String())))
	if err != nil {
		return nil, err
	}

	return &http.Response{Body: ioutil.NopCloser(bytes.NewBuffer(b))}, nil
}

func TestService(t *testing.T) {
	tests := []testProducts{
		{
			// This one has multiple images
			url: "https://www.ikea.com/us/en/p/kolbjoern-cabinet-indoor-outdoor-green-00450347/",
			product: planner.Product{
				Name:          `KOLBJÖRN Cabinet, indoor/outdoor, green`,
				Description:   `KOLBJÖRN Cabinet, indoor/outdoor, green. Suitable for both indoor and outdoor use. The cabinet is durable, easy to clean and protected from rust since it is made of powder-coated galvanized steel.`,
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
				Name:          `Char-Broil Performance 62-in Black Fits Most Cover Lowes.com`,
				Description:   `Shop char-broil performance 62-in black fits most cover in the grill covers section of Lowes.com`,
				Price:         34,
				URL:           "https://www.lowes.com/pd/Char-Broil-Performance-62-in-Black-Fits-Most-Cover/1000115081",
				OriginalImage: "https://mobileimages.lowes.com/product/converted/047362/047362763273xl.jpg",
				Image:         "https://storage.googleapis.com/download/storage/v1/b/purchase-plan-images-local/o/ef4aa931a515e54600d244ca83e03f47?alt=media",
			},
		},
		{
			// This one doesn't include price :(
			url: "https://www.target.com/p/ellis-tripod-floor-lamp-brass-project-62-153/-/A-53321427",
			product: planner.Product{
				Name:          "Ellis Tripod Floor Lamp Brass - Project 62&#153;",
				Description:   "Read reviews and buy Ellis Tripod Floor Lamp Brass - Project 62&#153; at Target. Choose from contactless Same Day Delivery, Drive Up and more.",
				URL:           "https://www.target.com/p/ellis-tripod-floor-lamp-brass-project-62-153/-/A-53321427",
				OriginalImage: "//target.scene7.com/is/image/Target/GUEST_51ec9b9d-ece7-4b45-b699-590cabd2c2ba",
				Image:         "https://storage.googleapis.com/download/storage/v1/b/purchase-plan-images-local/o/76a17ca6ba38adf6a3898d671ee25970?alt=media",
			},
		},
		/*{
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
		},*/
		{
			// This one showed price as { cents: 0, dollars: 219 }
			url: "https://www.lowes.com/pd/Weber-Master-Touch-22-in-Kettle-Charcoal-Grill/50450060",
			product: planner.Product{
				Price:         219,
				Name:          "Weber Master Touch 22-in Black Kettle Charcoal Grill Lowes.com",
				Description:   "Shop Weber Master Touch 22-in Black Kettle Charcoal Grillundefined at Lowe's.com. Expand your culinary repertoire with the Weber Master-Touch 22 in. charcoal BBQ grill featuring the gourmet BBQ system cooking grate. This plated-steel hinged",
				URL:           "https://www.lowes.com/pd/Weber-Master-Touch-22-in-Kettle-Charcoal-Grill/50450060",
				OriginalImage: "https://mobileimages.lowes.com/product/converted/077924/077924032264xl.jpg",
				Image:         "https://storage.googleapis.com/download/storage/v1/b/purchase-plan-images-local/o/8edd7b8f3d3f6feab1840476097a1505?alt=media",
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
		{
			// Relative URL
			url: "https://www.walmart.com/ip/VIZIO-85-Class-4K-UHD-Quantum-Smartcast-Smart-TV-HDR-P-Series-P85QX-H1/592330349",
			product: planner.Product{
				Name:          `VIZIO 85" Class 4K UHD Quantum Smartcast Smart TV HDR P-Series P85QX-H1 - Walmart.com`,
				Description:   "Free 2-day shipping. Buy VIZIO 85\" Class 4K UHD Quantum Smartcast Smart TV HDR P-Series P85QX-H1 at Walmart.com",
				URL:           "https://www.walmart.com/ip/VIZIO-85-Class-4K-UHD-Quantum-Smartcast-Smart-TV-HDR-P-Series-P85QX-H1/592330349",
				OriginalImage: "https://i5.walmartimages.com/asr/ef8b4108-efe5-4bab-a3ea-ed303edad5d6.3452b3a4a0ac25eec6980626eef24486.jpeg",
				Image:         "https://storage.googleapis.com/download/storage/v1/b/purchase-plan-images-local/o/05134012ed177deef19dfe961024a93d?alt=media",
				Price:         2498,
			},
		},
		{
			url: "https://www.worldmarket.com/product/rattan-papasan-chair-frame.do",
			product: planner.Product{
				Name:          "Rattan Papasan Chair Frame",
				Price:         99,
				URL:           "https://www.worldmarket.com/product/rattan-papasan-chair-frame.do",
				OriginalImage: "https://ii.worldmarket.com/fcgi-bin/iipsrv.fcgi?FIF=/images/worldmarket/source/101699_XXX_v1.tif&qlt=50&wid=650&cvt=jpeg",
				Description:   "Our classic papasan chair frame is now available in two modern hues, both beautifully handcrafted in Indonesia of bent rattan secured with wrapped rattan&#45;peel binding. Its bends and curves are made by skilled artisans who have been crafting our signature papasan for years. The base is a separate piece that allows for easy adjustment of the seat angle. Add any of our plush papasan chair cushions to complete your cozy, classic relaxation spot.",
				Image:         "https://storage.googleapis.com/download/storage/v1/b/purchase-plan-images-local/o/5db75fa096fb1a25da669340a4b6c504?alt=media",
			},
		},
	}

	s, err := New(WithHttpClient(&http.Client{
		Transport: fileTransport{},
	}))
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

			if diff := cmp.Diff(test.product, p); diff != "" {
				t.Errorf("Product mismatch (-want +got):\n%s", diff)
			}
		})
	}
}

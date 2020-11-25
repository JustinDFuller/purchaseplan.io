import React from "react";

const purchaseDefaults = {
  name: "",
  price: 0,
  url: "",
  availability: null // calculated at display time
};

export function Purchase(data = purchaseDefaults) {
  return {
    name() {
      return data.name;
    },
    price() {
      return data.price;
    },
    url() {
      return data.url;
    },
    availability() {
      return data.availability;
    },
    setName(name) {
      return Purchase({
        ...data,
        name
      });
    },
    setPrice(price) {
      return Purchase({
        ...data,
        price
      });
    },
    setUrl(url) {
      return Purchase({
        ...data,
        url
      });
    },
    setAvailability(availability) {
      return Purchase({
        ...data,
        availability
      });
    },
    clear() {
      return Purchase();
    },
    isNotEmpty() {
      return data !== purchaseDefaults;
    },
    is(purchase) {
      return purchase.name() === data.name; // switch to ID later
    }
  };
}

const defaults = {
  purchases: [
    Purchase({
      name: "grill cover",
      price: 35,
      url:
        "https://www.lowes.com/pd/Char-Broil-Performance-62-in-Black-Fits-Most-Cover/1000115081"
    }),
    Purchase({
      name: "meat thermometer",
      price: 34,
      url: "https://www.thermoworks.com/ThermoPop?tw=WIRECUTTER"
    }),
    Purchase({
      name: "Path lights",
      price: 30,
      url:
        "https://www.target.com/p/6pk-charleston-led-solar-lights-antique-bronze-smart-solar/-/A-53184703"
    }),
    Purchase({
      name: "Back Yard Cabinet",
      price: 80,
      url:
        "https://www.ikea.com/us/en/p/kolbjoern-cabinet-indoor-outdoor-green-00450347/"
    }),
    Purchase({
      name: "Living Room",
      price: 270,
      url: ""
    }),
    Purchase({
      name: "Lawn Mower Blade",
      price: 15,
      url:
        "https://www.homedepot.com/p/MTD-Genuine-Factory-Parts-21-in-Mulching-Walk-Behind-Mower-Blade-490-100-M084/202970675#product-overview"
    }),
    Purchase({
      name: "Refridgerator",
      price: 3250,
      url:
        "https://www.lowes.com/pd/KitchenAid-23-8-cu-ft-Counter-depth-French-Door-Refrigerator-with-Ice-Maker-Stainless-Steel-ENERGY-STAR/1000140499"
    }),
    Purchase({
      name: "Faucet",
      price: 150,
      url:
        "https://www.lowes.com/pd/AKDY-Matte-Black-1-Handle-Deck-Mount-Pre-Rinse-Handle-Lever-Residential-Kitchen-Faucet/1002393568"
    })
  ]
};

export function New(data = defaults) {
  return {
    purchases() {
      return data.purchases;
    },
    addPurchase(purchase) {
      return New({
        purchases: [...data.purchases, purchase]
      });
    },
    hasAtLeastOne() {
      return data.purchases.length >= 1;
    },
    up(purchase) {
      const i = data.purchases.findIndex(p => p.is(purchase));
      const a = data.purchases[i];
      const b = data.purchases[i - 1];
      const purchases = data.purchases.slice();
      purchases[i - 1] = a;
      purchases[i] = b;
      return New({
        purchases
      });
    },
    down(purchase) {
      const i = data.purchases.findIndex(p => p.is(purchase));
      const a = data.purchases[i];
      const b = data.purchases[i + 1];
      const purchases = data.purchases.slice();
      purchases[i + 1] = a;
      purchases[i] = b;
      return New({
        purchases
      });
    },
    isNotFirst(p) {
      return !p.is(data.purchases[0]);
    },
    isNotLast(p) {
      return !p.is(data.purchases[data.purchases.length - 1]);
    },
    withAvailability(frequency) {
      return data.purchases.map((p, i, purchases) => p.setAvailability(frequency.calculate(p, purchases)));
    }
  };
}

export const Context = React.createContext({
  purchases: null,
  setPurchases: null
});

const types = {
  "": nullFrequency,
  "Every 2 Weeks": every2Weeks,
};

export function get(user) {
  return types[user.frequency](user);
}

function nullFrequency() {
  return {
    calculate() {},
  };
}

function every2Weeks({ lastPaycheck, saved, contributions }) {
  return {
    calculate(purchase, purchases) {
      const date = new Date(lastPaycheck.getTime());
      let s = saved;
      let total = 0;
      for (let i = 0; i < purchases.length; i++) {
        total += purchases[i].data.product.price();

        if (purchases[i].is(purchase)) {
          break;
        }
      }

      while (s < total) {
        date.setDate(date.getDate() + 14);
        s += contributions;
      }

      return date;
    },
  };
}

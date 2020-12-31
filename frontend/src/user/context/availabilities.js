const types = {
  "": nullFrequency,
  "Every 2 Weeks": every2Weeks,
};

export function get(user) {
  return types[user.frequency](user);
}

function nullFrequency() {
  return {
    new() {
      return {
        calculate() {},
      };
    },
  };
}

function every2Weeks({ lastPaycheck, saved, contributions }) {
  return {
    new() {
      const date = new Date(lastPaycheck.getTime());
      let s = saved;

      return {
        calculate(purchase, purchases) {
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
    },
  };
}

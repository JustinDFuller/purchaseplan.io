const types = {
  "Every Week": everyWeek,
  "Every 2 Weeks": every2Weeks,
  "Once A Month": onceAMonth,
};

export function map(cb) {
  const res = [];

  for (const key in types) {
    res.push(cb(key));
  }

  return res;
}

export function get(user) {
  return types[user.frequency](user);
}

function everyWeek() {
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
        const purchase = purchases[i];
        const product = purchase.product();

        if (purchase.shouldSkip()) {
          continue;
        }

        total += product.price();

        if (purchase.is(purchase)) {
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

function onceAMonth() {
  return {
    calculate() {},
  };
}

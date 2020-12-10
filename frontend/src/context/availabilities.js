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
  const date = new Date(lastPaycheck.getTime());
  let s = saved;

  return {
    calculate(purchase, purchases) {
      let total = 0;
      for (let i = 0; i < purchases.length; i++) {
        total += purchases[i].price();

        if (purchases[i].is(purchase)) {
          break;
        }
      }

      while (s < total) {
        date.setDate(date.getDate() + 14);
        s += contributions;
      }

      if (date <= new Date()) {
        return "Today";
      }

      return date.toLocaleDateString("en-US");
    },
  };
}

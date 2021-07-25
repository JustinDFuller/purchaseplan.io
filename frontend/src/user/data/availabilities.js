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

function everyWeek({ lastPaycheck, saved, contributions }) {
  return {
    date() {
      const now = new Date();
      let date = new Date(lastPaycheck.getTime());

      while (date <= now) {
        date.setDate(date.getDate() + 7);
      }

      if (date > now) {
        date.setDate(date.getDate() - 7);
      }

      return date;
    },
    calculate(purchase, purchases) {
      if (contributions <= 0) {
        return null;
      }

      const date = new Date(this.date());
      let s = saved;
      let total = 0;

      for (const p of purchases) {
        if (p.shouldSkip()) {
          continue;
        }

        total += p.price();

        if (p.is(purchase)) {
          break;
        }
      }

      while (s < total) {
        date.setDate(date.getDate() + 7);
        s += contributions;
      }

      return date;
    },
  };
}

function every2Weeks({ lastPaycheck, saved, contributions }) {
  return {
    date() {
      const now = new Date();
      let date = new Date(lastPaycheck.getTime());

      while (date <= now) {
        date.setDate(date.getDate() + 14);
      }

      if (date > now) {
        date.setDate(date.getDate() - 14);
      }

      return date;
    },
    calculate(purchase, purchases) {
      if (contributions <= 0) {
        return null;
      }

      const date = new Date(this.date());
      let s = saved;
      let total = 0;

      for (const p of purchases) {
        if (p.shouldSkip()) {
          continue;
        }

        total += p.price();

        if (p.is(purchase)) {
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

function onceAMonth({ lastPaycheck, saved, contributions }) {
  return {
    date() {
      const now = new Date();
      let date = new Date(lastPaycheck.getTime());

      while (date <= now) {
        date.setMonth(date.getMonth() + 1);
      }

      if (date > now) {
        date.setMonth(date.getMonth() - 1);
      }

      return date;
    },
    calculate(purchase, purchases) {
      if (contributions <= 0) {
        return null;
      }

      const date = new Date(this.date());
      let s = saved;
      let total = 0;

      for (const p of purchases) {
        if (p.shouldSkip()) {
          continue;
        }

        total += p.price();

        if (p.is(purchase)) {
          break;
        }
      }

      while (s < total) {
        date.setMonth(date.getMonth() + 1);
        s += contributions;
      }

      return date;
    },
  };
}

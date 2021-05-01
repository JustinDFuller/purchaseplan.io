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
    calculate(purchase, purchases) {
      return interval({
        lastPaycheck,
        saved,
        contributions,
        purchase,
        purchases,
        interval: 7,
      });
    },
  };
}

function every2Weeks({ lastPaycheck, saved, contributions }) {
  return {
    calculate(purchase, purchases) {
      return interval({
        lastPaycheck,
        saved,
        contributions,
        purchase,
        purchases,
        interval: 14,
      });
    },
  };
}

function onceAMonth({ lastPaycheck, saved, contributions }) {
  return {
    calculate(purchase, purchases) {
      return interval({
        lastPaycheck,
        saved,
        contributions,
        purchase,
        purchases,
        interval: 30, // This isn't right
      });
    },
  };
}

function interval({
  lastPaycheck,
  saved,
  purchases,
  purchase,
  contributions,
  interval,
}) {
  const date = new Date(lastPaycheck.getTime());
  let s = saved;
  let total = 0;

  for (let i = 0; i < purchases.length; i++) {
    const p = purchases[i];
    if (p.shouldSkip()) {
      continue;
    }

    total += p.price();

    if (p.is(purchase)) {
      break;
    }
  }

  while (s < total) {
    date.setDate(date.getDate() + interval);
    s += contributions;
  }

  return date;
}

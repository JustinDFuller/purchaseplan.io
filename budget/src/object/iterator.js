export function iterator(data = [], constructor) {
  function isArray() {
    return data && Array.isArray(data);
  }

  return {
    map(fn) {
      return isArray() ? data.map(fn) : [];
    },
    isEmpty() {
      return !isArray() || data.length === 0;
    },
    add(item) {
      return constructor([...data, item]);
    },
    last() {
      return isArray() && data[data.length - 1];
    },
    from(d) {
      if (d === null || d === undefined) {
        return constructor();
      }

      if (Array.isArray(d)) {
        return constructor(d);
      }

      return d;
    },
    toJSON() {
      return data;
    },
    [Symbol.iterator]: function () {
      let i = 0;
      return {
        next: function () {
          if (i < data.length) {
            return {
              value: data[i++],
              done: false,
            };
          }

          return {
            done: true,
          };
        },
      };
    },
  };
}

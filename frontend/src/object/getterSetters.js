// getterSetters takes data, a constructor, and returns
// getter and setter functions for each value in data.
// The getters will return the value while the data will
// return a new constructor with the value set in it.
// It also exposes a data property to directly see the data
// and a toJSON method to help with JSON.stringify support.
export function getterSetters(data, constructor) {
  const obj = {
    data: Object.freeze(data), // Need to make child objects immutable as well.
    toJSON() {
      return data;
    },
  };

  // ex: name
  for (const key in data) {
    // ex: "Jusin Fuller"
    const val = data[key];

    // name() === "Justin Fuller"
    obj[key] = function () {
      return val;
    };

    // setName("Luke Skywalker") === User { name: "Luke Skywalker" }
    obj[`set${key.charAt(0).toUpperCase() + key.slice(1)}`] = function (
      newVal
    ) {
      // Keep numbers as a number
      if (typeof val === "number") {
        newVal = Number(newVal);
      }

      return constructor({
        ...data,
        [key]: newVal,
      });
    };
  }

  return Object.freeze(obj);
}

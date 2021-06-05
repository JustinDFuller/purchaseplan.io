export const dark = {
  background: "#1d1d42",
};

export const darkAlt = {
  background: "#141432",
  borderRight: "3px solid rgb(10 10 36)",
  borderBottom: "3px solid rgb(10 10 36)",
  borderLeft: "1px solid rgb(10 10 36)",
  borderTop: "1px solid rgb(10 10 36)",
};

export const roundBorder = {
  borderRadius: "5px",
};

export const darkLight = {
  background: "#26264e",
};

export const logo = {
  height: "40px",
};

export const text = {
  color: "white",
};

export const textDark = {
  color: "#9999a8",
};

export const success = {
  color: "#6fcf97",
};

export const danger = {
  color: "#dc3545",
};

export const transparent = {
  background: "transparent",
};

export const pointer = {
  cursor: "pointer",
};

export const bubble = {
  background: "#4e2ecf",
  padding: "8px 20px",
  borderRadius: 4,
  minWidth: 90,
  textAlign: "center",
};

export const zIndex = {
  zIndex: 999,
};

export function combine(...styles) {
  return Object.assign({}, ...styles);
}

export function on(bool, style) {
  if (bool) {
    return style;
  }

  return {};
}

export function classes(...inputs) {
  const classNames = [];

  for (const i of inputs) {
    switch (typeof i) {
      case "string":
        classNames.push(i);
        break;
      case "object":
        console.log(i);
        for (const key in i) {
          const truthy = i[key];

          if (truthy) {
            classNames.push(key);
          }
        }
        break;
    }
  }

  return classNames;
}

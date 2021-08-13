const themes = {
  dark: {
    background: "#1d1d42",
    backgroundDark: "#0a0a24",
    backgroundLight: "#141432",
    cardBorderColor: "#0a0a24",
    borderColor: "white",
    textColor: "white",
    textColorFaded: "#ccc",
    highlight: "#4e2ecf",
  },
  light: {
    background: "#eee",
    backgroundDark: "#ddd",
    backgroundLight: "#fff",
    cardBorderColor: "black",
    borderColor: "black",
    textColor: "black",
    textColorFaded: "#4e4e4e",
    highlight: "#4e2ecf",
  },
};

export const theme =
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? themes.dark
    : themes.light;

export const dark = {
  background: theme.background,
  fontColor: theme.textColor,
};

export const darkAlt = {
  background: theme.backgroundLight,
  borderRight: `3px solid ${theme.cardBorderColor}`,
  borderBottom: `3px solid ${theme.cardBorderColor}`,
  borderLeft: `1px solid ${theme.cardBorderColor}`,
  borderTop: `1px solid ${theme.cardBorderColor}`,
  fontColor: theme.textColor,
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
  color: theme.textColor,
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
        for (const key in i) {
          const truthy = i[key];

          if (truthy) {
            classNames.push(key);
          }
        }
        break;
      default:
        break;
    }
  }

  return classNames;
}

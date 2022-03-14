export const colors = {
  primary: "#573fb9",
  secondary: "#26264e",
  dark: "#0a0a1a",
  light: "#e9e9ed",
  success: "#4d966b",
  failure: "#bb2e3b",
  muted: "#9999a8",
};

export const themes = {
  dark: {
    ...colors,
    background: colors.secondary,
    cardBackground: colors.secondary,
    cardBorderColor: "rgb(55 55 106)",
    cardTextColor: colors.light,
    borderColor: colors.light,
    textColor: colors.light,
    textColorFaded: colors.muted,
    addToPurchaseBackground: colors.dark,
    addToPurchaseColor: colors.light,
  },
  light: {
    ...colors,
    background: colors.light,
    cardBackground: colors.secondary,
    cardBorderColor: colors.dark,
    cardTextColor: colors.light,
    borderColor: colors.dark,
    textColor: colors.dark,
    textColorFaded: colors.muted,
    addToPurchaseBackground: colors.dark,
    addToPurchaseColor: colors.light,
  },
};

const savedTheme = "dark"; // localStorage.getItem("theme");
const preferrsDarkTheme =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

if (savedTheme === "dark" || preferrsDarkTheme) {
  document.body.classList.add("theme-dark");
}

export const theme =
  themes[savedTheme] || (preferrsDarkTheme ? themes.dark : themes.light);

export const dark = {
  background: theme.background,
  fontColor: theme.textColor,
};

export const card = {
  borderRight: `3px solid ${theme.cardBorderColor}`,
  borderBottom: `3px solid ${theme.cardBorderColor}`,
  borderLeft: `1px solid ${theme.cardBorderColor}`,
  borderTop: `1px solid ${theme.cardBorderColor}`,
  background: theme.cardBackground,
  color: theme.cardTextColor,
};

export const darkAlt = {
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
  background: "#4d966b",
  borderColor: "#4d966b",
  color: "white",
};

export const danger = {
  background: "#bb2e3b",
  borderColor: "#bb2e3b",
  color: "white",
};

export const transparent = {
  background: "transparent",
};

export const pointer = {
  cursor: "pointer",
};

export const bubble = {
  background: colors.primary,
  padding: "8px 0",
  borderRadius: 4,
  textAlign: "center",
  color: colors.light,
  width: 100,
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export const zIndex = {
  zIndex: 999,
};

export const colorSuccess = {
  color: theme.success,
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
          const value = i[key];

          if (value) {
            classNames.push(key);
          }
        }
        break;
      default:
        break;
    }
  }

  return classNames.join(" ");
}

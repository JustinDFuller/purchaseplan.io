export const styles = {
  dark: {
    background: "#1d1d42",
  },
  darkAlt: {
    background: "#141432",
  },
  logo: {
    height: "40px",
  },
  text: {
    color: "white",
  },
  textDark: {
    color: "#9999a8",
  },
  success: {
    color: "#6fcf97",
  },
  pointer: {
    cursor: "pointer",
  },
};

export function combine(...styles) {
  return Object.assign({}, ...styles);
}

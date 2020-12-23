export const dark = {
  background: "#1d1d42",
};

export const darkAlt = {
  background: "#141432",
  borderRight: "3px solid rgb(10 10 36)",
  borderRadius: "5px",
  borderBottom: "3px solid rgb(10 10 36)",
  borderLeft: "1px solid rgb(10 10 36)",
  borderTop: "1px solid rgb(10 10 36)",
};

export const darkLight = {
  background: '#26264e',
  borderRadius: '5px',
}

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

export const pointer = {
  cursor: "pointer",
};

export const bubble = {
  background: '#4E2ECF',
  padding: '8px 20px',
  borderRadius: 4,
}

export function combine(...styles) {
  return Object.assign({}, ...styles);
}

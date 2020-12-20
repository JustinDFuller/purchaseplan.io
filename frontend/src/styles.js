export const dark  = {
  background: "#1d1d42",
}

export const darkAlt = {
  background: "#141432",
}
  
export const logo = {
  height: "40px",
}

export const text = {
  color: "white",
}
  
export const textDark = {
  color: "#9999a8",
}

export const success = {
  color: "#6fcf97",
}

export const pointer = {
  cursor: "pointer",
}

export function combine(...styles) {
  return Object.assign({}, ...styles);
}

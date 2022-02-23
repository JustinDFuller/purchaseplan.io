import { iterator } from "object";

export function New(data = []) {
  return iterator(data, New);
}

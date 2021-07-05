import { fetch } from "../api";

export async function act(action, options) {
  try {
    const r = await fetch(`/actions/${action}`, {
      body: JSON.stringify(options),
    });

    if (!r.ok || r.statusCode !== 200) {
      console.error("Received bad status", r.statusCode);
      return null;
    }

    return r.json();
  } catch (e) {
    console.error(e);
  }

  return null;
}

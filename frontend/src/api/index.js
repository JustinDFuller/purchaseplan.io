const hostname = window.location.hostname;
const local = hostname === "localhost";
const host = `//${hostname}${local ? ":8080" : ""}`;

function withHost(url) {
  return `${host}${url}`;
}

function isNotLocal() {
  return !local;
}

function credentials() {
  return isNotLocal() ? "same-origin" : "include";
}

export async function fetch(url, options) {
  try {
    const response = await window.fetch(withHost(url), {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      credentials: credentials(),
    });
    return {
      response,
      unauthorized: response.status === 401,
      serverError: response.status >= 500,
      data: response.ok ? await response.json() : null,
      error:
        !response.ok || response.status >= 400
          ? new Error("Error in response")
          : null,
    };
  } catch (error) {
    return {
      error,
      serverError: true,
    };
  }
}

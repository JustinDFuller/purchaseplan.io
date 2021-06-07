function withHost(url) {
  return `//${window.location.host}${url}`;
}

function credentials() {
  return "same-origin";
}

export async function fetch(url, options) {
  try {
    const response = await window.fetch(withHost(url), {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
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

// Routes renders the first route when
// path matches window.location.pathname
export function Routes({ routes }) {
  const route = routes.find((r) => r.path === window.location.pathname);

  if (route) {
    return route.Component;
  }

  return null;
}

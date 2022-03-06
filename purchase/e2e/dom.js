export function dataTestId(id) {
  return cy.get(`[data-testid=${id}]`)
}

function url(path) {
  const base = process.env.TEST_URL || 'http://localhost:3000'
  return base + path
}

describe('Landing Page', function () {
  it('Loads', function() {
    cy.visit(url("/")) 
    cy.contains("Log in")
  })
})

function url(path) {
  const base = process.env.TEST_URL || 'http://localhost:3000'
  return base + path
}

describe('Landing Page', function () {
  it('Loads', function() {
    cy.visit(url("/")) 
    cy.contains("Log in")
  })

  it("Links to blog", function() {
    cy.visit(url("/"))

    cy.get("[data-testid=blog]").should("have.attr",  "href", "https://medium.com/@purchaseplan.io").contains("Blog")
  })
})

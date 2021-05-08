describe('Landing Page', function () {
  it('Loads', function() {
    cy.visit("/") 
    cy.contains("Log in")
  })

  it("Links to blog", function() {
    cy.visit("/")

    cy.get("[data-testid=blog]").should("have.attr",  "href", "https://medium.com/@purchaseplan.io").contains("Blog")
  })
})

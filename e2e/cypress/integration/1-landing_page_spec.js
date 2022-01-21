import { dataTestId } from '../../dom'

describe('Landing Page', function () {
  it('Loads', function() {
    cy.visit("/") 
    cy.contains("Log in")
  })

  it("Links to blog", function() {
    cy.visit("/")

    dataTestId("blog")
      .should("have.attr",  "href", "https://blog.purchaseplan.io")
      .contains("Blog")
  })

  it("Logs In", function() {
    cy.visit("/")

    dataTestId("login-button")
      .click()

    cy.url().should("include", '/app/auth/login')
  })
})

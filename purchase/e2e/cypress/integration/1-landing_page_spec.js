import { dataTestId } from '../../dom'

describe('Landing Page', function () {
  it('Loads', function() {
    cy.visit("/") 
    cy.contains("Get started for free")
  })

  it("Logs In", function() {
    cy.visit("/")

    dataTestId("login-button")
      .first()
      .click()

    cy.url().should("include", '/app/auth/login')
  })
})

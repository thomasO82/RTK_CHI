describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')
    cy.get('#root input').click();
    cy.get('#root input').type('lasagne');
    cy.get('#recipes h3').should('have.text', 'Lasagne');
  })
})
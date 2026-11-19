describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:5174')
    cy.get('#root input').click();
    cy.get('#root input').type('lasagne');
    cy.get('#recipes h3').should('have.text', 'Lasagne');
    
    cy.get('#categories li:nth-child(11) button').click();
    cy.get('#root input').click();
    cy.get('#root input').type('tes');
    cy.get('#recipes a[href="/recipe/53012"] h3').click();
    cy.get('#recipe h2').should('have.text', 'Gigantes Plaki');
  })
})
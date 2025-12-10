describe('Tela Principal (Home)', () => {
  const userMock = {
    nome: 'Clark Kent',
    email: 'clark@ufrpe.br',
    ehAluno: true,
    prefereAltoContraste: false,
    prefereFonteGrande: false
  };

  beforeEach(() => {
    cy.setCookie('ru-facil-token', 'fake-token-valid');
    cy.setCookie('ru-facil-email', userMock.email);
    cy.setCookie('ru-facil-cliente', JSON.stringify(userMock));

    cy.intercept('GET', '**/api/v1/extrato/saldo*', {
      statusCode: 200,
      body: {
        email: userMock.email,
        saldoAlmoco: 12,
        saldoJantar: 3
      }
    }).as('getSaldo');

    cy.intercept('GET', '**/api/v1/menu/*', {
      statusCode: 200,
      body: {
        date: '2025-12-08',
        meal: 'ALMOCO',
        slots: [
          { slot: 'PRATO_PRINCIPAL_1', title: 'Estrogonofe de Frango' }
        ]
      }
    }).as('getMenu');

    cy.visit('/home');
  });

  it('Deve carregar a estrutura principal da Home', () => {
    cy.get('[data-testid="home-page-container"]').should('be.visible');
    cy.get('[data-testid="dashboard-header"]').should('contain', 'Clark');
  });

  it('Deve exibir o saldo correto vindo da API', () => {
    cy.wait('@getSaldo');
    
    cy.get('[data-testid="meals-summary-section"]').within(() => {
      cy.contains('12').should('be.visible');
      cy.contains('3').should('be.visible');
    });
  });

  it('Deve exibir o cardápio', () => {
    cy.wait('@getMenu');
    cy.get('[data-testid="menu-table-section"]').should('contain', 'Estrogonofe de Frango');
  });

  it('Deve abrir o modal de utilização ao clicar em Utilizar', () => {
    cy.contains('button', 'Utilizar').click();
    
    cy.get('[role="dialog"]').should('be.visible');
    cy.contains('Qual refeição você vai fazer agora?').should('be.visible');
  });

  it('Deve fazer logout corretamente', () => {
    cy.get('[data-testid="logout-btn"]').click();
    cy.url().should('include', '/login');
    cy.getCookie('ru-facil-token').should('be.null');
  });
});
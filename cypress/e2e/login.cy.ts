describe('Fluxo de Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('Deve renderizar os campos de email e senha corretamente', () => {
    cy.get('[data-testid="login-card"]').should('be.visible');
    cy.get('[data-testid="email-input"]').should('be.visible');
    cy.get('[data-testid="password-input"]').should('be.visible');
    cy.get('[data-testid="login-submit-btn"]').should('contain', 'Entrar');
  });

  it('Deve realizar login com sucesso e redirecionar para a home', () => {
    // Mock da API de login
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        cliente: {
          id: 1,
          nome: 'Lois Lane',
          email: 'lois@ufrpe.br',
          ehAluno: true,
          prefereAltoContraste: false,
          prefereFonteGrande: false
        }
      },
    }).as('loginRequest');

    // Mock das chamadas subsequentes da Home
    cy.intercept('GET', '**/api/v1/extrato/saldo*', {
      statusCode: 200,
      body: { email: 'lois@ufrpe.br', saldoAlmoco: 10, saldoJantar: 5 }
    });
    cy.intercept('GET', '**/api/v1/menu/*', { statusCode: 200, body: {} });

    // Ação
    cy.get('[data-testid="email-input"]').type('lois@ufrpe.br');
    cy.get('[data-testid="password-input"]').type('123456');
    cy.get('[data-testid="login-submit-btn"]').click();

    cy.wait('@loginRequest');

    // Verificação
    cy.url().should('include', '/home');
    cy.getCookie('ru-facil-token').should('exist');
  });

  it('Deve exibir erro ao inserir credenciais inválidas', () => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 401,
      body: { message: 'Falha na autenticação' }
    }).as('loginFail');

    cy.get('[data-testid="email-input"]').type('errado@ufrpe.br');
    cy.get('[data-testid="password-input"]').type('senhaerrada');
    cy.get('[data-testid="login-submit-btn"]').click();

    cy.wait('@loginFail');

    cy.get('[data-testid="login-error-msg"]')
      .should('be.visible')
      .and('contain', 'Email ou senha incorretos');
      
    cy.url().should('include', '/login');
  });
});
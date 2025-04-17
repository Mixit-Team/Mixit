describe('로그인 페이지 테스트', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('로그인 폼이 올바르게 표시되는지 확인', () => {
    cy.get('form').should('be.visible');

    cy.get('input#email').should('exist').and('have.attr', 'placeholder', '아이디을 입력하세요');

    cy.get('input#password')
      .should('exist')
      .and('have.attr', 'placeholder', '비밀번호를 입력하세요');

    cy.get('button[type="submit"]').should('contain.text', '로그인');
  });

  it('사용자 입력 후 폼 제출 테스트', () => {
    cy.get('input#email').type('test@mixit.com');
    cy.get('input#password').type('123');

    // 폼 제출
    cy.get('form').submit();

    cy.url().should('include', '/login');
  });
});

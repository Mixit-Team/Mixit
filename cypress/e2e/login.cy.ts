describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('로그인 폼 요소가 모두 렌더링 되어야 한다.', () => {
    // Check if form elements are visible
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('input[type="checkbox"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
    cy.contains('카카오로 로그인').should('be.visible');
  });

  it('빈 항목이 있으면 에러 메시지가 나와야 한다.', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('아이디를 입력해주세요').should('be.visible');
    cy.contains('비밀번호를 입력해주세요').should('be.visible');
  });

  it('회원가입 링크를 클릭하면 회원가입 페이지로 이동해야 한다.', () => {
    cy.contains('회원가입').click();
    cy.url().should('include', '/signup');
  });

  it('뒤로가기 버튼을 클릭하면 메인 페이지로 이동해야 한다.', () => {
    cy.get('.absolute.top-6.left-4 button').click();
    cy.url().should('not.include', '/login');
  });
});

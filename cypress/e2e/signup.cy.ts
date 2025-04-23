describe('Signup Page', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  const getFormElements = () => ({
    userIdInput: cy.get('input[name="userId"]'),
    passwordInput: cy.get('input[name="password"]'),
    passwordConfirmInput: cy.get('input[name="passwordConfirm"]'),
    nameInput: cy.get('input[name="name"]'),
    birthDateInput: cy.get('input[name="birthDate"]'),
    emailInput: cy.get('input[name="email"]'),
    nicknameInput: cy.get('input[name="nickname"]'),
    serviceAgreement: cy.get('input[name="agreements.service"]'),
    privacyAgreement: cy.get('input[name="agreements.privacy"]'),
    submitButton: cy.get('button[type="submit"]'),
  });

  it('회원가입 폼 요소가 모두 렌더링 되어야 한다.', () => {
    const elements = getFormElements();
    Object.values(elements).forEach(element => {
      element.should('be.visible');
    });
  });

  it('초기 상태에서 제출 버튼이 비활성화 되어야 한다.', () => {
    const { submitButton } = getFormElements();
    submitButton.should('be.disabled');
  });

  it('빈 항목이 있으면 에러 메시지가 나와야 한다.', () => {
    const { submitButton } = getFormElements();

    // 약관 동의를 먼저 체크
    cy.get('input[name="agreements.service"]').check();
    cy.get('input[name="agreements.privacy"]').check();

    // 약관 동의 후에도 필수 입력값이 없으면 버튼이 비활성화되어야 함
    submitButton.should('be.disabled');

    // 필수 입력값을 입력
    cy.get('input[name="userId"]').type('testuser');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="passwordConfirm"]').type('password123');
    cy.get('input[name="name"]').type('홍길동');
    cy.get('input[name="birthDate"]').type('900101');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="nickname"]').type('테스트닉네임');

    // 모든 필수 입력값이 입력되면 버튼이 활성화되어야 함
    submitButton.should('not.be.disabled');
  });

  it('비밀번호가 일치하지 않으면 에러 메시지가 나와야 한다.', () => {
    const { passwordInput, passwordConfirmInput, submitButton } = getFormElements();

    // 필수 입력값 입력
    cy.get('input[name="userId"]').type('testuser');
    cy.get('input[name="name"]').type('홍길동');
    cy.get('input[name="birthDate"]').type('900101');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="nickname"]').type('테스트닉네임');
    cy.get('input[name="agreements.service"]').check();
    cy.get('input[name="agreements.privacy"]').check();

    // 비밀번호 불일치 입력
    passwordInput.type('password123');
    passwordConfirmInput.type('different123');

    // 버튼이 활성화되어야 함
    submitButton.should('not.be.disabled');
    submitButton.click();

    cy.contains('비밀번호가 일치하지 않습니다').should('be.visible');
  });

  it('비밀번호 형식이 올바르지 않으면 에러 메시지가 나와야 한다.', () => {
    const { passwordInput, passwordConfirmInput, submitButton } = getFormElements();

    // 필수 입력값 입력
    cy.get('input[name="userId"]').type('testuser');
    cy.get('input[name="name"]').type('홍길동');
    cy.get('input[name="birthDate"]').type('900101');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="nickname"]').type('테스트닉네임');
    cy.get('input[name="agreements.service"]').check();
    cy.get('input[name="agreements.privacy"]').check();

    // 잘못된 비밀번호 형식 입력
    passwordInput.type('123');
    passwordConfirmInput.type('123');

    // 버튼이 활성화되어야 함
    submitButton.should('not.be.disabled');
    submitButton.click();

    cy.contains('비밀번호는 영문, 숫자를 포함한 8~12자여야 합니다').should('be.visible');
  });

  it('생년월일 형식이 올바르지 않으면 에러 메시지가 나와야 한다.', () => {
    const { birthDateInput, submitButton } = getFormElements();

    // 필수 입력값 입력
    cy.get('input[name="userId"]').type('testuser');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="passwordConfirm"]').type('password123');
    cy.get('input[name="name"]').type('홍길동');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="nickname"]').type('테스트닉네임');
    cy.get('input[name="agreements.service"]').check();
    cy.get('input[name="agreements.privacy"]').check();

    // 잘못된 생년월일 형식 입력
    birthDateInput.type('12345'); // 5자리 입력

    // 버튼이 활성화되어야 함
    submitButton.should('not.be.disabled');
    submitButton.click();

    cy.contains('생년월일은 6자리여야 합니다').should('be.visible');
  });

  it('이메일 형식이 올바르지 않으면 에러 메시지가 나와야 한다.', () => {
    const { emailInput, submitButton } = getFormElements();

    // 필수 입력값 입력
    cy.get('input[name="userId"]').type('testuser');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="passwordConfirm"]').type('password123');
    cy.get('input[name="name"]').type('홍길동');
    cy.get('input[name="birthDate"]').type('900101');
    cy.get('input[name="nickname"]').type('테스트닉네임');
    cy.get('input[name="agreements.service"]').check();
    cy.get('input[name="agreements.privacy"]').check();

    // 잘못된 이메일 형식 입력
    emailInput.type('invalid-email');

    // 버튼이 활성화되어야 함
    submitButton.should('not.be.disabled');
    submitButton.click();

    cy.contains('올바른 이메일 형식이 아닙니다').should('be.visible');
  });

  it('뒤로가기 버튼을 클릭하면 메인 페이지로 이동해야 한다.', () => {
    cy.get('.absolute.top-6.left-4 button').click();
    cy.url().should('not.include', '/signup');
  });
});

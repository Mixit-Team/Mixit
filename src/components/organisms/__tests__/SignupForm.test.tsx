import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupForm from '../SignupForm';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('SignupForm', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    render(<SignupForm />);
  });

  const getFormElements = () => ({
    userIdInput: screen.getByPlaceholderText('아이디를 입력하세요'),
    passwordInput: screen.getByPlaceholderText('비밀번호를 입력하세요'),
    passwordConfirmInput: screen.getByPlaceholderText('비밀번호를 다시 입력하세요'),
    nameInput: screen.getByPlaceholderText('이름을 입력하세요'),
    birthDateInput: screen.getByPlaceholderText('생년월일 6자리를 입력하세요'),
    emailInput: screen.getByPlaceholderText('이메일을 입력하세요'),
    nicknameInput: screen.getByPlaceholderText('닉네임을 입력하세요'),
    submitButton: screen.getByRole('button', { name: '회원가입' }),
  });

  it('회원가입 폼 요소가 모두 렌더링 되어야 한다.', () => {
    const elements = getFormElements();
    Object.values(elements).forEach(element => {
      expect(element).toBeInTheDocument();
    });
  });

  it('빈 항목이 있으면 에러 메시지가 나와야 한다.', async () => {
    const { submitButton } = getFormElements();
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessages = [
        '아이디를 입력해주세요',
        '비밀번호를 입력해주세요',
        '비밀번호 확인을 입력해주세요',
        '이름을 입력해주세요',
        '생년월일을 입력해주세요',
        '이메일을 입력해주세요',
        '닉네임을 입력해주세요',
        '서비스 이용약관에 동의해주세요',
        '개인정보 수집 및 이용에 동의해주세요',
      ];

      errorMessages.forEach(message => {
        expect(screen.getByText(message)).toBeInTheDocument();
      });
    });
  });

  it('비밀번호가 일치하지 않으면 에러 메시지가 나와야 한다.', async () => {
    const { passwordInput, passwordConfirmInput, submitButton } = getFormElements();

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(passwordConfirmInput, { target: { value: 'different123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('비밀번호가 일치하지 않습니다')).toBeInTheDocument();
    });
  });

  it('비밀번호 형식이 올바르지 않으면 에러 메시지가 나와야 한다.', async () => {
    const { passwordInput, passwordConfirmInput, submitButton } = getFormElements();

    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.change(passwordConfirmInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('비밀번호는 영문, 숫자를 포함한 8~12자여야 합니다')
      ).toBeInTheDocument();
    });
  });
});

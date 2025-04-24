import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../LoginForm';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('LoginForm', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    render(<LoginForm />);
  });

  it('로그인 폼 요소가 모두 렌더링 되어야 한다.', () => {
    expect(screen.getByPlaceholderText('아이디를 입력하세요')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('비밀번호를 입력하세요')).toBeInTheDocument();
    expect(screen.getByLabelText('아이디 저장')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
    expect(screen.getByText('카카오로 로그인')).toBeInTheDocument();
  });

  it('빈 항목이 있으면 에러 메시지가 나와야 한다.', () => {
    fireEvent.click(screen.getByRole('button', { name: '로그인' }));

    expect(screen.getByText('아이디를 입력해주세요')).toBeInTheDocument();
    expect(screen.getByText('비밀번호를 입력해주세요')).toBeInTheDocument();
  });

  it('회원가입 링크를 클릭하면 회원가입 페이지로 이동해야 한다.', () => {
    fireEvent.click(screen.getByText('회원가입'));
    expect(mockRouter.push).toHaveBeenCalledWith('/signup');
  });
});

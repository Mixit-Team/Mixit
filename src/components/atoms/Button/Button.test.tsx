/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from '.';

describe('Button 컴포넌트', () => {
  it('버튼 텍스트가 올바르게 렌더링된다', () => {
    render(<Button>테스트 버튼</Button>);
    const buttonElement = screen.getByRole('button', { name: /테스트 버튼/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('버튼에 전달된 속성이 적용된다', () => {
    render(<Button disabled>비활성 버튼</Button>);
    const buttonElement = screen.getByRole('button', { name: /비활성 버튼/i });
    expect(buttonElement).toBeDisabled();
  });
});

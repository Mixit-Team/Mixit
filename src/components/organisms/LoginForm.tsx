'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';

interface LoginFormInputs {
  email: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = data => {
    console.log('Login data: ', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-md">
      <FormField
        label="아이디"
        id="email"
        type="email"
        placeholder="아이디을 입력하세요"
        registration={register('email', {
          required: '아이디을 입력하세요',
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: '유효한 아이디 주소를 입력하세요',
          },
        })}
        error={errors.email}
      />
      <FormField
        label="비밀번호"
        id="password"
        type="password"
        placeholder="비밀번호를 입력하세요"
        registration={register('password', {
          required: '비밀번호를 입력하세요',
          minLength: { value: 6, message: '비밀번호는 최소 6자 이상이어야 합니다' },
        })}
        error={errors.password}
      />
      <Button type="submit" className="w-full rounded bg-blue-500 p-2 text-white">
        로그인
      </Button>
    </form>
  );
};

export default LoginForm;

'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const loginSchema = z.object({
  username: z.string().min(1, '아이디를 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
  saveId: z.boolean(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      saveId: false,
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = data => {
    console.log(data);
    // TODO: Implement login logic
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="contents-center flex h-screen max-h-full flex-col items-center justify-center space-y-6"
    >
      {/* Logo */}
      <div className="pt-1 text-4xl font-bold">
        <span className="text-black">mix</span>
        <span className="text-orange-500">i</span>
        <span className="text-pink-500">t</span>
      </div>
      <p className="text-md pb-10 text-center text-gray-600">
        요즘 뜨는 꿀조합부터 나만의 비밀 조합까지
        <br />
        이제 믹스잇에서 한 번에 만나보세요.
      </p>

      {/* Form Fields */}
      <div className="w-full space-y-4 pt-30">
        <div>
          <input
            type="text"
            placeholder="아이디"
            className="w-full rounded border border-gray-300 px-4 py-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
            {...register('username')}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>
        <div>
          <input
            type="password"
            placeholder="비밀번호"
            className="w-full rounded border border-gray-300 px-4 py-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
      </div>

      {/* Save ID Checkbox */}
      <div className="flex w-full items-center justify-start">
        <input
          type="checkbox"
          id="saveId"
          className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
          {...register('saveId')}
        />
        <label htmlFor="saveId" className="ml-2 text-sm text-gray-600">
          아이디 저장
        </label>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className="w-full rounded bg-orange-500 py-2 font-semibold text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none"
      >
        로그인하기
      </button>

      {/* Links */}
      <div className="text-center text-xs text-gray-500">
        <a href="#" className="hover:underline">
          아이디/비밀번호 찾기
        </a>
        <span className="mx-2">|</span>
        <a href="/signup" className="hover:underline">
          회원가입
        </a>
      </div>

      {/* Kakao Login Button */}
      <button
        type="button"
        className="mt-4 w-full rounded border border-white bg-yellow-300 py-2 text-white hover:bg-yellow-400 focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:outline-none"
      >
        카카오로 로그인하기
      </button>
    </form>
  );
};

export default LoginForm;

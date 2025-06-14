'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import InputField from './InputField';
import Button from '../atoms/Button';
import Modal from '../atoms/Modal';

interface ProfileAuthFormData {
  userId: string;
  password: string;
}

interface ProfileAuthFormProps {
  onAuthenticated: () => void;
  userId?: string;
}

const ProfileAuthForm: React.FC<ProfileAuthFormProps> = ({ onAuthenticated, userId = '' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ProfileAuthFormData>({
    mode: 'onChange',
    defaultValues: {
      userId,
      password: '',
    },
  });

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const showErrorModal = useCallback((message: string) => {
    setModalMessage(message);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const onSubmit = useCallback(
    async (data: ProfileAuthFormData) => {
      setIsLoading(true);

      try {
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password: data.password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '인증에 실패했습니다.');
        }

        onAuthenticated();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '인증에 실패했습니다.';
        showErrorModal(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [onAuthenticated, showErrorModal]
  );

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col space-y-5">
        <InputField
          label="아이디"
          id="userId"
          registration={register('userId', { required: '아이디를 입력해주세요' })}
          error={errors.userId}
          readOnly={!!userId}
        />

        <InputField
          label="비밀번호"
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="비밀번호를 입력해주세요"
          registration={register('password', { required: '비밀번호를 입력해주세요' })}
          error={errors.password}
          icon={
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          disabled={!isValid || isLoading}
          className="mt-6"
        >
          인증하기
        </Button>
      </form>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="알림"
        message={modalMessage}
        buttonText="확인"
      />
    </>
  );
};

export default ProfileAuthForm;

'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import InputField from './InputField';
import Button from '../atoms/Button';
import Modal from '../atoms/Modal';
import { verifyUser } from '@/services/auth/verify';

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
        await verifyUser(data.password);
        onAuthenticated();
      } catch (error) {
        const verifyError = error as { status: number; message: string };
        if (verifyError.status === 401) {
          showErrorModal('로그인이 필요합니다.');
        } else {
          showErrorModal('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
        }
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

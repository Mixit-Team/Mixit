'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '@/components/molecules/InputField';
import Button from '@/components/atoms/Button';
import Modal from '@/components/atoms/Modal';
import Footer from '@/components/organisms/Footer';
import type { FieldError } from 'react-hook-form';
import BackButton from '@/components/atoms/BackButton';

const FIND_ID = 'findId';
const FIND_PW = 'findPw';

function maskId(id: string) {
  if (id.length <= 4) return id;
  return id.slice(0, 4) + '*'.repeat(id.length - 4);
}

// 타입 정의
interface FindIdForm {
  name: string;
  birth: string;
  email: string;
}
interface FindPwForm {
  id: string;
  birth: string;
  email: string;
}

export default function FindAccountPage() {
  const [tab, setTab] = useState<typeof FIND_ID | typeof FIND_PW>(FIND_ID);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // 아이디 찾기 폼
  const {
    register: registerId,
    handleSubmit: handleSubmitId,
    formState: { errors: errorsId, isValid: isValidId },
    reset: resetId,
  } = useForm<FindIdForm>({ mode: 'onChange' });

  // 비밀번호 찾기 폼
  const {
    register: registerPw,
    handleSubmit: handleSubmitPw,
    formState: { errors: errorsPw, isValid: isValidPw },
    reset: resetPw,
  } = useForm<FindPwForm>({ mode: 'onChange' });

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // 아이디 찾기
  const onFindId = useCallback(
    async (data: FindIdForm) => {
      try {
        const params = new URLSearchParams({
          name: data.name,
          birth: data.birth,
          email: data.email,
        });
        const res = await fetch(`/api/v1/find-account/id?${params.toString()}`);
        if (!res.ok) throw new Error('not found');
        const result = await res.json();
        const userId = result?.data?.userId;
        if (userId) {
          setModalMessage(`회원님의 아이디는 [${maskId(userId)}]입니다.`);
          resetId();
        } else {
          setModalMessage('일치하는 아이디가 없습니다.\n회원정보를 확인해 주세요.');
        }
      } catch {
        setModalMessage('일치하는 아이디가 없습니다.\n회원정보를 확인해 주세요.');
      } finally {
        setIsModalOpen(true);
      }
    },
    [resetId]
  );

  // 비밀번호 찾기
  const onFindPw = useCallback(
    async (data: FindPwForm) => {
      try {
        const res = await fetch('/api/v1/find-account/password/reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            loginId: data.id,
            birth: data.birth,
            email: data.email,
          }),
        });
        if (!res.ok) throw new Error('not found');
        setModalMessage('회원님의 임시 비밀번호를 이메일로 보내드렸습니다.');
        resetPw();
      } catch {
        setModalMessage('일치하는 아이디가 없습니다.\n회원정보를 확인해 주세요.');
      } finally {
        setIsModalOpen(true);
      }
    },
    [resetPw]
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f5]">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col bg-white shadow-md">
        {/* 상단 바 */}
        <div className="relative flex h-14 items-center border-b border-gray-100 px-4">
          <BackButton className="absolute top-1/2 left-4 -translate-y-1/2" />
          <div className="w-full text-center text-lg font-semibold">계정 찾기</div>
        </div>
        {/* 탭 */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 border-b-2 py-4 text-center text-base font-semibold transition-colors duration-200 ${tab === FIND_ID ? 'border-[#FF8000] text-[#FF8000]' : 'border-transparent text-gray-400'}`}
            onClick={() => {
              setTab(FIND_ID);
              resetId();
            }}
          >
            아이디 찾기
          </button>
          <button
            className={`flex-1 border-b-2 py-4 text-center text-base font-semibold transition-colors duration-200 ${tab === FIND_PW ? 'border-[#FF8000] text-[#FF8000]' : 'border-transparent text-gray-400'}`}
            onClick={() => {
              setTab(FIND_PW);
              resetPw();
            }}
          >
            비밀번호 찾기
          </button>
        </div>
        {/* 폼 */}
        <div className="flex-1 px-6 py-8">
          {tab === FIND_ID ? (
            <form onSubmit={handleSubmitId(onFindId)} className="space-y-6">
              <InputField
                label="이름"
                id="name"
                registration={registerId('name', { required: '이름을 입력해 주세요.' })}
                error={errorsId.name as FieldError}
                placeholder="이름을 입력해 주세요"
              />
              <InputField
                label="생년월일"
                id="birth"
                registration={registerId('birth', {
                  required: '생년월일을 입력해 주세요.',
                  pattern: {
                    value: /^\d{6}$/,
                    message: '생년월일 6자리로 입력해 주세요.',
                  },
                })}
                error={errorsId.birth as FieldError}
                placeholder="생년월일 6자리 (940101)"
                maxLength={6}
              />
              <InputField
                label="이메일"
                id="email"
                registration={registerId('email', {
                  required: '이메일을 입력해 주세요.',
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: '이메일 형식이 올바르지 않습니다.',
                  },
                })}
                error={errorsId.email as FieldError}
                placeholder="이메일 입력"
              />
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={!isValidId}
                className="mt-6"
              >
                아이디 찾기
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmitPw(onFindPw)} className="space-y-6">
              <InputField
                label="아이디"
                id="id"
                registration={registerPw('id', { required: '아이디를 입력해 주세요.' })}
                error={errorsPw.id as FieldError}
                placeholder="아이디 입력"
              />
              <InputField
                label="생년월일"
                id="birth"
                registration={registerPw('birth', {
                  required: '생년월일을 입력해 주세요.',
                  pattern: {
                    value: /^\d{6}$/,
                    message: '생년월일 6자리로 입력해 주세요.',
                  },
                })}
                error={errorsPw.birth as FieldError}
                placeholder="생년월일 6자리 (940101)"
                maxLength={6}
              />
              <InputField
                label="이메일"
                id="email"
                registration={registerPw('email', {
                  required: '이메일을 입력해 주세요.',
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: '이메일 형식이 올바르지 않습니다.',
                  },
                })}
                error={errorsPw.email as FieldError}
                placeholder="이메일 입력"
              />
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={!isValidPw}
                className="mt-6"
              >
                비밀번호 찾기
              </Button>
            </form>
          )}
        </div>
        <div>
          <Footer />
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="알림"
        message={modalMessage}
        buttonText="확인"
      />
    </div>
  );
}

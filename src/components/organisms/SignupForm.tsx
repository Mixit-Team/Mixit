'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSignup } from '../../hooks/useSignup';
import { checkDuplicate } from '../../services/auth/signup';
import { uploadImage } from '@/services/auth/image';
import { requestEmailVerification, verifyEmail } from '@/services/auth/email';
import { SignupError } from '@/types/auth';
import Link from 'next/link';

import Modal from '../atoms/Modal';
import Button from '../atoms/Button';
import InputField from '../molecules/InputField';
import CheckboxField from '../molecules/CheckboxField';

const NICKNAME_MIN_LENGTH = 2;
const NICKNAME_MAX_LENGTH = 10;
const LOGIN_ID_REGEX = /^[A-Za-z0-9]{8,12}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/;
const BIRTH_REGEX = /^\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const MAX_FILE_SIZE_MB = 10;

// Form Data Interface
interface SignupFormData {
  loginId: string;
  password: string;
  passwordConfirm: string;
  name: string;
  birth: string;
  email: string;
  nickname: string;
  imageId?: string | number;
  agreements: {
    all: boolean;
    service: boolean;
    privacy: boolean;
    marketing: {
      email: boolean;
      sms: boolean;
    };
  };
  terms: number[];
  notifyOn: boolean;
  pushOn: boolean;
}

// Validation
const validateFile = (file: File): string | boolean => {
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `파일 크기는 ${MAX_FILE_SIZE_MB}MB를 초과할 수 없습니다.`;
  }
  return true;
};

const SignupForm = () => {
  const router = useRouter();
  const { mutate: signup, isPending } = useSignup();
  // --- States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    message: string;
    isSuccess?: boolean;
  }>({ title: '', message: '', isSuccess: false });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isCheckingloginId, setIsCheckingloginId] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showVerificationCode, setShowVerificationCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  // react hook form setup
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignupFormData>({
    mode: 'onBlur',
    defaultValues: {
      loginId: '',
      password: '',
      passwordConfirm: '',
      name: '',
      birth: '',
      email: '',
      nickname: '',
      imageId: undefined,
      agreements: {
        all: false,
        service: false,
        privacy: false,
        marketing: {
          email: false,
          sms: false,
        },
      },
      terms: [],
      notifyOn: false,
      pushOn: false,
    },
  });

  // --- Watched values ---
  const watchedloginId = watch('loginId');
  const watchedNickname = watch('nickname');
  const watchedAgreeAll = watch('agreements.all');
  const watchedAgreeService = watch('agreements.service');
  const watchedAgreePrivacy = watch('agreements.privacy');

  // Image Preview & Validation Effect
  useEffect(() => {
    let objectUrl: string | null = null;
    setImageError(null);
    clearErrors('imageId');

    if (selectedFile) {
      const validationResult = validateFile(selectedFile);

      if (typeof validationResult === 'string') {
        setImageError(validationResult);
        setImagePreview(null);
        setError('imageId', { type: 'manual', message: validationResult });
      } else {
        try {
          objectUrl = URL.createObjectURL(selectedFile);
          setImagePreview(objectUrl);

          // 이미지 업로드 API 호출
          uploadImage(selectedFile)
            .then(response => {
              console.log('Upload response:', response);
              const imageId = response.data.id;
              setValue('imageId', imageId, { shouldValidate: true });
            })
            .catch(error => {
              console.error('Error uploading image:', error);
              setImageError(error.message || '이미지 업로드에 실패했습니다.');
              setError('imageId', { type: 'manual', message: error.message });
            });
        } catch (error) {
          console.error('Error creating object URL:', error);
          setImageError('이미지 미리보기를 생성할 수 없습니다.');
          setImagePreview(null);
          setError('imageId', { type: 'manual', message: '이미지 미리보기 생성 오류' });
        }
      }
    } else {
      setImagePreview(null);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [selectedFile, setError, clearErrors, setValue]);

  // Agreement Synchronization Effect
  useEffect(() => {
    const allRequiredChecked = watchedAgreeService && watchedAgreePrivacy;
    if (watchedAgreeAll !== allRequiredChecked) {
      setValue('agreements.all', allRequiredChecked, { shouldValidate: false, shouldDirty: false });
    }

    // Update terms array based on service and privacy agreements
    const terms: number[] = [];
    if (watchedAgreeService) terms.push(1);
    if (watchedAgreePrivacy) terms.push(2);
    setValue('terms', terms, { shouldValidate: true });

    // Update notification settings based on marketing agreements
    const notifyOn = getValues('agreements.marketing.email');
    const pushOn = getValues('agreements.marketing.sms');
    setValue('notifyOn', notifyOn, { shouldValidate: true });
    setValue('pushOn', pushOn, { shouldValidate: true });
  }, [watchedAgreeService, watchedAgreePrivacy, watchedAgreeAll, setValue, getValues]);

  // --- Handlers ---

  const showModal = useCallback((title: string, message: string) => {
    setModalContent({ title, message });
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  // New handler for signup success confirmation
  const handleSignupSuccessConfirm = useCallback(() => {
    setIsModalOpen(false);
    router.push('/login');
  }, [router]);

  const handleCheckDuplicate = useCallback(
    async (fieldType: 'loginId' | 'nickname') => {
      const value = getValues(fieldType);
      const setIsLoading = fieldType === 'loginId' ? setIsCheckingloginId : setIsCheckingNickname;
      const fieldLabel = fieldType === 'loginId' ? '아이디' : '닉네임';

      setIsLoading(true);
      clearErrors(fieldType);

      try {
        const isDuplicate = await checkDuplicate(fieldType, value);
        if (isDuplicate) {
          const message = `사용중인 ${fieldLabel} 입니다. 다른 ${fieldLabel}를 입력해 주세요.`;
          showModal('알림', message);
          setError(fieldType, { type: 'duplicate', message: `이미 사용중인 ${fieldLabel}입니다.` });
        } else {
          showModal('알림', `사용 가능한 ${fieldLabel} 입니다.`);
          // 중복/API 에러만 지우고, 길이/필수 에러는 유지
          if (errors[fieldType]?.type === 'duplicate' || errors[fieldType]?.type === 'apiError') {
            clearErrors(fieldType);
          }
        }
      } catch (error) {
        console.error(`${fieldType} 중복 확인 중 오류:`, error);
        const signupError = error as SignupError;
        const errorMessage =
          signupError.message || `${fieldLabel} 중복 확인 중 오류가 발생했습니다.`;
        showModal('오류', errorMessage);
        setError(fieldType, { type: 'apiError', message: errorMessage });
      } finally {
        setIsLoading(false);
      }
    },
    [getValues, setError, clearErrors, errors, showModal]
  );

  const handleAgreeAllChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      setValue('agreements.service', isChecked, { shouldValidate: true });
      setValue('agreements.privacy', isChecked, { shouldValidate: true });
      setValue('agreements.marketing.email', isChecked, { shouldValidate: false });
      setValue('agreements.marketing.sms', isChecked, { shouldValidate: false });
      setValue('agreements.all', isChecked, { shouldValidate: false });

      // Update terms and notification settings
      setValue('terms', isChecked ? [1, 2] : [], { shouldValidate: true });
      setValue('notifyOn', isChecked, { shouldValidate: true });
      setValue('pushOn', isChecked, { shouldValidate: true });
    },
    [setValue]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // password Toggle
  const togglePasswordVisibility = useCallback(() => setShowPassword(prev => !prev), []);
  const togglePasswordConfirmVisibility = useCallback(
    () => setShowPasswordConfirm(prev => !prev),
    []
  );

  const handleEmailVerificationRequest = useCallback(async () => {
    const email = getValues('email');
    setIsCheckingEmail(true);
    clearErrors('email');

    try {
      const isDuplicate = await checkDuplicate('email', email);
      if (isDuplicate) {
        showModal('알림', '사용중인 이메일 입니다. 다른 이메일을 입력해 주세요.');
        setError('email', { type: 'duplicate', message: '이미 사용중인 이메일입니다.' });
      } else {
        try {
          await requestEmailVerification(email);
          showModal('알림', '인증 코드가 이메일로 전송되었습니다.');
          setShowVerificationCode(true);
        } catch (error) {
          const signupError = error as SignupError;
          showModal('오류', signupError.message || '이메일 인증 요청 중 오류가 발생했습니다.');
        }
      }
    } catch (error) {
      const signupError = error as SignupError;
      showModal('오류', signupError.message || '이메일 중복 확인 중 오류가 발생했습니다.');
      setError('email', { type: 'apiError', message: signupError.message });
    } finally {
      setIsCheckingEmail(false);
    }
  }, [getValues, setError, clearErrors, showModal]);

  const handleEmailVerification = useCallback(async () => {
    const email = getValues('email');
    setIsVerifyingEmail(true);

    try {
      await verifyEmail(email, verificationCode);
      showModal('알림', '이메일 인증이 완료되었습니다.');
      setIsEmailVerified(true);
      setShowVerificationCode(false);
    } catch (error) {
      const signupError = error as SignupError;
      showModal('오류', signupError.message || '이메일 인증 중 오류가 발생했습니다.');
    } finally {
      setIsVerifyingEmail(false);
    }
  }, [getValues, verificationCode, showModal]);

  // Form Submit
  const onSubmit = useCallback(
    (data: SignupFormData) => {
      signup(data, {
        onSuccess: () => {
          setModalContent({
            title: '알림',
            message: '회원가입에 성공했습니다.\n가입한 정보로 로그인 해주세요.',
            isSuccess: true,
          });
          setIsModalOpen(true);
        },
        onError: error => {
          setModalContent({
            title: '오류',
            message: error.message,
            isSuccess: false,
          });
          setIsModalOpen(true);
        },
      });
    },
    [signup]
  );

  // --- Derived State for Disabling Buttons ---
  const isloginIdCheckDisabled = isCheckingloginId || !watchedloginId || !!errors.loginId;
  const isNicknameCheckDisabled =
    isCheckingNickname ||
    !watchedNickname ||
    watchedNickname.length < NICKNAME_MIN_LENGTH ||
    !!errors.nickname;
  const isSubmitDisabled =
    isSubmitting || !isValid || !watchedAgreeService || !watchedAgreePrivacy || !isEmailVerified;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-5">
        {/* --- Form Fields using InputField --- */}
        <InputField
          label="아이디"
          id="loginId"
          placeholder="아이디를 입력해주세요"
          registration={register('loginId', {
            required: '아이디를 입력해주세요',
            pattern: {
              value: LOGIN_ID_REGEX,
              message: '영문/숫자 조합 8-12자로 입력해주세요',
            },
          })}
          error={errors.loginId}
          button={
            <Button
              type="button"
              onClick={() => handleCheckDuplicate('loginId')}
              disabled={isloginIdCheckDisabled}
              isLoading={isCheckingloginId}
              variant="primary"
              className="whitespace-nowrap"
            >
              중복확인
            </Button>
          }
        />

        <InputField
          label="비밀번호"
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="영문/숫자 조합 8-12자"
          registration={register('password', {
            required: '비밀번호를 입력해주세요',
            pattern: { value: PASSWORD_REGEX, message: '영문/숫자 조합 8-12자로 입력해주세요' },
          })}
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

        <InputField
          label="비밀번호 확인"
          id="passwordConfirm"
          type={showPasswordConfirm ? 'text' : 'password'}
          placeholder="비밀번호 확인"
          registration={register('passwordConfirm', {
            required: '비밀번호를 다시 입력해주세요',
            validate: value => value === watch('password') || '비밀번호가 일치하지 않습니다',
          })}
          error={errors.passwordConfirm}
          icon={
            <button
              type="button"
              onClick={togglePasswordConfirmVisibility}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPasswordConfirm ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        <InputField
          label="이름"
          id="name"
          placeholder="이름을 입력해 주세요"
          registration={register('name', { required: '이름을 입력해주세요' })}
          error={errors.name}
        />

        <InputField
          label="생년월일"
          id="birth"
          placeholder="생년월일 6자리 (940101)"
          registration={register('birth', {
            required: '생년월일을 입력해주세요',
            pattern: { value: BIRTH_REGEX, message: '생년월일 6자리를 입력해주세요' },
          })}
          error={errors.birth}
        />

        <InputField
          label="이메일"
          id="email"
          type="email"
          placeholder="이메일 입력"
          registration={register('email', {
            required: '이메일을 입력해주세요',
            pattern: { value: EMAIL_REGEX, message: '올바른 이메일 형식이 아닙니다' },
          })}
          error={errors.email}
          button={
            <Button
              type="button"
              onClick={handleEmailVerificationRequest}
              disabled={isCheckingEmail || !watch('email') || !!errors.email || isEmailVerified}
              isLoading={isCheckingEmail}
              variant="primary"
              className="whitespace-nowrap"
            >
              {isEmailVerified ? '인증완료' : '인증요청'}
            </Button>
          }
        />

        {showVerificationCode && (
          <div className="flex space-x-2">
            <InputField
              label="인증코드"
              id="verificationCode"
              type="text"
              placeholder="인증코드 입력"
              value={verificationCode}
              onChange={e => setVerificationCode(e.target.value)}
              error={undefined}
            />
            <Button
              type="button"
              onClick={handleEmailVerification}
              disabled={isVerifyingEmail || !verificationCode}
              isLoading={isVerifyingEmail}
              variant="primary"
              className="mt-6 whitespace-nowrap"
            >
              인증하기
            </Button>
          </div>
        )}

        <InputField
          label="닉네임"
          id="nickname"
          placeholder="닉네임"
          registration={register('nickname', {
            required: '닉네임을 입력해주세요',
            minLength: {
              value: NICKNAME_MIN_LENGTH,
              message: `최소 ${NICKNAME_MIN_LENGTH}자 이상 입력해주세요`,
            },
            maxLength: {
              value: NICKNAME_MAX_LENGTH,
              message: `최대 ${NICKNAME_MAX_LENGTH}자 이하로 입력해주세요`,
            },
          })}
          error={errors.nickname}
          button={
            <Button
              type="button"
              onClick={() => handleCheckDuplicate('nickname')}
              disabled={isNicknameCheckDisabled}
              isLoading={isCheckingNickname}
              variant="primary"
              className="whitespace-nowrap"
            >
              중복확인
            </Button>
          }
        />

        {/* --- Profile Image Upload --- */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">프로필 사진 (선택)</label>
          <div className="mt-1">
            <div className="relative inline-block">
              <div
                onClick={() => document.getElementById('imageId')?.click()}
                className={`relative h-24 w-24 cursor-pointer overflow-hidden rounded-md bg-gray-100 transition-all hover:bg-gray-200 ${
                  imageError || errors.imageId ? 'border border-red-500' : ''
                }`}
              >
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Profile Preview"
                    fill
                    sizes="96px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setImagePreview(null);
                    setValue('imageId', undefined);
                    setImageError(null);
                    clearErrors('imageId');
                  }}
                  className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 focus:outline-none"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="imageId"
              onChange={handleFileChange}
            />
          </div>
          {(errors.imageId || imageError) && (
            <p className="mt-1 text-sm text-red-600">{errors.imageId?.message || imageError}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            * 사진 용량 {MAX_FILE_SIZE_MB}MB 이하 (jpg, png, gif, webp)
          </p>
        </div>

        <div className="space-y-3 border-t border-gray-200 pt-6">
          <CheckboxField
            label="모든 약관에 동의합니다."
            id="agreement-all"
            checked={watchedAgreeAll}
            onChange={handleAgreeAllChange}
            labelClassName="ml-2 text-sm font-medium text-gray-900"
          />
          <div className="space-y-2 pl-6">
            <CheckboxField
              label={
                <Link
                  href="/terms/service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer hover:underline"
                >
                  서비스 이용 약관 동의 (필수)
                </Link>
              }
              id="agreement-service"
              registration={register('agreements.service', { required: true })}
              error={errors.agreements?.service}
              checked={watchedAgreeService}
            />
            <CheckboxField
              label={
                <Link
                  href="/terms/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer hover:underline"
                >
                  개인정보수집 및 이용동의 (필수)
                </Link>
              }
              id="agreement-privacy"
              registration={register('agreements.privacy', { required: true })}
              error={errors.agreements?.privacy}
              checked={watchedAgreePrivacy}
            />
            <div className="pt-2">
              <label className="text-sm font-medium text-gray-700">
                이벤트 및 정보 수신 (선택)
              </label>
              <div className="mt-2 flex space-x-6 pl-0">
                <CheckboxField
                  label="이메일"
                  id="agreement-marketing-email"
                  registration={register('agreements.marketing.email')}
                />
                <CheckboxField
                  label="SMS"
                  id="agreement-marketing-sms"
                  registration={register('agreements.marketing.sms')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Display Root/Server Errors */}
        {errors.root?.serverError && (
          <p className="mt-1 text-center text-sm text-red-600">{errors.root.serverError.message}</p>
        )}

        {/* --- Submit Button --- */}
        <Button
          type="submit"
          disabled={isSubmitDisabled || isPending}
          isLoading={isPending}
          className="mt-6 w-full"
          variant="primary"
        >
          회원가입
        </Button>
      </form>

      {/* --- Modal --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={modalContent.isSuccess ? handleSignupSuccessConfirm : closeModal}
        title={modalContent.title}
        message={<div className="whitespace-pre-line">{modalContent.message}</div>}
        buttonText={modalContent.isSuccess ? '로그인하기' : '확인'}
      />
    </>
  );
};

export default SignupForm;

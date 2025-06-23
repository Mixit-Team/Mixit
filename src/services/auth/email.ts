import { apiClient } from '@/utils/apiClient';
import { AxiosError } from 'axios';

// interface EmailVerificationRequest {
//   email: string;
// }

interface EmailVerificationResponse {
  status: {
    code: string;
    message: string;
  };
  data: null;
}

interface EmailVerificationError {
  status: number;
  message: string;
}

export const requestEmailVerification = async (
  email: string
): Promise<EmailVerificationResponse> => {
  try {
    const response = await apiClient.post<EmailVerificationResponse>(
      '/accounts/email/verify-request',
      { email }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ status: number; message: string }>;
    if (axiosError.response) {
      throw {
        status: axiosError.response.status,
        message:
          axiosError.response.data.message ||
          '이메일 인증 요청청이 실패했습니다. 다시 확인해주세요.',
      } as EmailVerificationError;
    }
    throw {
      status: 500,
      message: '이메일 인증요청이 실패했습니다. 다시 확인해주세요.',
    } as EmailVerificationError;
  }
};

export const verifyEmail = async (
  email: string,
  code: string
): Promise<EmailVerificationResponse> => {
  try {
    const response = await apiClient.post<EmailVerificationResponse>('/accounts/email/verify', {
      email,
      code,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ status: number; message: string }>;
    if (axiosError.response) {
      throw {
        status: axiosError.response.status,
        message:
          axiosError.response.data.message || '이메일 인증이 실패했습니다. 다시 확인해주세요.',
      } as EmailVerificationError;
    }
    throw {
      status: 500,
      message: '이메일 인증이 실패했습니다. 다시 확인해주세요.',
    } as EmailVerificationError;
  }
};

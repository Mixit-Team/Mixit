import { apiClient } from '@/utils/apiClient';
import { AxiosError } from 'axios';

interface VerifyResponse {
  status: {
    code: string;
    message: string;
  };
  data: null;
}

interface VerifyError {
  status: number;
  message: string;
}

export const verifyUser = async (password: string): Promise<VerifyResponse> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw {
        status: 401,
        message: '로그인이 필요합니다.',
      } as VerifyError;
    }

    const response = await apiClient.post<VerifyResponse>(
      '/users/my-page',
      { password },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ status: number; message: string }>;
    if (axiosError.response) {
      throw {
        status: axiosError.response.status,
        message: axiosError.response.data.message || '인증에 실패했습니다.',
      } as VerifyError;
    }
    throw {
      status: 500,
      message: '네트워크 오류가 발생했습니다.',
    } as VerifyError;
  }
};

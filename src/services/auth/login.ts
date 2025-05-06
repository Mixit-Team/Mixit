import { LoginRequest, LoginResponse, LoginError } from '@/types/auth';
import { apiClient } from '@/utils/apiClient';
import { AxiosError } from 'axios';

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/login', credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 토큰을 localStorage에 저장
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('tokenExpiresIn', String(Date.now() + response.data.data.expiresIn));
    }

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ status: number; message: string; field?: string }>;
    if (axiosError.response) {
      throw {
        status: axiosError.response.status,
        message: axiosError.response.data.message || '알 수 없는 오류가 발생했습니다.',
        field: axiosError.response.data.field,
      } as LoginError;
    }
    throw {
      status: 500,
      message: '네트워크 오류가 발생했습니다.',
    } as LoginError;
  }
};

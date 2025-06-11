import { apiClient } from '@/utils/apiClient';
import { AxiosError } from 'axios';

export interface ProfileUpdateRequest {
  nickname: string;
  imageId: number | string | null;
  notification: boolean;
  alarm: boolean;
}

export interface ProfileUpdateResponse {
  status: number;
  message: string;
  data: {
    nickname: string;
    imageId: number | string | null;
    notification: boolean;
    alarm: boolean;
  };
}

export interface ProfileUpdateError {
  status: number;
  message: string;
  field?: string;
}

export const updateProfile = async (data: ProfileUpdateRequest): Promise<ProfileUpdateResponse> => {
  try {
    const response = await apiClient.put<ProfileUpdateResponse>('/users/my-page', data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ status: number; message: string; field?: string }>;
    if (axiosError.response) {
      throw {
        status: axiosError.response.status,
        message: axiosError.response.data.message || '알 수 없는 오류가 발생했습니다.',
        field: axiosError.response.data.field,
      } as ProfileUpdateError;
    }
    throw {
      status: 500,
      message: '네트워크 오류가 발생했습니다.',
    } as ProfileUpdateError;
  }
};

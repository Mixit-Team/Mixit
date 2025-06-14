import axios from 'axios';
import { getSession } from 'next-auth/react';

const BASE_URL = `${process.env.NEXTAUTH_URL}/api/v1` || 'http://54.180.33.96:8080/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  async config => {
    const session = await getSession();
    const accessToken = session?.accessToken;
    console.log('accessToken', accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      // API 에러 응답 처리
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

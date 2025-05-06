import { LoginResponse } from '@/types/auth';
import { useUserStore } from '@/store/userStore';

export const useAuth = () => {
  const { setUserProfile } = useUserStore();

  const handleLoginSuccess = (response: LoginResponse) => {
    const { token, expiresIn, loginId, name, birth, email, nickname } = response.data;

    // 토큰 저장
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpiresIn', String(Date.now() + expiresIn));

    // 프로필 정보 저장
    setUserProfile({
      id: 0, // API에서 제공하지 않는 경우 임시값
      loginId,
      name,
      birth,
      email,
      nickname,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiresIn');
  };

  return {
    handleLoginSuccess,
    logout,
  };
};

import { LoginResponse } from '@/types/auth';
import { useUserStore } from '@/store/userStore';

export const useAuth = () => {
  const { setUserProfile } = useUserStore();

  const handleLoginSuccess = (response: { data: LoginResponse }) => {
    const { token, expiresIn, loginId, name, birth, email, nickname, imageSrc } = response.data;

    // 토큰 저장
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpiresIn', String(Date.now() + expiresIn));

    // 프로필 정보 저장
    setUserProfile({
      id: 0, // 임시 ID 값
      birth,
      email,
      imageSrc,
      loginId,
      name,
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

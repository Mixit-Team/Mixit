import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
  id: number;
  loginId: string;
  name: string;
  nickname: string;
  email: string;
  birth: string;
  imageId?: string | number;
  imageSrc?: string;
}

interface UserStore {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  clearUserProfile: () => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    set => ({
      userProfile: null,
      setUserProfile: profile => set({ userProfile: profile }),
      clearUserProfile: () => set({ userProfile: null }),
      logout: () => {
        set({ userProfile: null });
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiresIn');
      },
    }),
    {
      name: 'user-storage',
    }
  )
);

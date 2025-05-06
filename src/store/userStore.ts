import { create } from 'zustand';

interface UserProfile {
  id: number;
  loginId: string;
  name: string;
  nickname: string;
  email: string;
  birth: string;
  imageId?: string | number;
}

interface UserStore {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  clearUserProfile: () => void;
}

export const useUserStore = create<UserStore>(set => ({
  userProfile: null,
  setUserProfile: profile => set({ userProfile: profile }),
  clearUserProfile: () => set({ userProfile: null }),
}));

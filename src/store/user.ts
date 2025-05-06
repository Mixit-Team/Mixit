import { create } from 'zustand';

interface UserProfile {
  loginId: string;
  name: string;
  birth: string;
  email: string;
  nickname: string;
}

interface UserStore {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  clearUserProfile: () => void;
}

export const useUserStore = create<UserStore>(set => ({
  userProfile: null,
  setUserProfile: profile => set({ userProfile: profile }),
  clearUserProfile: () => set({ userProfile: null }),
}));

// Recoil의 useUserProfile과 동일한 인터페이스를 제공하는 훅
export const useUserProfile = () => {
  const { userProfile } = useUserStore();
  return userProfile;
};

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import UserInfoSection from '../molecules/UserInfoSection';
import ActionLinks from '../molecules/ActionLinks';
import Button from '../atoms/Button';

interface UserProfile {
  nickname: string;
}

// Placeholder function to simulate fetching user data
const fetchUserProfile = async (): Promise<UserProfile> => {
  console.log('Simulating fetch user profile...');
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  // Simulate success/failure
  if (Math.random() > 0.2) {
    return { nickname: '믹스잇테스터' };
  } else {
    throw new Error('Failed to fetch user profile.'); // Simulate error
  }
};

const MyPageContent: React.FC = () => {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const profile = await fetchUserProfile();
        setUserProfile(profile);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleLogout = useCallback(() => {
    console.log('Logout');
    router.push('/login');
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center p-4">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center p-4 text-center">
        <p className="mb-2 text-red-600">Error loading profile:</p>
        <p className="mb-4 text-sm text-gray-700">{error}</p>
        <Button onClick={() => window.location.reload()} variant="secondary" size="sm">
          Retry
        </Button>
      </div>
    );
  }

  // Success State
  return (
    <div className="flex flex-col space-y-6 p-4">
      <UserInfoSection nickname={userProfile?.nickname || 'Guest'} />
      <ActionLinks />
      <Button
        onClick={handleLogout}
        variant="outline"
        fullWidth
        className="rounded-lg border-black"
      >
        로그아웃
      </Button>
    </div>
  );
};

export default MyPageContent;

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import ProfileMainLayout from '@/components/templates/ProfileMainLayout';
import ProfileAuthForm from '@/components/molecules/ProfileAuthForm';
import ProfileInfoForm from '@/components/molecules/ProfileInfoForm';
import Modal from '@/components/atoms/Modal';

interface ProfileData {
  userId: string;
  name: string;
  birthdate: string;
  email: string;
  nickname: string;
  password?: string;
  passwordConfirm?: string;
}

const MOCK_USER: ProfileData = {
  userId: 'Mixit12',
  name: '김믹스',
  birthdate: '940101',
  email: 'mixit@example.com',
  nickname: '믹스잇',
};

const ProfilePage: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(MOCK_USER);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));

        setUserData(MOCK_USER);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleAuthentication = useCallback(() => {
    setAuthenticated(true);
  }, []);

  const handleSaveProfile = useCallback((data: ProfileData) => {
    console.log('Saving profile data:', data);

    setModalContent({
      title: '알림',
      message: '회원정보가 성공적으로 업데이트되었습니다.',
    });
    setIsModalOpen(true);

    setUserData(prev => ({
      ...prev,
      ...data,
    }));
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  if (isLoading) {
    return (
      <ProfileMainLayout title="회원정보" showBackButton>
        <div className="flex h-60 items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </ProfileMainLayout>
    );
  }

  return (
    <ProfileMainLayout title="회원정보 인증" showBackButton>
      <div className="p-4">
        {!authenticated ? (
          <ProfileAuthForm onAuthenticated={handleAuthentication} userId={userData.userId} />
        ) : (
          <ProfileInfoForm initialData={userData} onSave={handleSaveProfile} />
        )}

        {/* Success Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={modalContent.title}
          message={modalContent.message}
          buttonText="확인"
        />
      </div>
    </ProfileMainLayout>
  );
};

export default ProfilePage;

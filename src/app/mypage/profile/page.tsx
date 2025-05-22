'use client';

import React, { useState, useCallback } from 'react';
import ProfileInfoForm from '@/components/molecules/ProfileInfoForm';
import ProfileAuthForm from '@/components/molecules/ProfileAuthForm';
import Modal from '@/components/atoms/Modal';
import ProfileMainLayout from '@/components/templates/ProfileMainLayout';
import { useSession } from 'next-auth/react';

interface ProfileFormData {
  userId: string;
  name: string;
  birthdate: string;
  email: string;
  nickname: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { id, name, birth, email, image, nickname } = session?.user || {};
  const [authenticated, setAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
  });

  const handleAuthentication = useCallback(() => {
    setAuthenticated(true);
  }, []);

  const handleSaveProfile = useCallback((data: ProfileFormData) => {
    console.log('Saving profile data:', data);

    setModalContent({
      title: '알림',
      message: '회원정보가 성공적으로 업데이트되었습니다.',
    });
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  if (status !== 'authenticated') {
    return (
      <ProfileMainLayout title="회원정보" showBackButton>
        <div className="flex h-60 items-center justify-center">
          <p className="text-gray-500">로그인이 필요합니다.</p>
        </div>
      </ProfileMainLayout>
    );
  }

  return (
    <ProfileMainLayout title="회원정보 인증" showBackButton>
      <div className="p-4">
        {!authenticated ? (
          <ProfileAuthForm onAuthenticated={handleAuthentication} userId={id} />
        ) : (
          <ProfileInfoForm
            initialData={{
              userId: id,
              name: name ?? undefined,
              birthdate: birth,
              email: email ?? undefined,
              nickname,
              imageSrc: image ?? undefined,
            }}
            onSave={handleSaveProfile}
          />
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
}

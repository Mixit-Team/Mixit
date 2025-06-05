'use client';

import React from 'react';
import ProfileMainLayout from '@/components/templates/ProfileMainLayout';
import MyPageContent from '@/components/organisms/MyPageContent';
import { withAuth } from '@/components/withAuth';

const MyPage: React.FC = () => {
  return (
    <ProfileMainLayout title="마이페이지">
      <MyPageContent />
    </ProfileMainLayout>
  );
};

export default withAuth(MyPage);

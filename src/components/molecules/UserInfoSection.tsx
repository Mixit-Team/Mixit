'use client';

import React from 'react';

interface UserInfoSectionProps {
  nickname: string;
}

const UserInfoSection: React.FC<UserInfoSectionProps> = React.memo(({ nickname }) => {
  return (
    <div className="py-4">
      <p className="text-lg font-semibold text-gray-800">{nickname}님, 안녕하세요!</p>
    </div>
  );
});

UserInfoSection.displayName = 'UserInfoSection';

export default UserInfoSection;

'use client';

import React from 'react';
import BackButton from '../atoms/BackButton';
import NavBar from '../organisms/NavBar';

interface ProfileMainLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
}

const ProfileMainLayout: React.FC<ProfileMainLayoutProps> = ({
  children,
  title,
  showBackButton = false,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-100">
      <div className="relative mx-auto flex h-full w-full max-w-sm flex-col bg-white shadow-lg md:max-w-md lg:max-w-lg">
        {title && (
          <header className="sticky top-0 z-10 flex h-12 flex-shrink-0 items-center justify-center border-b border-gray-200 bg-white px-4">
            {showBackButton && (
              <div className="absolute top-0 bottom-0 left-2 flex items-center">
                <BackButton />
              </div>
            )}
            <h1 className="text-lg font-medium text-gray-800">{title}</h1>
          </header>
        )}
        <main className="flex-grow overflow-y-auto">{children}</main>
        <div className="flex-shrink-0">
          <NavBar />
        </div>
      </div>
    </div>
  );
};

export default ProfileMainLayout;

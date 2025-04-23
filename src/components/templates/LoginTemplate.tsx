'use client';

import React from 'react';
import LoginForm from '../organisms/LoginForm';
import BackButton from '../atoms/BackButton';

const LoginTemplate: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-100">
      <div className="flex h-full w-full flex-col">
        <div className="flex-1" />
        <div className="relative mx-auto w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <div className="absolute top-6 left-4">
            <BackButton />
          </div>
          <LoginForm />
        </div>
        <div className="flex-1" />
      </div>
    </div>
  );
};

export default LoginTemplate;

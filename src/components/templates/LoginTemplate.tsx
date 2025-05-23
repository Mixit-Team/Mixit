'use client';

import React from 'react';
import LoginForm from '../organisms/LoginForm';
import BackButton from '../atoms/BackButton';

const LoginTemplate: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <div className="flex flex-1 items-center justify-center">
        <div className="relative mx-4 w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <div className="absolute top-6 left-4">
            <BackButton />
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginTemplate;

import React from 'react';
import SignupForm from '../organisms/SignupForm';
import BackButton from '../atoms/BackButton';
import Footer from '../molecules/Footer';

const SignupTemplate: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100">
      <div className="relative mx-auto w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="absolute top-6 left-4">
          <BackButton />
        </div>
        <h1 className="mb-8 text-center text-xl font-bold">회원가입</h1>
        <SignupForm />
      </div>
      <Footer />
    </div>
  );
};

export default SignupTemplate;

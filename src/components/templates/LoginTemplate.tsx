import React from 'react';
import LoginForm from '../organisms/LoginForm';

// 임시 layout 추가
const LoginTemplate: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-gray-100 p-4 text-center">
        <h1 className="text-xl font-semibold">Mixit</h1>
      </header>
      <main className="flex flex-grow flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg rounded bg-white p-6 shadow">
          <LoginForm />
        </div>
      </main>
      <footer className="bg-gray-100 p-4 text-center">
        <small>&copy; {new Date().getFullYear()} All rights reserved.</small>
      </footer>
    </div>
  );
};

export default LoginTemplate;

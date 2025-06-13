'use client';

import React from 'react';
import LoginForm from '../organisms/LoginForm';

// const LoginTemplate: React.FC = () => {
//   return (
//     <div className="relative mx-auto flex min-h-screen w-full max-w-[767px] flex-col bg-white">
//       <div className="flex-1 overflow-auto">
//         <div className="relative box-border w-full rounded-lg bg-white p-5">
//           <LoginForm />
//         </div>
//       </div>
//     </div>
//   );
// };
const LoginTemplate: React.FC = () => {
  return (
    <div className="mx-auto flex min-h-screen max-w-[767px] min-w-[767px] flex-col bg-gray-100">
      <div className="flex flex-1 items-center justify-center">
        <div className="relative mx-auto flex h-screen w-full max-w-[767px] flex-col bg-white">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginTemplate;

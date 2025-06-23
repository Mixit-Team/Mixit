'use client';

import BackButton from '../../atoms/BackButton';
import Title from '../../atoms/Title';

const RegisterHeader = () => {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative flex w-full items-center justify-center bg-white px-0 py-8 shadow-[0_4px_3px_-3px_rgba(0,0,0,0.1)]">
        <BackButton className="absolute top-1/2 left-2.5 -translate-y-1/2 transform cursor-pointer" />
        <Title label="조합 등록하기" />
      </div>
    </div>
  );
};

export default RegisterHeader;

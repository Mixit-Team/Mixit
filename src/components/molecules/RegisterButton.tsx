'use client';

import { useRouter } from 'next/navigation';
import Button from '../atoms/Button';

export default function RegisterButton() {
  const router = useRouter();

  return (
    <div
      className="
        fixed
        bottom-[90px]
        left-1/2
        transform -translate-x-1/2
        z-20

        w-full
        max-w-[767px]
        px-4

        flex justify-end
      "
    >
      <Button
        onClick={() => router.push('/register')}
        variant="primary"
        size="lg"
        className="
          inline-flex rounded-xl px-4 py-2
          w-[140px] text-2xl font-bold text-white
        background-gradient-to-r from-[#FF6B6B] to-[#FFB6B6] 
         hover:scale-[1.02] transform
          transition-transform duration-200 ease-out
        "
      >
        + 조합 등록
      </Button>
    </div>
  );
}


          // background-gradient-to-r from-[#FF6B6B] to-[#FFB6B6]

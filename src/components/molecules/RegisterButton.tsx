'use client';
import { useRouter } from 'next/navigation';
import Button from '../atoms/Button';

const RegisterButton = () => {
  const router = useRouter();

  return (
          <div className="absolute bottom-[70px] right-8">

      <Button
        onClick={() => router.push('/register')}
        variant="primary"
        size="lg"
        className="
          float-right
          background-gradient-to-r from-[#FF6B6B] to-[#FFB6B6]
          hover:scale-[1.02]
          transform transition-transform duration-200 ease-out
          cursor-pointer inline-flex rounded-xl px-4 w-[140px] text-2xl font-bold text-white
        "
      >
        + 조합 등록
      </Button>
    </div>

  );
};

export default RegisterButton;

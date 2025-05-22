'use client';
import { useRouter } from 'next/navigation';
import Button from '../atoms/Button';

const RegisterButton = () => {
  const router = useRouter();

  return (
    <div className="flex justify-end px-4 py-2">
      <Button
        className="cursor-pointer rounded-xl px-4 py-2 text-2xl font-bold text-white"
        onClick={() => router.push('/register')}
        variant="primary"
        size="lg"
      >
        + 조합 등록
      </Button>
    </div>
  );
};

export default RegisterButton;

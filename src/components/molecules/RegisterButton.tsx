'use client';
import Button from '../atoms/Button';
import { useRoute } from '@/hooks/useRoute';

const RegisterButton = () => {
  const { routerPush } = useRoute();

  return (
    <div className="flex justify-end px-4 py-2">
      <Button
        className="rounded px-4 py-2 font-bold text-white"
        onClick={() => routerPush('/register')}
        variant="primary"
        size="lg"
      >
        + 조합 등록
      </Button>
    </div>
  );
};

export default RegisterButton;

'use client';
import Notification from '@/components/atoms/Notification/Notification';

const HomeHeader = () => {
  return (
    <div className="flex items-center p-4">
      <div className="pt-1 text-4xl font-bold">
        <span className="text-black">mix</span>
        <span className="text-orange-500">i</span>
        <span className="text-pink-500">t</span>
      </div>
      <div className="ml-auto cursor-pointer">
        <Notification />
      </div>
    </div>
  );
};

export default HomeHeader;

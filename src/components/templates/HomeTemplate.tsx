'use client';

import React from 'react';
import HomeHeader from '../organisms/HomeHeader/HomeHeader';
import Banner from '../atoms/Banner/Banner';
import CategorySection from '../organisms/CategorySection';
import FavoriteSection from '../organisms/FavoriteSection';
import TodayRecomendationSection from '../organisms/TodayRecomendationSection';
import TagSection from '../organisms/TagSection';
import { SearchBar } from '../molecules/SearchBar/SearchBar';
import NavBar from '../organisms/NavBar';
import { useSession } from 'next-auth/react';
const HomeTemplate: React.FC = () => {
  const { data: session } = useSession();
  console.log('session', session);

  return (
    <div className="bg-[ #F4F4F5] min-h-screen">
      <div className="mx-auto flex h-screen w-full max-w-[767px] flex-col bg-white">
        <div className="flex-1 overflow-auto">
          <div className="relative w-full rounded-lg bg-white p-8">
            <HomeHeader />
            <SearchBar />
            <Banner imagePath="/images/banner.png" />
            <CategorySection />
            <FavoriteSection title="지금 인기있는 조합" />
            <TodayRecomendationSection title="오늘의 추천" />
            <TagSection />
          </div>
        </div>
        <NavBar />
      </div>
    </div>
  );
};

export default HomeTemplate;

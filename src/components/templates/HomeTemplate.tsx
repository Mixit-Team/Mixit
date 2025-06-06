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
import RegisterButton from '../molecules/RegisterButton';
import Footer from '../organisms/Footer';

const HomeTemplate: React.FC = () => {
  return (
    <div className="relative mx-auto flex h-screen w-full max-w-[767px] flex-col bg-white">
      <div className="flex-1 overflow-auto">
        <div className="relative box-border w-full rounded-lg bg-white p-5">
          <HomeHeader />
          <SearchBar />
        </div>
        <Banner imagePath="/images/banner.png" />
        <div className="relative box-border w-full rounded-lg bg-white p-5">
          <CategorySection />
          <FavoriteSection title="지금 인기있는 조합" />
          <TodayRecomendationSection title="오늘의 추천" />
          <TagSection />
        </div>
        <Footer />
      </div>
      <RegisterButton />
      <NavBar />
    </div>
  );
};

export default HomeTemplate;

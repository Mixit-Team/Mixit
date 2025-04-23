'use client';

import React from 'react';
import { Home, Search, Bookmark, User } from 'lucide-react';
import BottomNavItem from '../atoms/BottomNavItem';

const BottomNavigation: React.FC = () => {
  const navItems = [
    { id: 'explore', label: '탐색', icon: Search, href: '/explore' },
    { id: 'home', label: '홈', icon: Home, href: '/' },
    { id: 'scrap', label: '스크랩', icon: Bookmark, href: '/scrap' },
    { id: 'mypage', label: '마이페이지', icon: User, href: '/mypage' },
  ];

  return (
    <nav className="h-16 border-t border-gray-200">
      <div className="flex h-full items-center justify-around">
        {navItems.map(item => (
          <BottomNavItem key={item.id} href={item.href} label={item.label} icon={item.icon} />
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;

'use client';

import Link from 'next/link';
import { Home, Bookmark, User, AlignJustify } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { COLOR_ATOMIC_ORANGE_80 } from '@/config/color.config';

const navItems = [
  { href: '/category', Icon: AlignJustify, label: '카테고리' },
  { href: '/home', Icon: Home, label: '홈' },
  { href: '/bookmark', Icon: Bookmark, label: '북마크' },
  { href: '/mypage', Icon: User, label: '마이페이지' },
] as const;

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="relative mx-auto flex h-14 w-full items-center justify-around border-t bg-white p-8 shadow-md">
      {navItems.map(({ href, Icon, label }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center justify-center space-y-1"
          >
            <Icon
              className="h-6 w-6"
              style={{
                color: isActive ? COLOR_ATOMIC_ORANGE_80 : 'rgba(156,163,175,1)', // tailwind gray-400
              }}
            />
            <span
              style={{
                color: isActive ? COLOR_ATOMIC_ORANGE_80 : 'rgba(156,163,175,1)', // tailwind gray-400
              }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

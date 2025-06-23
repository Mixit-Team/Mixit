'use client';

import Link from 'next/link';
import { Home, Bookmark, User, AlignJustify } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { COLOR_ATOMIC_ORANGE_80 } from '@/config/color.config';

const navItems = [
  { href: '/category', Icon: AlignJustify, label: '카테고리' },
  { href: '/home',     Icon: Home,          label: '홈' },
  { href: '/bookmark', Icon: Bookmark,      label: '북마크' },
  { href: '/mypage',   Icon: User,          label: '마이페이지' },
] as const;

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav
      className="
        fixed bottom-0 left-1/2 transform -translate-x-1/2 z-10
        w-full max-w-[767px]
        flex items-center justify-around
        border-t bg-white
        px-2 py-1      /* 기본: 작게 */
        sm:px-4 sm:py-2 /* 640px 이상에서 원래 크기 */
        shadow-md
      "
    >
      {navItems.map(({ href, Icon, label }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center justify-center space-y-0.5 sm:space-y-1"
          >
            <Icon
              className="
                h-5 w-5       
                sm:h-6 sm:w-6 
              "
              style={{
                color: isActive
                  ? COLOR_ATOMIC_ORANGE_80
                  : 'rgba(156,163,175,1)',
              }}
            />
            <span
              className="
                text-[10px]   
                sm:text-xs    
              "
              style={{
                color: isActive
                  ? COLOR_ATOMIC_ORANGE_80
                  : 'rgba(156,163,175,1)',
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

'use client';

import Link from 'next/link';
import { Home, Bookmark, User, AlignJustify } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { COLOR_ATOMIC_ORANGE_80 } from '@/config/color.config';

const navItems = [
  { href: '/category', Icon: AlignJustify },
  { href: '/home', Icon: Home },
  { href: '/bookmark', Icon: Bookmark },
  { href: '/mypage', Icon: User },
] as const;

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="relative mx-auto flex h-14 w-full items-center justify-around border-t bg-white p-8 shadow-md">
      {navItems.map(({ href, Icon }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link key={href} href={href}>
            <Icon
              className="h-6 w-6"
              style={{
                color: isActive ? COLOR_ATOMIC_ORANGE_80 : 'rgba(156,163,175,1)', // tailwind gray-400
              }}
            />
          </Link>
        );
      })}
    </nav>
  );
}

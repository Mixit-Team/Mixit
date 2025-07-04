'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { animated, useSpring } from '@react-spring/web';
import { COLOR_SEMANTIC_PRIMARY_NORMAL } from '@/config/color.config';

const tabs = [
  { href: '/combinations/popular', label: '지금 인기 있는 조합' },
  { href: '/combinations/recommendation', label: '오늘의 추천' },
];

const TabNav = () => {
  const pathname = usePathname();
  const idx = tabs.findIndex(t => t.href === pathname);
  const underline = useSpring({ left: `${idx * 50}%` });

  return (
    <nav className="relative flex">
      {tabs.map(t => (
        <Link key={t.href} href={t.href} className="flex-1 py-2 text-center">
          <span className={pathname === t.href ? 'text-[#FD7A19]' : 'text-gray-500'}>
            {t.label}
          </span>
        </Link>
      ))}
      <animated.div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '50%',
          height: 2,
          background: COLOR_SEMANTIC_PRIMARY_NORMAL,
          ...underline,
        }}
      />
    </nav>
  );
};

export default TabNav;

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';

interface BottomNavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
}

const BottomNavItem: React.FC<BottomNavItemProps> = React.memo(({ href, label, icon: Icon }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center space-y-1 px-2 py-1 text-xs transition-colors duration-200 ${isActive ? 'text-orange-500' : 'text-gray-500 hover:text-gray-700'}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
      <span>{label}</span>
    </Link>
  );
});

BottomNavItem.displayName = 'BottomNavItem';

export default BottomNavItem;

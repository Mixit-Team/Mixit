import React from 'react';
export function TabButton({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  const base = 'px-4 py-2 rounded-full focus:outline-none';
  const style = active ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700';
  return (
    <button className={`${base} ${style}`} onClick={onClick}>
      {children}
    </button>
  );
}

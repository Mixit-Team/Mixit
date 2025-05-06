import React from 'react';

const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> =
  React.memo(({ children, className = '', onClick }) => (
    <div
      className={`cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md ${className}`}
      onClick={onClick}
      tabIndex={0}
      role="button"
    >
      {children}
    </div>
  ));
Card.displayName = 'Card';
export default Card;

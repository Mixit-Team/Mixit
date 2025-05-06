import React from 'react';

interface SortTabsProps {
  sort: 'latest' | 'popular';
  onChange: (sort: 'latest' | 'popular') => void;
}

const SortTabs: React.FC<SortTabsProps> = React.memo(({ sort, onChange }) => (
  <div className="mb-2 flex items-center justify-end gap-2 pr-2 text-sm text-gray-400 sm:pr-4 lg:pr-6">
    <button
      className={`transition-colors ${sort === 'latest' ? 'font-semibold text-black' : ''}`}
      onClick={() => onChange('latest')}
    >
      최신순
    </button>
    <span className="mx-1 text-gray-300">|</span>
    <button
      className={`mr-2 transition-colors sm:mr-4 lg:mr-6 ${sort === 'popular' ? 'font-semibold text-black' : ''}`}
      onClick={() => onChange('popular')}
    >
      인기순
    </button>
  </div>
));
SortTabs.displayName = 'SortTabs';

export default SortTabs;

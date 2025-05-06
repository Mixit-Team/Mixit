import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  // perPage는 UI로 노출하지 않고, 필요시 props로만 전달받아 사용 가능
}

const Pagination: React.FC<PaginationProps> = React.memo(
  ({ currentPage, totalPages, onPageChange }) => {
    // totalPages가 0 이하이거나 1 이하이면 페이지네이션을 렌더링하지 않음
    if (!totalPages || totalPages <= 1) return null;
    // currentPage가 범위를 벗어나면 1로 강제
    const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
    return (
      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:text-black disabled:opacity-40"
          disabled={safeCurrentPage === 1}
          onClick={() => onPageChange(safeCurrentPage - 1)}
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx + 1}
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
              safeCurrentPage === idx + 1
                ? 'border-black bg-black font-bold text-white'
                : 'border-gray-300 bg-white text-gray-500 hover:text-black'
            }`}
            onClick={() => onPageChange(idx + 1)}
            aria-current={safeCurrentPage === idx + 1 ? 'page' : undefined}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:text-black disabled:opacity-40"
          disabled={safeCurrentPage === totalPages}
          onClick={() => onPageChange(safeCurrentPage + 1)}
        >
          &gt;
        </button>
      </div>
    );
  }
);
Pagination.displayName = 'Pagination';

export default Pagination;

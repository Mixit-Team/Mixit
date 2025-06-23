import React, { Suspense } from 'react';
import SearchTemplate from "@/components/templates/SearchTemplate";

export default function SearchPage() {
  return (
    <Suspense fallback={<p>로딩 중...</p>}>
      <SearchTemplate />
    </Suspense>
  );
}

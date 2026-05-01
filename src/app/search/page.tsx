import { Suspense } from 'react';
import { SearchParams } from './search-client';

export const dynamic = 'force-dynamic';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
    </div>}>
      <SearchParams />
    </Suspense>
  );
}

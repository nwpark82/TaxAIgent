'use client';

import Link from 'next/link';
import { Icons } from '@/components/ui';

interface CategoryFilterProps {
  categories: string[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="px-4 py-2 bg-primary-600 text-white rounded-full text-sm font-medium">
        전체
      </span>
      {categories.map((category) => (
        <button
          key={category}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export function BlogEmptyState() {
  return (
    <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icons.Blog className="w-10 h-10 text-gray-400 dark:text-gray-500" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        아직 작성된 글이 없습니다
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        곧 유용한 세무 정보로 찾아뵙겠습니다.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
      >
        <Icons.ChevronLeft className="w-4 h-4" />
        대시보드로 돌아가기
      </Link>
    </div>
  );
}

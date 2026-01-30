'use client';

import Link from 'next/link';
import { Icons } from '@/components/ui';
import { BlogPost } from '@/lib/mdx';

interface PostHeaderProps {
  post: BlogPost;
}

export function PostHeader({ post }: PostHeaderProps) {
  return (
    <header>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full">
          {post.category}
        </span>
        <span className="text-gray-500 dark:text-gray-400 text-sm">{post.date}</span>
        <span className="text-gray-400 dark:text-gray-500">•</span>
        <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
          <Icons.Clock className="w-4 h-4" />
          {post.readingTime}분 읽기
        </span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {post.title}
      </h1>

      <p className="text-lg text-gray-600 dark:text-gray-400">
        {post.description}
      </p>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}

interface AuthorShareProps {
  author: string;
  title: string;
  description: string;
}

export function AuthorShare({ author, title, description }: AuthorShareProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">T</span>
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100">{author}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">TaxAIgent 세무 정보</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">공유하기</span>
        <button
          onClick={handleCopyLink}
          className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="링크 복사"
        >
          <Icons.Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <button
          onClick={handleShare}
          className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="공유"
        >
          <Icons.Share className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </div>
  );
}

export function BackLink() {
  return (
    <Link
      href="/blog"
      className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
    >
      <Icons.ChevronLeft className="w-4 h-4" />
      목록으로 돌아가기
    </Link>
  );
}

export function BlogCTA() {
  return (
    <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 text-center text-white">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">
        AI 세무 상담이 필요하신가요?
      </h2>
      <p className="text-white/80 mb-6">
        TaxAIgent에서 경비처리 가능 여부를 바로 확인하세요.
      </p>
      <Link
        href="/chat"
        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
      >
        AI 상담 시작하기
        <Icons.ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  );
}

import { getAllPosts, getAllCategories } from '@/lib/mdx';
import { BlogCard } from '@/components/blog';
import { BlogEmptyState, CategoryFilter } from './components';

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">세무 정보</h1>
        <p className="text-gray-600 dark:text-gray-400">
          1인 사업자와 프리랜서를 위한 실용적인 세무 정보를 제공합니다.
        </p>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <CategoryFilter categories={categories} />
      )}

      {/* Posts grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <BlogEmptyState />
      )}
    </div>
  );
}

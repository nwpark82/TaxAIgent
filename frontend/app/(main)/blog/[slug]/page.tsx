import { notFound } from 'next/navigation';
import { getPostBySlug, getRelatedPosts } from '@/lib/mdx';
import { BlogCard } from '@/components/blog';
import { PostHeader, AuthorShare, BackLink, BlogCTA } from './components';

// 간단한 마크다운 렌더링 함수
function renderMarkdown(content: string): string {
  let html = content;

  // 헤딩
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mt-10 mb-4">$1</h1>');

  // 볼드, 이탤릭
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // 링크
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 hover:text-primary-700 underline">$1</a>');

  // 리스트
  html = html.replace(/^\s*[-*]\s+(.+)$/gim, '<li class="ml-6 list-disc">$1</li>');
  html = html.replace(/(<li.*<\/li>\n?)+/g, '<ul class="my-4 space-y-2">$&</ul>');

  // 숫자 리스트
  html = html.replace(/^\s*\d+\.\s+(.+)$/gim, '<li class="ml-6 list-decimal">$1</li>');

  // 인용문
  html = html.replace(/^>\s+(.+)$/gim, '<blockquote class="border-l-4 border-primary-500 pl-4 my-4 italic text-gray-700">$1</blockquote>');

  // 코드 블록
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 rounded-xl p-4 my-4 overflow-x-auto"><code>$2</code></pre>');

  // 인라인 코드
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-primary-600 px-1.5 py-0.5 rounded text-sm">$1</code>');

  // 단락
  html = html.replace(/\n\n/g, '</p><p class="my-4 text-gray-700 leading-relaxed">');
  html = '<p class="my-4 text-gray-700 leading-relaxed">' + html + '</p>';

  // 빈 p 태그 제거
  html = html.replace(/<p[^>]*>\s*<\/p>/g, '');

  return html;
}

interface Props {
  params: { slug: string };
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(params.slug, 3);
  const htmlContent = renderMarkdown(post.content);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back link */}
      <BackLink />

      {/* Article Header */}
      <PostHeader post={post} />

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>

      {/* Author & Share */}
      <AuthorShare
        author={post.author}
        title={post.title}
        description={post.description}
      />

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">관련 글</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <BlogCard key={relatedPost.slug} post={relatedPost} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <BlogCTA />
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { Icons } from '@/components/ui';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: '대시보드', icon: Icons.Home, requiresAuth: true },
  { href: '/chat', label: 'AI 상담', icon: Icons.Chat, requiresAuth: true },
  { href: '/expenses', label: '지출 관리', icon: Icons.Expense, requiresAuth: true },
  { href: '/ledger', label: '간편장부', icon: Icons.Ledger, requiresAuth: true },
  { href: '/blog', label: '세무 정보', icon: Icons.Blog, requiresAuth: false },
  { href: '/settings', label: '설정', icon: Icons.Settings, requiresAuth: true },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, subscription, logout, fetchUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  // 블로그 페이지는 인증 없이 접근 가능
  const isBlogPage = pathname === '/blog' || pathname.startsWith('/blog/');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      if (!isBlogPage) {
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    } else if (!user) {
      fetchUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [router, user, fetchUser, isBlogPage]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // 로딩 중이고 블로그가 아닌 페이지
  if (isLoading && !isBlogPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-primary-50/30 to-accent-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
        <div className="flex flex-col items-center gap-3">
          <Icons.Loader className="w-8 h-8 text-primary-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 인증되지 않은 상태에서 블로그가 아닌 페이지 접근 시 (리다이렉트 대기)
  if (!isAuthenticated && !isBlogPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-primary-50/30 to-accent-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
        <div className="flex flex-col items-center gap-3">
          <Icons.Loader className="w-8 h-8 text-primary-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 표시할 네비게이션 아이템 (비인증 사용자는 블로그만)
  const visibleNavItems = isAuthenticated
    ? navItems
    : navItems.filter(item => !item.requiresAuth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-accent-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              TaxAIgent
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-700 rounded-full flex items-center justify-center">
                <span className="text-primary-700 dark:text-primary-200 font-semibold text-sm">
                  {user?.name?.[0] || user?.email?.[0] || '?'}
                </span>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-r border-gray-200/50 dark:border-gray-800/50">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200/50 dark:border-gray-800/50">
            <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft">
                <span className="text-white font-bold">T</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                TaxAIgent
              </span>
            </Link>
            <ThemeToggle />
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {visibleNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-soft'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200/50 dark:border-gray-800/50">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-soft">
                    <span className="text-white font-semibold">
                      {user?.name?.[0] || user?.email?.[0] || '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {user?.name || '사용자'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {subscription?.plan_name || '무료'} 플랜
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Icons.Logout className="w-4 h-4" />
                  로그아웃
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 px-3 py-2.5 rounded-xl border border-primary-200 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white px-3 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-colors"
                >
                  무료로 시작하기
                </Link>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:pl-64">
          <div className="px-4 py-6 lg:px-8 lg:py-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-800/50 z-40 safe-area-bottom">
        <div className="flex justify-around py-2 px-1">
          {visibleNavItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center py-2 px-2 rounded-xl transition-all duration-200 touch-target',
                  isActive
                    ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/50'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive && 'scale-110')} />
                <span className={cn('text-[10px] mt-1', isActive ? 'font-semibold' : 'font-medium')}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

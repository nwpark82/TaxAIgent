'use client';

import { useQuery } from '@tanstack/react-query';
import { ledgerApi, userApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import Link from 'next/link';
import { Icons, StatsCard, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { cn, formatCurrency, getGreeting } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => ledgerApi.getDashboard(),
  });

  const { data: usage } = useQuery({
    queryKey: ['usage'],
    queryFn: () => userApi.getUsage(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icons.Loader className="w-8 h-8 text-primary-600" />
      </div>
    );
  }

  const data = dashboard?.data;
  const usageData = usage?.data;

  const quickActions = [
    {
      href: '/chat',
      label: 'AI 상담',
      description: '세무 질문하기',
      icon: Icons.Chat,
      color: 'primary',
    },
    {
      href: '/expenses?action=add',
      label: '지출 등록',
      description: '새 지출 추가',
      icon: Icons.Add,
      color: 'success',
    },
    {
      href: '/ledger',
      label: '장부 보기',
      description: '간편장부 확인',
      icon: Icons.Ledger,
      color: 'warning',
    },
    {
      href: '/blog',
      label: '세무 정보',
      description: '세무 팁 보기',
      icon: Icons.Blog,
      color: 'accent',
    },
  ];

  // 절세 금액 계산
  const taxSavings = data?.current_month?.deductible
    ? Math.round(data.current_month.deductible * 0.15) // 약 15% 세율 가정
    : 0;

  return (
    <div className="space-y-6 pb-20 lg:pb-0 animate-fade-in">
      {/* 인사말 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {getGreeting()}, <span className="text-gradient">{user?.name || '사용자'}님</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">오늘도 절세의 길로 함께해요!</p>
        </div>
        <div className="hidden lg:block">
          <Badge variant="primary" size="md">
            {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
          </Badge>
        </div>
      </div>

      {/* 핵심 KPI - 절세 현황 */}
      <Card className="bg-gradient-to-r from-primary-500 to-primary-600 border-0">
        <CardContent className="py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="text-white">
              <p className="text-white/80 text-sm font-medium mb-1">이번 달 절세 금액</p>
              <p className="text-3xl lg:text-4xl font-bold">
                {formatCurrency(taxSavings)}
              </p>
              <p className="text-white/70 text-sm mt-2">
                경비처리로 약 {formatCurrency(taxSavings)} 절세 중
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex flex-col items-center justify-center w-24 h-24 bg-white/20 rounded-2xl">
                <Icons.PiggyBank className="w-10 h-10 text-white mb-1" />
                <span className="text-white/90 text-xs">절세 진행 중</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 주요 통계 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="이번 달 수입"
          value={formatCurrency(data?.current_month?.income || 0)}
          icon={<Icons.TrendingUp className="w-6 h-6" />}
          variant="default"
        />
        <StatsCard
          title="이번 달 지출"
          value={formatCurrency(data?.current_month?.expense || 0)}
          icon={<Icons.TrendingDown className="w-6 h-6" />}
          variant="default"
        />
        <StatsCard
          title="경비인정액"
          value={formatCurrency(data?.current_month?.deductible || 0)}
          icon={<Icons.Success className="w-6 h-6" />}
          variant="success"
        />
        <StatsCard
          title="예상 세금"
          value={formatCurrency(data?.ytd?.estimated_tax || 0)}
          icon={<Icons.Calculator className="w-6 h-6" />}
          variant="warning"
        />
      </div>

      {/* 이용량 & 빠른 작업 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 이용량 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.PiggyBank className="w-5 h-5 text-primary-500" />
              이번 달 이용량
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">AI 상담</span>
                <span className="text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{usageData?.chat_used || 0}</span>
                  {usageData?.chat_limit !== -1 && (
                    <span> / {usageData?.chat_limit}</span>
                  )}
                  {usageData?.chat_limit === -1 && <span> (무제한)</span>}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: usageData?.chat_limit === -1
                      ? '30%'
                      : `${Math.min((usageData?.chat_used / usageData?.chat_limit) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">지출 등록</span>
                <span className="text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{usageData?.expense_used || 0}</span>
                  {usageData?.expense_limit !== -1 && (
                    <span> / {usageData?.expense_limit}</span>
                  )}
                  {usageData?.expense_limit === -1 && <span> (무제한)</span>}
                </span>
              </div>
              <div className="progress-bar progress-bar-success">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: usageData?.expense_limit === -1
                      ? '30%'
                      : `${Math.min((usageData?.expense_used / usageData?.expense_limit) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 빠른 작업 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.Add className="w-5 h-5 text-primary-500" />
              빠른 작업
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={cn(
                      'group flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200',
                      'hover:scale-[1.02] hover:shadow-soft',
                      action.color === 'primary' && 'bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/30 dark:hover:bg-primary-900/50',
                      action.color === 'success' && 'bg-success-50 hover:bg-success-100 dark:bg-success-900/30 dark:hover:bg-success-900/50',
                      action.color === 'warning' && 'bg-warning-50 hover:bg-warning-100 dark:bg-warning-900/30 dark:hover:bg-warning-900/50',
                      action.color === 'accent' && 'bg-accent-50 hover:bg-accent-100 dark:bg-accent-900/30 dark:hover:bg-accent-900/50',
                      action.color === 'gray' && 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-7 h-7 mb-2 transition-transform group-hover:scale-110',
                        action.color === 'primary' && 'text-primary-600',
                        action.color === 'success' && 'text-success-600',
                        action.color === 'warning' && 'text-warning-600',
                        action.color === 'accent' && 'text-accent-600',
                        action.color === 'gray' && 'text-gray-600'
                      )}
                    />
                    <span
                      className={cn(
                        'text-sm font-semibold',
                        action.color === 'primary' && 'text-primary-700',
                        action.color === 'success' && 'text-success-700',
                        action.color === 'warning' && 'text-warning-700',
                        action.color === 'accent' && 'text-accent-700',
                        action.color === 'gray' && 'text-gray-700'
                      )}
                    >
                      {action.label}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{action.description}</span>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 카테고리별 지출 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.Ledger className="w-5 h-5 text-primary-500" />
            카테고리별 지출
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data?.expense_by_category?.length > 0 ? (
            <div className="space-y-4">
              {data.expense_by_category.slice(0, 5).map((cat: any, index: number) => (
                <div key={cat.category_code} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'w-2 h-2 rounded-full',
                          index === 0 && 'bg-primary-500',
                          index === 1 && 'bg-accent-500',
                          index === 2 && 'bg-success-500',
                          index === 3 && 'bg-warning-500',
                          index >= 4 && 'bg-gray-400'
                        )}
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {cat.category_name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(cat.amount)}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        index === 0 && 'bg-primary-500',
                        index === 1 && 'bg-accent-500',
                        index === 2 && 'bg-success-500',
                        index === 3 && 'bg-warning-500',
                        index >= 4 && 'bg-gray-400'
                      )}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icons.Expense className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-4">아직 등록된 지출이 없습니다</p>
              <Link
                href="/expenses?action=add"
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <Icons.Add className="w-4 h-4" />
                첫 지출 등록하기
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

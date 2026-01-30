'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { userApi } from '@/lib/api';
import {
  Icons,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  Input,
} from '@/components/ui';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { user, subscription, fetchUser, logout } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [businessType, setBusinessType] = useState(user?.business_type || '');
  const [businessCategory, setBusinessCategory] = useState(user?.business_category || '');

  const updateProfileMutation = useMutation({
    mutationFn: (data: { name?: string }) => userApi.updateProfile(data),
    onSuccess: () => {
      fetchUser();
      alert('프로필이 업데이트되었습니다');
    },
  });

  const updateBusinessMutation = useMutation({
    mutationFn: (data: { business_type?: string; business_category?: string }) =>
      userApi.updateBusiness(data),
    onSuccess: () => {
      fetchUser();
      alert('사업자 정보가 업데이트되었습니다');
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({ name });
  };

  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessMutation.mutate({
      business_type: businessType || undefined,
      business_category: businessCategory || undefined,
    });
  };

  const businessTypes = [
    { value: 'freelancer', label: '프리랜서' },
    { value: 'sole_proprietor', label: '개인사업자' },
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-0 max-w-2xl animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">설정</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">계정과 사업자 정보를 관리하세요</p>
      </div>

      {/* 프로필 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.User className="w-5 h-5 text-primary-500" />
            프로필
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <Input
              type="email"
              label="이메일"
              value={user?.email || ''}
              disabled
              className="bg-gray-50 dark:bg-gray-800"
            />
            <Input
              type="text"
              label="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
            />
            <Button
              type="submit"
              isLoading={updateProfileMutation.isPending}
            >
              저장
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 사업자 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.Ledger className="w-5 h-5 text-primary-500" />
            사업자 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBusinessSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                사업자 유형
              </label>
              <div className="flex gap-2">
                {businessTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setBusinessType(type.value)}
                    className={cn(
                      'flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all border-2',
                      businessType === type.value
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-500'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            <Input
              type="text"
              label="업종"
              value={businessCategory}
              onChange={(e) => setBusinessCategory(e.target.value)}
              placeholder="예: IT, 디자인, 컨설팅"
            />
            <Button
              type="submit"
              isLoading={updateBusinessMutation.isPending}
            >
              저장
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 구독 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.Star className="w-5 h-5 text-primary-500" />
            구독 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">현재 플랜</span>
              <Badge variant="primary" size="md">
                {subscription?.plan_name || '무료'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">상태</span>
              <Badge
                variant={subscription?.status === 'active' ? 'success' : 'error'}
                size="md"
              >
                {subscription?.status === 'active' ? '활성' : '비활성'}
              </Badge>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            <Icons.TrendingUp className="w-4 h-4 mr-2" />
            플랜 업그레이드
          </Button>
        </CardContent>
      </Card>

      {/* 유용한 링크 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.ExternalLink className="w-5 h-5 text-primary-500" />
            유용한 링크
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link
            href="/blog"
            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <Icons.Blog className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">세무 정보</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">세무 팁과 가이드 보기</p>
              </div>
            </div>
            <Icons.ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
          </Link>
          <Link
            href="/terms"
            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <Icons.Ledger className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">이용약관</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">서비스 이용약관</p>
              </div>
            </div>
            <Icons.ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
          </Link>
          <Link
            href="/privacy"
            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <Icons.Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">개인정보처리방침</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">개인정보 보호 정책</p>
              </div>
            </div>
            <Icons.ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
          </Link>
        </CardContent>
      </Card>

      {/* 계정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.Settings className="w-5 h-5 text-gray-500" />
            계정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="danger"
            onClick={logout}
            className="w-full"
            leftIcon={<Icons.Logout className="w-4 h-4" />}
          >
            로그아웃
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

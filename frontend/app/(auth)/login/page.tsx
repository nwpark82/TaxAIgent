'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { Icons, Button, Input, Card, CardContent } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      // Error is handled in store
    }
  };

  const handleKakaoLogin = () => {
    const kakaoClientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${redirectUri}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-primary-50/30 to-accent-50/20 py-12 px-4">
      <div className="max-w-md w-full animate-fade-in">
        {/* 로고 및 헤더 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft">
              <span className="text-white font-bold text-xl">T</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            TaxAIgent
          </h1>
          <p className="mt-2 text-gray-500">AI 세무 도우미에 로그인하세요</p>
        </div>

        <Card className="shadow-soft-lg">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-error-50 text-error-600 rounded-xl text-sm">
                  <Icons.Error className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <Input
                type="email"
                label="이메일"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError();
                }}
                placeholder="email@example.com"
                leftIcon={<Icons.User className="w-4 h-4" />}
                required
              />

              <Input
                type="password"
                label="비밀번호"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError();
                }}
                placeholder="••••••••"
                required
              />

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full py-3"
              >
                로그인
              </Button>
            </form>

            {/* 구분선 */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400">또는</span>
              </div>
            </div>

            {/* 카카오 로그인 */}
            <button
              onClick={handleKakaoLogin}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#FEE500] text-[#191919] rounded-xl font-medium hover:bg-[#FDD835] transition-all hover:shadow-soft"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.76 1.76 5.16 4.36 6.48-.16.56-.64 2.04-.72 2.36-.12.4.12.4.28.28.12-.08 2-1.32 2.8-1.88.76.12 1.56.16 2.28.16 5.52 0 10-3.48 10-7.8S17.52 3 12 3z" />
              </svg>
              카카오로 시작하기
            </button>

            <p className="mt-6 text-center text-sm text-gray-500">
              계정이 없으신가요?{' '}
              <Link href="/signup" className="text-primary-600 hover:text-primary-700 font-semibold">
                회원가입
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

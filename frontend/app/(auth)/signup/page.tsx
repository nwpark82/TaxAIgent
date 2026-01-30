'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { Icons, Button, Input, Card, CardContent } from '@/components/ui';

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (password !== passwordConfirm) {
      setLocalError('비밀번호가 일치하지 않습니다');
      return;
    }

    if (password.length < 8) {
      setLocalError('비밀번호는 8자 이상이어야 합니다');
      return;
    }

    try {
      await signup(email, password, name || undefined);
      router.push('/dashboard');
    } catch (err) {
      // Error is handled in store
    }
  };

  const displayError = localError || error;

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
          <p className="mt-2 text-gray-500">무료로 시작하세요</p>
        </div>

        <Card className="shadow-soft-lg">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {displayError && (
                <div className="flex items-center gap-2 p-3 bg-error-50 text-error-600 rounded-xl text-sm">
                  <Icons.Error className="w-4 h-4 flex-shrink-0" />
                  {displayError}
                </div>
              )}

              <Input
                type="text"
                label="이름 (선택)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                leftIcon={<Icons.User className="w-4 h-4" />}
              />

              <Input
                type="email"
                label="이메일"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError();
                  setLocalError('');
                }}
                placeholder="email@example.com"
                required
              />

              <Input
                type="password"
                label="비밀번호"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError();
                  setLocalError('');
                }}
                placeholder="8자 이상"
                hint="영문, 숫자 조합 8자 이상"
                required
              />

              <Input
                type="password"
                label="비밀번호 확인"
                value={passwordConfirm}
                onChange={(e) => {
                  setPasswordConfirm(e.target.value);
                  setLocalError('');
                }}
                placeholder="비밀번호 확인"
                required
              />

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full py-3"
              >
                가입하기
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              이미 계정이 있으신가요?{' '}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                로그인
              </Link>
            </p>

            <p className="mt-4 text-center text-xs text-gray-400">
              가입하면{' '}
              <Link href="/terms" className="underline hover:text-gray-600">
                이용약관
              </Link>{' '}
              및{' '}
              <Link href="/privacy" className="underline hover:text-gray-600">
                개인정보처리방침
              </Link>
              에 동의하게 됩니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

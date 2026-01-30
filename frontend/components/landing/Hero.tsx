'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icons } from '@/components/ui';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-primary-50/30 to-accent-50/20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-8"
          >
            <Icons.Sparkles className="w-4 h-4" />
            AI 세무 상담 서비스
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            <span className="block">경비처리, 헷갈릴 때</span>
            <span className="block mt-2 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              결제 전에 확인하세요
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl sm:text-2xl text-gray-600 mb-4 max-w-2xl mx-auto"
          >
            "이 비용, 사업자 카드로 결제해도 될까?"
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto"
          >
            업종과 상황에 따라 다른 경비처리 기준,
            <br />
            <strong className="text-gray-700">AI에게 물어보고 참고하세요.</strong>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-soft hover:shadow-soft-lg flex items-center justify-center gap-2"
            >
              무료로 시작하기
              <Icons.ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/chat"
              className="w-full sm:w-auto px-8 py-4 border-2 border-primary-500 text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Icons.Chat className="w-5 h-5" />
              AI 상담 체험하기
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-8 text-gray-500"
          >
            <div className="flex items-center gap-2">
              <Icons.Chat className="w-5 h-5 text-primary-500" />
              <span className="text-sm">
                <strong className="text-gray-900">10,000+</strong> 건 상담
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icons.Ledger className="w-5 h-5 text-accent-500" />
              <span className="text-sm">
                <strong className="text-gray-900">100+</strong> 업종 지원
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icons.Star className="w-5 h-5 text-warning-500" />
              <span className="text-sm">
                <strong className="text-gray-900">4.9</strong> 만족도
              </span>
            </div>
          </motion.div>
        </div>

        {/* App Screenshot / Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 relative"
        >
          <div className="relative mx-auto max-w-4xl">
            {/* Browser mockup */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Browser header */}
              <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white rounded-md px-3 py-1 text-sm text-gray-500 text-center">
                    taxaigent.kr
                  </div>
                </div>
              </div>
              {/* App preview */}
              <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex gap-4">
                  {/* Chat preview */}
                  <div className="flex-1 space-y-4">
                    {/* Context badge */}
                    <div className="flex justify-center mb-2">
                      <span className="px-3 py-1.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full inline-flex items-center gap-1.5">
                        <Icons.Chat className="w-3.5 h-3.5" />
                        AI 상담
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Icons.User className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-600">
                          거래처와 저녁 식사비 50,000원, 경비처리 가능한가요?
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                        <Icons.Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 bg-primary-50 p-4 rounded-xl border border-primary-100">
                        <p className="text-sm text-gray-700 mb-2">
                          거래처 식사비는 일반적으로 <strong className="text-primary-700">접대비</strong>로 분류됩니다.
                          소득세법 시행령 제55조에 따라 경비 인정이 가능합니다.
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full font-medium">
                            경비 인정 가능
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            접대비
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent-200/50 rounded-2xl blur-xl" />
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-primary-200/50 rounded-2xl blur-xl" />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-3 bg-gray-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

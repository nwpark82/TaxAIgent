'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icons } from '@/components/ui';

export function FinalCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white/90 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
            <Icons.Sparkles className="w-4 h-4" />
            무료로 시작하기
          </span>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            지금 바로 시작해보세요
          </h2>
          <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            경비처리 고민, AI와 함께 풀어보세요.
            <br />
            가입 후 바로 사용할 수 있습니다.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              무료로 시작하기
              <Icons.ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/chat"
              className="w-full sm:w-auto px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Icons.Chat className="w-5 h-5" />
              먼저 체험해보기
            </Link>
          </div>

          {/* Trust text */}
          <p className="mt-8 text-white/60 text-sm">
            신용카드 필요 없음 • 1분 만에 가입 • 언제든 취소 가능
          </p>
        </motion.div>
      </div>
    </section>
  );
}

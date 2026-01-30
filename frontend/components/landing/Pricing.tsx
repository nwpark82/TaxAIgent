'use client';

import { motion } from 'framer-motion';
import { Icons } from '@/components/ui';
import Link from 'next/link';

const plans = [
  {
    name: '무료',
    price: '0',
    period: '영구 무료',
    description: '개인 사용자를 위한 기본 플랜',
    features: [
      { text: '월 10회 AI 상담', included: true },
      { text: '월 50건 지출 등록', included: true },
      { text: '간편장부 조회', included: true },
      { text: '엑셀/CSV 내보내기', included: true },
      { text: '카카오톡 연동', included: false, comingSoon: true },
      { text: '우선 응답', included: false },
      { text: '전문 세무사 연결', included: false },
    ],
    cta: '무료로 시작하기',
    ctaLink: '/signup',
    popular: false,
    comingSoon: false,
  },
  {
    name: '프로',
    price: '9,900',
    period: '월',
    description: '적극적인 사업자를 위한 플랜',
    features: [
      { text: '무제한 AI 상담', included: true },
      { text: '무제한 지출 등록', included: true },
      { text: '간편장부 조회', included: true },
      { text: '엑셀/CSV 내보내기', included: true },
      { text: '카카오톡 연동', included: true, comingSoon: true },
      { text: '우선 응답', included: true },
      { text: '전문 세무사 연결', included: false },
    ],
    cta: '출시 알림 받기',
    ctaLink: '#contact',
    popular: true,
    comingSoon: true,
  },
  {
    name: '비즈니스',
    price: '29,900',
    period: '월',
    description: '성장하는 사업자를 위한 플랜',
    features: [
      { text: '무제한 AI 상담', included: true },
      { text: '무제한 지출 등록', included: true },
      { text: '간편장부 조회', included: true },
      { text: '엑셀/CSV 내보내기', included: true },
      { text: '카카오톡 연동', included: true, comingSoon: true },
      { text: '우선 응답', included: true },
      { text: '전문 세무사 연결', included: true, comingSoon: true },
    ],
    cta: '출시 알림 받기',
    ctaLink: '#contact',
    popular: false,
    comingSoon: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-white via-primary-50/10 to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
            요금제
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
            합리적인 가격, 최고의 가치
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            필요에 맞는 플랜을 선택하세요. 언제든 업그레이드할 수 있습니다.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl ${
                plan.popular
                  ? 'bg-gradient-to-b from-primary-500 to-primary-600 p-[2px]'
                  : ''
              }`}
            >
              {/* Popular badge */}
              {plan.popular && !plan.comingSoon && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-sm font-semibold rounded-full shadow-lg">
                    인기
                  </span>
                </div>
              )}
              {/* Coming Soon badge */}
              {plan.comingSoon && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-sm font-semibold rounded-full shadow-lg">
                    출시 예정
                  </span>
                </div>
              )}

              <div className={`
                h-full bg-white rounded-2xl p-8
                ${plan.popular ? '' : 'border border-gray-200'}
              `}>
                {/* Plan name */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-500 text-sm mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ₩{plan.price}
                  </span>
                  <span className="text-gray-500 ml-2">/ {plan.period}</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-center gap-3">
                      {feature.included ? (
                        <div className="flex-shrink-0 w-5 h-5 bg-success-100 rounded-full flex items-center justify-center">
                          <Icons.Check className="w-3 h-3 text-success-600" />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                          <Icons.Close className="w-3 h-3 text-gray-400" />
                        </div>
                      )}
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                        {feature.text}
                      </span>
                      {feature.comingSoon && (
                        <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
                          준비 중
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {plan.comingSoon ? (
                  <a
                    href={plan.ctaLink}
                    className="block w-full py-3 rounded-xl font-semibold text-center transition-all duration-200 bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <Link
                    href={plan.ctaLink}
                    className={`
                      block w-full py-3 rounded-xl font-semibold text-center transition-all duration-200
                      ${plan.popular
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-soft hover:shadow-soft-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ link */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-gray-500"
        >
          요금제에 대해 궁금한 점이 있으신가요?{' '}
          <a href="#faq" className="text-primary-600 hover:text-primary-700 font-medium">
            자주 묻는 질문
          </a>
          을 확인해보세요.
        </motion.p>
      </div>
    </section>
  );
}

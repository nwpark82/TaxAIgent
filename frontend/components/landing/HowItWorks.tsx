'use client';

import { motion } from 'framer-motion';
import { Icons } from '@/components/ui';

const steps = [
  {
    number: '01',
    title: '궁금한 내용 질문',
    description: '"접대비로 처리 가능한가요?" 경비처리 관련 질문을 자유롭게 입력하세요.',
    icon: Icons.Chat,
    color: 'primary',
  },
  {
    number: '02',
    title: 'AI 답변 확인',
    description: '관련 법령 근거와 계정과목 분류 정보를 바로 확인할 수 있습니다.',
    icon: Icons.Sparkles,
    color: 'accent',
  },
  {
    number: '03',
    title: '정보 참고하여 결정',
    description: '제공된 정보를 바탕으로 비용 지출 여부를 직접 판단하세요.',
    icon: Icons.Check,
    color: 'success',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-gray-50/50 via-accent-50/10 to-white">
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
            사용 방법
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
            3단계면 충분합니다
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            복잡한 절차 없이 바로 시작하세요.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line (desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-200 via-accent-200 to-success-200 -translate-y-1/2" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-soft border border-gray-100 text-center relative z-10">
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className={`
                      inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
                      ${step.color === 'primary' ? 'bg-primary-500 text-white' : ''}
                      ${step.color === 'accent' ? 'bg-accent-500 text-white' : ''}
                      ${step.color === 'success' ? 'bg-success-500 text-white' : ''}
                    `}>
                      {index + 1}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`
                    w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center
                    ${step.color === 'primary' ? 'bg-primary-100' : ''}
                    ${step.color === 'accent' ? 'bg-accent-100' : ''}
                    ${step.color === 'success' ? 'bg-success-100' : ''}
                  `}>
                    <step.icon className={`
                      w-8 h-8
                      ${step.color === 'primary' ? 'text-primary-600' : ''}
                      ${step.color === 'accent' ? 'text-accent-600' : ''}
                      ${step.color === 'success' ? 'text-success-600' : ''}
                    `} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (mobile) */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <Icons.ChevronDown className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-soft hover:shadow-soft-lg"
          >
            무료로 시작하기
            <Icons.ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

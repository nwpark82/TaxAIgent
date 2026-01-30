'use client';

import { motion } from 'framer-motion';
import { Icons } from '@/components/ui';

const features = [
  {
    icon: Icons.Chat,
    title: 'AI 세무 상담',
    description: '경비처리 가능 여부가 헷갈릴 때 AI에게 물어보세요. 관련 법령 근거와 함께 참고할 수 있는 정보를 제공합니다.',
    color: 'primary',
    gradient: 'from-primary-500 to-primary-600',
  },
  {
    icon: Icons.Sparkles,
    title: '지출 자동 분류',
    description: '지출 내역을 입력하면 AI가 계정과목 분류를 도와드립니다. 접대비, 복리후생비, 소모품비 등 분류에 참고하세요.',
    color: 'accent',
    gradient: 'from-accent-500 to-accent-600',
  },
  {
    icon: Icons.Ledger,
    title: '간편장부 관리',
    description: '월별, 연간 수입/지출을 한눈에 확인하세요. 엑셀, CSV 내보내기로 세무사 전달도 간편합니다.',
    color: 'success',
    gradient: 'from-success-500 to-success-600',
  },
  {
    icon: Icons.Chat,
    title: '카카오톡 연동',
    description: '카카오톡으로 언제 어디서나 세무 상담을 받으세요. 이동 중에도 빠르게 확인할 수 있습니다.',
    color: 'warning',
    gradient: 'from-warning-500 to-warning-600',
    comingSoon: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function Features() {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-primary-50/20 via-white to-gray-50/50">
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
            주요 기능
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
            세무 업무를 더 쉽게
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            AI 상담부터 장부 관리까지,
            <br />
            사업자에게 필요한 기능을 모았습니다.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="relative group"
            >
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-soft hover:shadow-soft-lg transition-all duration-300 h-full">
                {/* Coming soon badge */}
                {feature.comingSoon && (
                  <span className="absolute top-4 right-4 px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                    Coming Soon
                  </span>
                )}

                {/* Icon */}
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature details */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left: Description */}
          <div>
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
              AI 상담 특징
            </span>
            <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              법령 근거와 함께
              <br />
              신뢰할 수 있는 정보
            </h3>
            <div className="space-y-4">
              {[
                {
                  icon: Icons.Check,
                  title: '즉시 답변',
                  description: '질문하면 바로 관련 정보를 확인할 수 있습니다.',
                },
                {
                  icon: Icons.Check,
                  title: '법령 근거 제시',
                  description: '소득세법, 법인세법 등 관련 조항을 함께 안내합니다.',
                },
                {
                  icon: Icons.Check,
                  title: '계정과목 분류 도움',
                  description: '접대비, 복리후생비, 소모품비 등 분류를 도와드립니다.',
                },
                {
                  icon: Icons.Check,
                  title: '주의사항 안내',
                  description: '예외 상황이나 주의할 점도 함께 알려드립니다.',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-success-100 rounded-full flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-success-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Screenshot/Demo */}
          <div className="relative">
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8">
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                {/* Header */}
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                  <span className="text-xs font-medium text-primary-600">AI 상담</span>
                </div>
                {/* Sample chat */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <Icons.User className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-xl p-3">
                    <p className="text-sm text-gray-700">
                      직원 회식비 30만원, 경비처리 가능한가요?
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <Icons.Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 bg-primary-50 rounded-xl p-4 border border-primary-100">
                    <p className="text-sm text-gray-700 mb-3">
                      직원 회식비는 일반적으로 <strong className="text-primary-700">복리후생비</strong>로 분류되어 경비 인정이 가능합니다.
                    </p>
                    <p className="text-sm text-gray-700 mb-3">
                      <span className="font-semibold text-primary-700">[참고 법령]</span><br />
                      소득세법 제27조에 따라 직원 복리후생 비용은 필요경비로 인정됩니다.
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                        경비 인정 가능
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        복리후생비
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative */}
            <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full bg-gradient-to-br from-primary-200/50 to-accent-200/50 rounded-2xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

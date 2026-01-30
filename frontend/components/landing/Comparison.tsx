'use client';

import { motion } from 'framer-motion';
import { Icons } from '@/components/ui';

export function Comparison() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50/50 via-white to-primary-50/20">
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
            비교해보세요
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
            미리 확인하면 이렇게 달라요
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            같은 비용이라도 확인 시점에 따라 느낌이 다릅니다.
          </p>
        </motion.div>

        {/* Comparison cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Before - Traditional */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative bg-white rounded-2xl border-2 border-gray-200 p-8 h-full">
              <div className="absolute -top-4 left-6 px-4 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                기존 방식
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-bold text-gray-400 mb-6 flex items-center gap-2">
                  <Icons.Clock className="w-6 h-6" />
                  나중에 확인하면
                </h3>

                {/* Timeline */}
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-bold">
                        1
                      </div>
                      <div className="w-0.5 h-full bg-gray-200 mt-2" />
                    </div>
                    <div className="pb-6">
                      <p className="font-medium text-gray-700">일단 결제</p>
                      <p className="text-sm text-gray-500 mt-1">
                        "경비처리 되겠지?" 하고 결제
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-bold">
                        2
                      </div>
                      <div className="w-0.5 h-full bg-gray-200 mt-2" />
                    </div>
                    <div className="pb-6">
                      <p className="font-medium text-gray-700">나중에 장부 정리</p>
                      <p className="text-sm text-gray-500 mt-1">
                        한 달치 모아서 정리
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-warning-100 flex items-center justify-center text-warning-600 text-sm font-bold">
                        3
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-warning-600">뒤늦게 알게 됨</p>
                      <p className="text-sm text-gray-500 mt-1">
                        "이건 경비처리가 어려울 수 있어요"
                      </p>
                      <div className="mt-3 p-3 bg-warning-50 rounded-lg border border-warning-200">
                        <p className="text-sm text-warning-700">
                          이미 결제한 후라 아쉬움이 남을 수 있음
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* After - TaxAIgent */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative bg-gradient-to-br from-primary-50 to-success-50 rounded-2xl border-2 border-primary-200 p-8 h-full">
              <div className="absolute -top-4 left-6 px-4 py-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium rounded-full">
                TaxAIgent
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-bold text-primary-700 mb-6 flex items-center gap-2">
                  <Icons.Chat className="w-6 h-6 text-primary-600" />
                  미리 확인하면
                </h3>

                {/* Timeline */}
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-sm font-bold">
                        1
                      </div>
                      <div className="w-0.5 h-full bg-primary-200 mt-2" />
                    </div>
                    <div className="pb-6">
                      <p className="font-medium text-gray-700">결제 전 AI에게 질문</p>
                      <p className="text-sm text-gray-500 mt-1">
                        "이거 경비처리 가능한가요?"
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-sm font-bold">
                        2
                      </div>
                      <div className="w-0.5 h-full bg-primary-200 mt-2" />
                    </div>
                    <div className="pb-6">
                      <p className="font-medium text-gray-700">AI 답변 참고</p>
                      <p className="text-sm text-gray-500 mt-1">
                        관련 법령 근거와 함께 조언 확인
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-sm font-bold">
                        3
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-primary-600">정보 확인 후 결제</p>
                      <p className="text-sm text-gray-500 mt-1">
                        참고 정보를 바탕으로 판단하고 결제
                      </p>
                      <div className="mt-3 p-3 bg-primary-50 rounded-lg border border-primary-200">
                        <p className="text-sm text-primary-700">
                          미리 확인하니 마음이 편해요
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-gray-100 rounded-2xl">
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
              <Icons.Chat className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-600 font-medium">TaxAIgent 활용 팁</p>
              <p className="text-lg font-bold text-gray-800">
                결제 버튼 누르기 전, 잠깐 물어보세요
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

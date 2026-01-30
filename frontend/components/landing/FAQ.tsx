'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '@/components/ui';

const faqs = [
  {
    question: 'TaxAIgent는 어떤 서비스인가요?',
    answer: 'TaxAIgent는 1인 사업자와 프리랜서를 위한 AI 세무 상담 서비스입니다. 경비처리 관련 질문에 법령 근거와 함께 참고 정보를 제공하고, 지출 분류와 간편장부 관리를 도와드립니다.',
  },
  {
    question: 'AI 답변은 어떻게 활용하면 좋을까요?',
    answer: 'AI 답변은 소득세법, 법인세법 등 관련 법령을 기반으로 제공되는 참고 정보입니다. 경비처리 판단에 도움이 되도록 법령 근거를 함께 안내해드립니다. 복잡한 세무 상황이나 중요한 결정의 경우 전문 세무사 상담을 권고드립니다.',
  },
  {
    question: '무료 플랜으로 어떤 기능을 사용할 수 있나요?',
    answer: '무료 플랜에서는 월 10회 AI 상담, 월 50건 지출 등록, 간편장부 조회, 엑셀/CSV 내보내기 기능을 이용하실 수 있습니다. 개인 사용자에게 충분한 수준의 기능을 제공합니다.',
  },
  {
    question: '유료 플랜은 언제 업그레이드하면 좋을까요?',
    answer: '월 10회 이상 세무 상담이 필요하거나, 지출 건수가 많은 경우 프로 플랜을 추천드립니다. 카카오톡 연동이나 우선 응답이 필요한 경우에도 유료 플랜이 적합합니다.',
  },
  {
    question: '카카오톡으로도 상담받을 수 있나요?',
    answer: '네, 프로 플랜 이상에서 카카오톡 연동 기능을 제공합니다. 카카오톡 채널을 추가하시면 언제 어디서나 편리하게 세무 상담을 받으실 수 있습니다. (곧 출시 예정)',
  },
  {
    question: '세무사에게 직접 상담받을 수 있나요?',
    answer: '비즈니스 플랜에서는 전문 세무사 연결 서비스를 제공합니다. AI 상담으로 해결되지 않는 복잡한 세무 문제가 있을 때 전문가의 도움을 받으실 수 있습니다.',
  },
  {
    question: '데이터는 안전하게 보관되나요?',
    answer: '네, 모든 데이터는 암호화되어 안전하게 보관됩니다. 개인정보 보호법을 준수하며, 사용자의 데이터는 서비스 제공 목적으로만 사용됩니다. 자세한 내용은 개인정보처리방침을 참고해주세요.',
  },
  {
    question: '환불 정책은 어떻게 되나요?',
    answer: '유료 플랜 결제 후 7일 이내에 서비스를 이용하지 않으신 경우 전액 환불해드립니다. 이용 내역이 있는 경우 잔여 기간에 대한 부분 환불이 가능합니다. 고객센터로 문의해주세요.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-accent-50/10 via-white to-gray-50/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
            자주 묻는 질문
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            궁금한 점이 있으시면 언제든 문의해주세요.
          </p>
        </motion.div>

        {/* FAQ list */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icons.ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 mb-4">
            찾으시는 답변이 없으신가요?
          </p>
          <a
            href="mailto:support@taxaigent.kr"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            <Icons.Send className="w-4 h-4" />
            문의하기
          </a>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Icons } from '@/components/ui';

const testimonials = [
  {
    content: '매번 세무사한테 물어보기 민망했던 질문들을 AI한테 편하게 할 수 있어서 좋아요. 법령 근거까지 알려줘서 신뢰가 가더라고요.',
    author: '김민수',
    role: '프리랜서 개발자',
    rating: 5,
    avatar: 'K',
  },
  {
    content: '지출 자동 분류 기능이 정말 편해요. 예전에는 엑셀로 일일이 정리했는데, 이제 시간을 많이 절약하고 있어요.',
    author: '이지영',
    role: '1인 쇼핑몰 운영',
    rating: 5,
    avatar: 'L',
  },
  {
    content: '무료 플랜으로 시작했는데 충분히 만족스러워요. 월 10회면 저한테는 딱 맞는 것 같아요. 복잡한 건 나중에 세무사님한테 여쭤보고.',
    author: '박준혁',
    role: '유튜버',
    rating: 4,
    avatar: 'P',
  },
  {
    content: '간편장부 기능이 깔끔해서 좋아요. 세무사님한테 자료 보낼 때 엑셀로 바로 내보내기 할 수 있어서 편리해요.',
    author: '최서연',
    role: '디자인 프리랜서',
    rating: 5,
    avatar: 'C',
  },
  {
    content: '경비처리 될지 안될지 애매한 것들이 많았는데, AI가 법령 근거와 함께 설명해줘서 참고하기 좋아요.',
    author: '정현우',
    role: '번역가',
    rating: 5,
    avatar: 'J',
  },
  {
    content: '카카오톡 연동 기능 출시되면 바로 프로 플랜 결제할 예정이에요. 그때그때 바로 물어볼 수 있으면 정말 편할 것 같아요.',
    author: '한소희',
    role: '온라인 강사',
    rating: 4,
    avatar: 'H',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-gradient-to-b from-gray-50/50 via-white to-accent-50/10 overflow-hidden">
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
            사용 후기
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
            이렇게 활용하고 있어요
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            실제 사용자들의 경험을 확인해보세요.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gray-50 rounded-2xl p-6 hover:shadow-soft transition-shadow duration-300"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Icons.Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating ? 'text-warning-500 fill-warning-500' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '1,000+', label: '활성 사용자' },
            { value: '10,000+', label: '상담 완료' },
            { value: '4.9/5', label: '평균 만족도' },
            { value: '95%', label: '재이용 의향' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="mt-1 text-gray-600">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

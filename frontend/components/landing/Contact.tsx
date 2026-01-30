'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '@/components/ui';

interface ContactFormData {
  name: string;
  email: string;
  type: 'general' | 'pricing' | 'partnership' | 'bug';
  message: string;
}

const inquiryTypes = [
  { value: 'general', label: '일반 문의' },
  { value: 'pricing', label: '요금제 문의' },
  { value: 'partnership', label: '제휴/협력 문의' },
  { value: 'bug', label: '버그/오류 신고' },
];

export function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    type: 'general',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          type: 'general',
          message: '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-gray-50/30 via-primary-50/10 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
            문의하기
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
            궁금한 점이 있으신가요?
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            서비스 관련 문의, 제휴 제안, 버그 신고 등 무엇이든 편하게 문의해주세요.
            <br />
            빠른 시일 내에 답변드리겠습니다.
          </p>
        </motion.div>

        {/* Contact form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8"
        >
          {submitStatus === 'success' ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icons.Check className="w-8 h-8 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                문의가 접수되었습니다
              </h3>
              <p className="text-gray-600 mb-6">
                빠른 시일 내에 입력하신 이메일로 답변드리겠습니다.
              </p>
              <button
                onClick={() => setSubmitStatus('idle')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                새로운 문의하기
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    이름 <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    placeholder="홍길동"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    이메일 <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              {/* Inquiry Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  문의 유형 <span className="text-error-500">*</span>
                </label>
                <select
                  id="type"
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as ContactFormData['type'] })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all bg-white"
                >
                  {inquiryTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  문의 내용 <span className="text-error-500">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
                  placeholder="문의하실 내용을 자세히 적어주세요."
                />
              </div>

              {/* Error message */}
              {submitStatus === 'error' && (
                <div className="p-4 bg-error-50 border border-error-200 rounded-xl">
                  <p className="text-error-700 text-sm">
                    문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
                  </p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-soft hover:shadow-soft-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    전송 중...
                  </>
                ) : (
                  <>
                    <Icons.Send className="w-5 h-5" />
                    문의 보내기
                  </>
                )}
              </button>

              {/* Privacy notice */}
              <p className="text-xs text-gray-500 text-center">
                문의를 보내시면{' '}
                <a href="/privacy" className="text-primary-600 hover:underline">
                  개인정보처리방침
                </a>
                에 동의하는 것으로 간주됩니다.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

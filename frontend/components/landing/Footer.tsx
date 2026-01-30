'use client';

import Link from 'next/link';
import { Icons } from '@/components/ui';

const footerLinks = {
  product: {
    title: '서비스',
    links: [
      { label: '기능 소개', href: '#features' },
      { label: '요금제', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
      { label: '블로그', href: '/blog' },
    ],
  },
  company: {
    title: '회사',
    links: [
      { label: '소개', href: '/about' },
      { label: '문의하기', href: 'mailto:support@taxaigent.kr' },
    ],
  },
  legal: {
    title: '법적 고지',
    links: [
      { label: '이용약관', href: '/terms' },
      { label: '개인정보처리방침', href: '/privacy' },
    ],
  },
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-white font-bold text-xl">TaxAIgent</span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              1인 사업자를 위한 AI 세무 비서
              <br />
              복잡한 세무, 이제 쉽게 해결하세요.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                aria-label="Instagram"
              >
                <Icons.ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                aria-label="Blog"
              >
                <Icons.Ledger className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              © {new Date().getFullYear()} TaxAIgent. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              본 서비스의 AI 답변은 참고용이며, 정확한 세무 처리는 전문 세무사와 상담하시기 바랍니다.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

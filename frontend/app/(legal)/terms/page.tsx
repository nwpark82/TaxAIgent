import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관 - TaxAIgent',
  description: 'TaxAIgent 서비스 이용약관',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="text-lg font-bold text-gray-900">TaxAIgent</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">이용약관</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제1조 (목적)</h2>
            <p className="text-gray-600 leading-relaxed">
              본 약관은 TaxAIgent(이하 "회사")가 제공하는 AI 세무 상담 서비스(이하 "서비스")의 이용조건 및 절차,
              회사와 이용자의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제2조 (정의)</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 leading-relaxed">
              <li>"서비스"란 회사가 제공하는 AI 기반 세무 상담, 지출 관리, 간편장부 등 모든 서비스를 의미합니다.</li>
              <li>"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
              <li>"회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제3조 (약관의 효력과 변경)</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 leading-relaxed">
              <li>본 약관은 서비스를 이용하고자 하는 모든 이용자에게 그 효력을 발생합니다.</li>
              <li>회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있습니다.</li>
              <li>약관이 변경되는 경우 회사는 변경된 약관의 적용일자 및 변경사유를 명시하여 현행 약관과 함께 서비스 내 공지합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제4조 (서비스의 제공)</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 leading-relaxed">
              <li>회사는 다음과 같은 서비스를 제공합니다:
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>AI 기반 세무 상담 서비스</li>
                  <li>지출 관리 및 자동 분류 서비스</li>
                  <li>간편장부 관리 서비스</li>
                  <li>기타 회사가 정하는 서비스</li>
                </ul>
              </li>
              <li>서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다. 다만, 시스템 점검 등의 필요에 의해 일시적으로 서비스가 중단될 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제5조 (서비스 이용의 제한)</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              회사는 다음 각 호에 해당하는 경우 서비스 이용을 제한할 수 있습니다:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 leading-relaxed">
              <li>타인의 정보를 도용하여 가입한 경우</li>
              <li>서비스 운영을 고의로 방해한 경우</li>
              <li>기타 관련 법령이나 회사가 정한 이용조건을 위반한 경우</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제6조 (AI 서비스의 한계)</h2>
            <div className="bg-warning-50 border border-warning-200 rounded-xl p-4">
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-warning-700">중요:</strong> 본 서비스의 AI 상담 결과는 참고용 정보이며,
                법적 효력을 갖는 세무 자문이 아닙니다. 정확한 세무 처리를 위해서는 반드시 공인된 세무사 또는
                세무 전문가와 상담하시기 바랍니다. 회사는 AI 상담 결과에 따른 세무 처리로 발생하는
                손해에 대해 책임지지 않습니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제7조 (요금 및 결제)</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 leading-relaxed">
              <li>서비스의 이용요금은 회사가 별도로 정한 요금정책에 따릅니다.</li>
              <li>유료 서비스의 경우 이용요금을 결제해야 서비스를 이용할 수 있습니다.</li>
              <li>환불 정책은 회사의 환불 규정에 따릅니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제8조 (개인정보보호)</h2>
            <p className="text-gray-600 leading-relaxed">
              회사는 이용자의 개인정보를 보호하기 위해 관련 법령에서 정하는 바에 따라 이용자의 개인정보를 보호하기 위해 노력합니다.
              개인정보의 보호 및 사용에 대해서는 관련 법령 및 회사의 개인정보처리방침이 적용됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제9조 (책임의 제한)</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 leading-relaxed">
              <li>회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력적인 사유로 서비스를 제공할 수 없는 경우 책임이 면제됩니다.</li>
              <li>회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대해 책임지지 않습니다.</li>
              <li>회사는 이용자가 서비스를 통해 기대하는 효용을 얻지 못한 것에 대해 책임지지 않습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제10조 (분쟁해결)</h2>
            <p className="text-gray-600 leading-relaxed">
              본 약관에 명시되지 않은 사항은 관련 법령 및 상관례에 따르며, 서비스 이용과 관련하여 분쟁이 발생한 경우
              회사의 소재지를 관할하는 법원을 전속 관할법원으로 합니다.
            </p>
          </section>

          <section className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              본 약관은 2025년 1월 1일부터 시행됩니다.
            </p>
          </section>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
            ← 홈으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  );
}

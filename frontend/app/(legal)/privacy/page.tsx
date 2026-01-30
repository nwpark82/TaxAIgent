import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 - TaxAIgent',
  description: 'TaxAIgent 개인정보처리방침',
};

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">개인정보처리방침</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-8">
          <section>
            <p className="text-gray-600 leading-relaxed">
              TaxAIgent(이하 "회사")는 이용자의 개인정보를 중요시하며, 「개인정보 보호법」,
              「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 준수하고 있습니다.
              회사는 본 개인정보처리방침을 통해 이용자의 개인정보가 어떠한 용도와 방식으로
              이용되고 있으며, 개인정보 보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. 수집하는 개인정보 항목</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">필수 수집 항목</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>이메일 주소</li>
                  <li>비밀번호 (암호화 저장)</li>
                  <li>서비스 이용 기록</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">선택 수집 항목</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>이름</li>
                  <li>사업자 유형 (프리랜서/개인사업자)</li>
                  <li>업종</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">자동 수집 항목</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>IP 주소</li>
                  <li>쿠키</li>
                  <li>접속 기기 정보</li>
                  <li>서비스 이용 기록 (상담 내역, 지출 내역)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. 개인정보의 수집 및 이용 목적</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 leading-relaxed">
              <li><strong>서비스 제공:</strong> AI 세무 상담, 지출 관리, 간편장부 서비스 제공</li>
              <li><strong>회원 관리:</strong> 회원제 서비스 이용에 따른 본인확인, 가입 의사 확인, 불량회원의 부정 이용 방지</li>
              <li><strong>서비스 개선:</strong> 서비스 이용 통계 분석, AI 모델 개선</li>
              <li><strong>고객 지원:</strong> 이용자 문의 응대, 불만 처리</li>
              <li><strong>마케팅:</strong> 신규 서비스 안내, 이벤트 정보 제공 (동의한 경우에 한함)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. 개인정보의 보유 및 이용 기간</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              회사는 이용자의 개인정보를 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다.
              단, 관련 법령에 의하여 보존할 필요가 있는 경우 아래와 같이 관련 법령에서 정한 일정한 기간 동안
              개인정보를 보관합니다.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>계약 또는 청약철회 등에 관한 기록:</strong> 5년 (전자상거래법)</li>
              <li><strong>대금결제 및 재화 등의 공급에 관한 기록:</strong> 5년 (전자상거래법)</li>
              <li><strong>소비자의 불만 또는 분쟁처리에 관한 기록:</strong> 3년 (전자상거래법)</li>
              <li><strong>접속에 관한 기록:</strong> 3개월 (통신비밀보호법)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. 개인정보의 제3자 제공</h2>
            <p className="text-gray-600 leading-relaxed">
              회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
              다만, 아래의 경우에는 예외로 합니다:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. 개인정보 처리 위탁</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              회사는 서비스 제공을 위해 아래와 같이 개인정보 처리 업무를 위탁하고 있습니다:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">수탁업체</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">위탁 업무</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-t border-gray-200">
                    <td className="px-4 py-3">Google Cloud</td>
                    <td className="px-4 py-3">클라우드 서버 운영</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="px-4 py-3">OpenAI / Google</td>
                    <td className="px-4 py-3">AI 언어 모델 서비스</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. 이용자의 권리</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              이용자는 언제든지 자신의 개인정보에 대해 다음과 같은 권리를 행사할 수 있습니다:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>개인정보 열람 요청</li>
              <li>개인정보 정정 요청</li>
              <li>개인정보 삭제 요청</li>
              <li>개인정보 처리정지 요청</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              위 권리 행사는 서비스 내 설정 메뉴 또는 고객센터를 통해 가능합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. 개인정보의 파기</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는
                지체 없이 해당 개인정보를 파기합니다.
              </p>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">파기 절차</h3>
                <p>
                  이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져 내부 방침 및 기타 관련
                  법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">파기 방법</h3>
                <p>
                  전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. 개인정보 보호책임자</h2>
            <div className="bg-gray-50 rounded-xl p-4 text-gray-600">
              <p><strong>개인정보 보호책임자:</strong> TaxAIgent 개인정보보호팀</p>
              <p><strong>이메일:</strong> privacy@taxaigent.kr</p>
              <p className="mt-2 text-sm">
                기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.
              </p>
              <ul className="mt-2 text-sm space-y-1">
                <li>• 개인정보침해신고센터 (privacy.kisa.or.kr / 118)</li>
                <li>• 대검찰청 사이버범죄수사단 (www.spo.go.kr / 02-3480-3573)</li>
                <li>• 경찰청 사이버안전국 (cyberbureau.police.go.kr / 182)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. 개인정보처리방침의 변경</h2>
            <p className="text-gray-600 leading-relaxed">
              본 개인정보처리방침은 법령, 정책 또는 보안기술의 변경에 따라 내용의 추가, 삭제 및 수정이 있을 시에는
              변경사항의 시행 7일 전부터 서비스 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>

          <section className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              본 개인정보처리방침은 2025년 1월 1일부터 시행됩니다.
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

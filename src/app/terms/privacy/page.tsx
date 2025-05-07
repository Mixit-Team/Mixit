import BackButton from '@/components/atoms/BackButton';

export default function TermsPrivacyPage() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-100">
      <div className="relative mx-auto w-full max-w-md rounded bg-white px-4 py-6 shadow">
        <div className="absolute top-6 left-4">
          <BackButton />
        </div>
        <h1 className="mb-8 text-center text-lg font-bold">
          개인정보 이용 정책서/개인정보 수집 및 처리방침
        </h1>
        <div className="prose prose-sm max-w-none space-y-4">
          <p>
            <b>시행일자:</b> 2025년 5월 7일
            <br />
            <b>서비스명:</b> mixit
          </p>
          <p>
            본 방침은 「개인정보 보호법」에 따라 정보주체의 개인정보를 보호하고, 이와 관련한 고충을
            신속하고 원활하게 처리할 수 있도록 하기 위해 다음과 같이 개인정보 처리방침을
            수립·공개합니다.
          </p>
          <h2>1. 수집하는 개인정보 항목 및 수집 방법</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-xs">
              <thead>
                <tr>
                  <th className="border px-2 py-1">구분</th>
                  <th className="border px-2 py-1">수집 항목</th>
                  <th className="border px-2 py-1">수집 시점</th>
                  <th className="border px-2 py-1">수집 목적</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-2 py-1" rowSpan={2}>
                    필수
                  </td>
                  <td className="border px-2 py-1">
                    아이디, 비밀번호, 이름, 생년월일, 이메일, 닉네임
                  </td>
                  <td className="border px-2 py-1">회원가입 시</td>
                  <td className="border px-2 py-1">서비스 가입 및 이용자 식별, 본인확인</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">프로필사진, SNS 계정 연동 정보</td>
                  <td className="border px-2 py-1">회원가입/회원정보 입력 시</td>
                  <td className="border px-2 py-1">개인 맞춤 추천, 통계 분석</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">자동수집</td>
                  <td className="border px-2 py-1">
                    접속 IP, 쿠키, 기기정보(기종, OS), 방문 일시, 이용기록
                  </td>
                  <td className="border px-2 py-1">서비스 이용 시</td>
                  <td className="border px-2 py-1">서비스 품질 개선, 비정상 이용방지, 통계 분석</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">인증수단</td>
                  <td className="border px-2 py-1">이메일 인증</td>
                  <td className="border px-2 py-1">본인 인증 시</td>
                  <td className="border px-2 py-1">
                    회원가입, 비밀번호 찾기, 계정 보호(마이페이지 회원정보 접근)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <h2>2. 개인정보의 수집 및 이용 목적</h2>
          <ul>
            <li>회원 가입 및 관리 (본인 확인, 중복 확인, 회원 서비스 제공)</li>
            <li>게시물 작성, 댓글, 북마크, 리뷰 등 서비스 제공을 위한 사용자 식별</li>
            <li>고객 문의 및 민원 처리</li>
            <li>이벤트 정보수신 (동의한 경우에 한함)</li>
            <li>서비스 이용 통계 및 고도화를 위한 데이터 분석</li>
            <li>법령 및 이용약관 위반 사용자에 대한 제재</li>
          </ul>
          <h2>3. 개인정보의 보유 및 이용 기간</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-xs">
              <thead>
                <tr>
                  <th className="border px-2 py-1">항목</th>
                  <th className="border px-2 py-1">보유기간</th>
                  <th className="border px-2 py-1">보유근거</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-2 py-1">회원 가입 정보</td>
                  <td className="border px-2 py-1">탈퇴 시 즉시 삭제</td>
                  <td className="border px-2 py-1">전자상거래 등에서의 소비자 보호에 관한 법률</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">마케팅 수신동의</td>
                  <td className="border px-2 py-1">동의 철회 시까지</td>
                  <td className="border px-2 py-1">정보통신망법</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs">
            ※ 단, 관계법령에 따라 일정 기간 정보 보존이 필요한 경우에는 별도 보관될 수 있음
          </p>
          <h2>4. 개인정보 제3자 제공</h2>
          <p>
            회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않으며, <br />
            다만 아래의 경우에는 예외로 합니다.
          </p>
          <ul>
            <li>이용자가 사전에 동의한 경우</li>
            <li>
              법령에 의거하거나, 수사/조사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의
              요구가 있는 경우
            </li>
            <li>이벤트 등에서 사전에 고지하고 별도 동의를 받은 경우</li>
          </ul>
          <h2>5. 개인정보 처리의 위탁</h2>
          <p>
            회사는 원활한 서비스 제공을 위해 다음과 같이 일부 업무를 외부 업체에 위탁하고 있습니다.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-xs">
              <thead>
                <tr>
                  <th className="border px-2 py-1">수탁사</th>
                  <th className="border px-2 py-1">위탁업무 내용</th>
                  <th className="border px-2 py-1">보유 및 이용기간</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-2 py-1">Amazon Web Services (AWS)</td>
                  <td className="border px-2 py-1">서비스 서버 인프라의 운영/관리</td>
                  <td className="border px-2 py-1">
                    계약 종료 및 또는 법령 상 보존 의무 종료 시까지
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <h2>6. 이용자의 권리 및 행사 방법</h2>
          <ul>
            <li>언제든지 다음의 권리를 행사할 수 있습니다.</li>
            <li>본인 개인정보 조회, 수정, 삭제 요청</li>
            <li>회원가입 동의 후 언제든지 철회 가능</li>
            <li>
              개인정보 조회/수정/삭제 및 동의 철회 방법: 마이페이지 &gt; 회원정보 관리 메뉴 또는
              별도 문의 가능
            </li>
            <li>법정대리인의 권리 행사도 동일하게 적용</li>
            <li>개인정보 열람 등 관련 신청은 7일 이내 처리</li>
          </ul>
          <h2>7. 쿠키 등 자동 수집 장치의 설치/운영 및 거부</h2>
          <ul>
            <li>이용자의 편의성 향상을 위해 쿠키를 사용합니다.</li>
            <li>
              이용자는 쿠키 저장을 거부할 수 있으며, 거부 시 서비스 이용에 일부 제한이 있을 수
              있습니다.
            </li>
          </ul>
          <h2>8. 개인정보 보호를 위한 기술적·관리적 조치</h2>
          <ul>
            <li>개인정보는 원칙적으로 암호화되어 저장 및 관리됩니다.</li>
            <li>중요 정보 전송 시 암호화 통신(HTTPS) 사용</li>
            <li>접근권한 최소화 및 접근 통제</li>
            <li>정기적 보안 점검 및 교육</li>
          </ul>
          <h2>9. 개인정보 보호책임자 및 문의처</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-xs">
              <thead>
                <tr>
                  <th className="border px-2 py-1">항목</th>
                  <th className="border px-2 py-1">내용</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-2 py-1">이메일</td>
                  <td className="border px-2 py-1">mixitofficalmit@gmail.com</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs">
            ※ 개인정보와 관련된 민원은 언제든지 접수 가능하며, 신속한 처리를 약속드립니다.
          </p>
          <h2>10. 정책 변경 시 고지</h2>
          <p>
            본 개인정보처리방침은 시행일자 기준이며, 변경이 있을 경우에는 최소 7일 전 공지사항을
            통해 고지합니다.
            <br />
            중요한 변경이 있을 경우에는 최소 30일 전 공지합니다.
          </p>
        </div>
      </div>
    </div>
  );
}

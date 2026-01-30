"""
API 통합 테스트 스크립트
"""
import sys
import io
import requests

# Windows 콘솔 UTF-8 출력 설정
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

BASE_URL = "http://localhost:8001/api/v1"

print("=" * 60)
print("API 통합 테스트")
print("=" * 60)

# 1. 로그인 테스트
print("\n1. 로그인 테스트...")
login_response = requests.post(
    f"{BASE_URL}/auth/login",
    json={"email": "admin@taxaigent.kr", "password": "admin1234!"}
)
print(f"   상태 코드: {login_response.status_code}")

if login_response.status_code == 200:
    token_data = login_response.json()
    token = token_data["access_token"]
    print(f"   ✅ 로그인 성공! 토큰: {token[:30]}...")

    headers = {"Authorization": f"Bearer {token}"}

    # 2. 사용자 정보 조회
    print("\n2. 사용자 정보 조회...")
    me_response = requests.get(f"{BASE_URL}/users/me", headers=headers)
    print(f"   상태 코드: {me_response.status_code}")
    if me_response.status_code == 200:
        user = me_response.json()
        print(f"   ✅ 사용자: {user.get('email')}")

    # 3. 계정과목 조회
    print("\n3. 계정과목 조회...")
    categories_response = requests.get(f"{BASE_URL}/categories", headers=headers)
    print(f"   상태 코드: {categories_response.status_code}")
    if categories_response.status_code == 200:
        categories = categories_response.json()
        print(f"   ✅ 계정과목 {len(categories)}개 조회됨")

    # 4. AI 상담 테스트
    print("\n4. AI 상담 테스트...")
    chat_response = requests.post(
        f"{BASE_URL}/chat/ask",
        headers=headers,
        json={"question": "노트북 구매 비용 처리 방법"}
    )
    print(f"   상태 코드: {chat_response.status_code}")
    if chat_response.status_code == 200:
        chat_data = chat_response.json()
        print(f"   ✅ AI 응답 수신!")
        print(f"   답변: {chat_data.get('answer', '')[:100]}...")
        print(f"   출처: {chat_data.get('references', [])}")
    else:
        print(f"   ❌ 에러: {chat_response.text}")

    # 5. 대시보드 조회
    print("\n5. 대시보드 조회...")
    dashboard_response = requests.get(f"{BASE_URL}/dashboard", headers=headers)
    print(f"   상태 코드: {dashboard_response.status_code}")
    if dashboard_response.status_code == 200:
        dashboard = dashboard_response.json()
        print(f"   ✅ 대시보드 데이터 조회됨")

else:
    print(f"   ❌ 로그인 실패: {login_response.text}")

print("\n" + "=" * 60)
print("테스트 완료!")
print("=" * 60)

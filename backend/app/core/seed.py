"""
Database seed data - 초기 데이터 생성
"""
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import Category
from app.models.plan import Plan
from app.models.user import User
from app.models.plan import Subscription
from app.core.security import get_password_hash


# 관리자 계정 초기 데이터
ADMIN_DATA = {
    "email": "admin@taxaigent.kr",
    "password": "admin1234!",  # 초기 비밀번호 (배포 전 변경 필요)
    "name": "관리자",
    "is_admin": True,
    "business_type": "admin",
    "status": "active",
}

# 계정과목 초기 데이터
CATEGORIES_DATA = [
    {"code": "ENT", "name": "접대비", "name_en": "Entertainment", "description": "거래처 관련 지출", "is_deductible": True, "sort_order": 1},
    {"code": "WEL", "name": "복리후생비", "name_en": "Welfare", "description": "직원/본인 복지", "is_deductible": True, "sort_order": 2},
    {"code": "SUP", "name": "소모품비", "name_en": "Supplies", "description": "사무용품 등", "is_deductible": True, "sort_order": 3},
    {"code": "VEH", "name": "차량유지비", "name_en": "Vehicle", "description": "차량 관련 지출", "is_deductible": True, "sort_order": 4},
    {"code": "COM", "name": "통신비", "name_en": "Communication", "description": "인터넷, 전화", "is_deductible": True, "sort_order": 5},
    {"code": "RNT", "name": "임차료", "name_en": "Rent", "description": "사무실 임대", "is_deductible": True, "sort_order": 6},
    {"code": "ADV", "name": "광고선전비", "name_en": "Advertising", "description": "광고, 마케팅", "is_deductible": True, "sort_order": 7},
    {"code": "FEE", "name": "지급수수료", "name_en": "Fees", "description": "수수료, 결제비용", "is_deductible": True, "sort_order": 8},
    {"code": "EDU", "name": "교육훈련비", "name_en": "Education", "description": "교육, 강의", "is_deductible": True, "sort_order": 9},
    {"code": "EQP", "name": "비품", "name_en": "Equipment", "description": "장비, 비품", "is_deductible": True, "sort_order": 10},
    {"code": "TRV", "name": "여비교통비", "name_en": "Travel", "description": "출장, 교통", "is_deductible": True, "sort_order": 11},
    {"code": "INS", "name": "보험료", "name_en": "Insurance", "description": "사업 관련 보험", "is_deductible": True, "sort_order": 12},
    {"code": "TAX", "name": "세금과공과", "name_en": "Taxes", "description": "세금, 공과금", "is_deductible": True, "sort_order": 13},
    {"code": "DEP", "name": "감가상각비", "name_en": "Depreciation", "description": "자산 감가상각", "is_deductible": True, "sort_order": 14},
    {"code": "OTH", "name": "기타", "name_en": "Others", "description": "기타 경비", "is_deductible": True, "sort_order": 15},
    {"code": "NON", "name": "비용처리불가", "name_en": "Non-deductible", "description": "개인 지출", "is_deductible": False, "sort_order": 99},
]

# 요금제 초기 데이터
PLANS_DATA = [
    {
        "code": "free",
        "name": "무료",
        "description": "기본 기능 무료 체험",
        "price": 0,
        "features": {"chat": True, "expense": True, "ledger": True, "web_chat": False},
        "limits": {"chat_monthly": 10, "expense_monthly": 30, "export_monthly": 1},
        "sort_order": 1,
    },
    {
        "code": "basic",
        "name": "베이직",
        "description": "1인 사업자를 위한 기본 플랜",
        "price": 9900,
        "features": {"chat": True, "expense": True, "ledger": True, "web_chat": True},
        "limits": {"chat_monthly": -1, "expense_monthly": -1, "export_monthly": -1},
        "sort_order": 2,
    },
    {
        "code": "pro",
        "name": "프로",
        "description": "OCR 기능 포함 프로 플랜",
        "price": 19900,
        "features": {"chat": True, "expense": True, "ledger": True, "web_chat": True, "ocr": True},
        "limits": {"chat_monthly": -1, "expense_monthly": -1, "export_monthly": -1, "ocr_monthly": 100},
        "sort_order": 3,
    },
    {
        "code": "premium",
        "name": "프리미엄",
        "description": "세무사 상담 포함 프리미엄 플랜",
        "price": 39900,
        "features": {"chat": True, "expense": True, "ledger": True, "web_chat": True, "ocr": True, "advisor": True},
        "limits": {"chat_monthly": -1, "expense_monthly": -1, "export_monthly": -1, "ocr_monthly": -1, "advisor_monthly": 2},
        "sort_order": 4,
    },
]


async def seed_categories(db: AsyncSession):
    """계정과목 초기 데이터 생성"""
    from sqlalchemy import select

    # 기존 데이터 확인
    result = await db.execute(select(Category).limit(1))
    if result.scalar_one_or_none():
        print("Categories already seeded, skipping...")
        return

    for data in CATEGORIES_DATA:
        category = Category(**data)
        db.add(category)

    await db.commit()
    print(f"Seeded {len(CATEGORIES_DATA)} categories")


async def seed_plans(db: AsyncSession):
    """요금제 초기 데이터 생성"""
    from sqlalchemy import select

    # 기존 데이터 확인
    result = await db.execute(select(Plan).limit(1))
    if result.scalar_one_or_none():
        print("Plans already seeded, skipping...")
        return

    for data in PLANS_DATA:
        plan = Plan(**data)
        db.add(plan)

    await db.commit()
    print(f"Seeded {len(PLANS_DATA)} plans")


async def seed_admin(db: AsyncSession):
    """관리자 계정 초기 데이터 생성"""
    from sqlalchemy import select

    # 기존 관리자 확인
    result = await db.execute(
        select(User).where(User.email == ADMIN_DATA["email"])
    )
    if result.scalar_one_or_none():
        print("Admin already exists, skipping...")
        return

    # 관리자 계정 생성
    admin = User(
        email=ADMIN_DATA["email"],
        password_hash=get_password_hash(ADMIN_DATA["password"]),
        name=ADMIN_DATA["name"],
        is_admin=ADMIN_DATA["is_admin"],
        business_type=ADMIN_DATA["business_type"],
        status=ADMIN_DATA["status"],
        provider="email",
        email_verified_at=datetime.utcnow(),
    )
    db.add(admin)
    await db.flush()

    # 관리자에게 프리미엄 플랜 부여
    result = await db.execute(select(Plan).where(Plan.code == "premium"))
    premium_plan = result.scalar_one_or_none()

    if premium_plan:
        subscription = Subscription(
            user_id=admin.id,
            plan_id=premium_plan.id,
            status="active",
            started_at=datetime.utcnow(),
        )
        db.add(subscription)

    await db.commit()
    print(f"Seeded admin user: {ADMIN_DATA['email']}")


async def run_seeds(db: AsyncSession):
    """모든 시드 데이터 실행"""
    await seed_categories(db)
    await seed_plans(db)
    await seed_admin(db)
    print("All seeds completed!")

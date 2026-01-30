import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface ContactFormData {
  name: string;
  email: string;
  type: 'general' | 'pricing' | 'partnership' | 'bug';
  message: string;
}

interface ContactEntry extends ContactFormData {
  id: string;
  createdAt: string;
  status: 'pending' | 'read' | 'replied';
}

// 문의 데이터 저장 경로
const DATA_DIR = path.join(process.cwd(), 'data');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

// 데이터 디렉토리 및 파일 초기화
async function initDataFile(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }

  try {
    await fs.access(CONTACTS_FILE);
  } catch {
    await fs.writeFile(CONTACTS_FILE, JSON.stringify([], null, 2));
  }
}

// 문의 목록 불러오기
async function getContacts(): Promise<ContactEntry[]> {
  await initDataFile();
  const data = await fs.readFile(CONTACTS_FILE, 'utf-8');
  return JSON.parse(data);
}

// 문의 저장하기
async function saveContact(contact: ContactEntry): Promise<void> {
  const contacts = await getContacts();
  contacts.push(contact);
  await fs.writeFile(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
}

// 입력값 검증
function validateInput(data: Partial<ContactFormData>): { valid: boolean; error?: string } {
  if (!data.name || data.name.trim().length < 2) {
    return { valid: false, error: '이름을 2자 이상 입력해주세요.' };
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { valid: false, error: '올바른 이메일 주소를 입력해주세요.' };
  }

  const validTypes = ['general', 'pricing', 'partnership', 'bug'];
  if (!data.type || !validTypes.includes(data.type)) {
    return { valid: false, error: '문의 유형을 선택해주세요.' };
  }

  if (!data.message || data.message.trim().length < 10) {
    return { valid: false, error: '문의 내용을 10자 이상 입력해주세요.' };
  }

  return { valid: true };
}

// UUID 생성 (간단한 버전)
function generateId(): string {
  return `contact_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Partial<ContactFormData>;

    // 입력값 검증
    const validation = validateInput(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // 문의 엔트리 생성
    const contactEntry: ContactEntry = {
      id: generateId(),
      name: body.name!.trim(),
      email: body.email!.trim().toLowerCase(),
      type: body.type!,
      message: body.message!.trim(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    // 문의 저장
    await saveContact(contactEntry);

    // TODO: 이메일 알림 기능 (추후 구현)
    // await sendEmailNotification(contactEntry);

    return NextResponse.json({
      success: true,
      message: '문의가 정상적으로 접수되었습니다.',
      id: contactEntry.id,
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}

// GET: 문의 목록 조회 (관리자용 - 추후 인증 추가 필요)
export async function GET(request: NextRequest) {
  try {
    // TODO: 관리자 인증 체크 추가
    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get('adminKey');

    // 간단한 보안 (실제 운영시에는 더 강력한 인증 필요)
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { success: false, error: '권한이 없습니다.' },
        { status: 403 }
      );
    }

    const contacts = await getContacts();

    return NextResponse.json({
      success: true,
      data: contacts.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
      total: contacts.length,
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

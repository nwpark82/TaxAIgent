'use client';

import {
  MessageSquare,
  Plus,
  FileText,
  Settings,
  Home,
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Calculator,
  Send,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Menu,
  Search,
  Bell,
  User,
  Users,
  LogOut,
  Calendar,
  Clock,
  Download,
  Upload,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Filter,
  MoreVertical,
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  Info,
  HelpCircle,
  Star,
  Heart,
  Bookmark,
  Share2,
  Copy,
  ExternalLink,
  Loader2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  BookOpen,
  Sun,
  Moon,
  Monitor,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// 아이콘 사이즈 맵
const sizeMap = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

interface IconProps {
  className?: string;
  size?: keyof typeof sizeMap;
}

// 아이콘 래퍼 컴포넌트 생성 함수
function createIcon(LucideIcon: LucideIcon) {
  const IconComponent = ({ className, size = 'md' }: IconProps) => {
    return <LucideIcon className={cn(sizeMap[size], className)} />;
  };
  IconComponent.displayName = LucideIcon.displayName || 'Icon';
  return IconComponent;
}

// 앱에서 사용할 아이콘 export (PascalCase)
export const Icons = {
  // 네비게이션
  Home: createIcon(Home),
  Chat: createIcon(MessageSquare),
  Expense: createIcon(Wallet),
  Ledger: createIcon(FileText),
  Settings: createIcon(Settings),
  Menu: createIcon(Menu),

  // 액션
  Add: createIcon(Plus),
  Send: createIcon(Send),
  Edit: createIcon(Edit2),
  Delete: createIcon(Trash2),
  Download: createIcon(Download),
  Upload: createIcon(Upload),
  Search: createIcon(Search),
  Filter: createIcon(Filter),
  Refresh: createIcon(RefreshCw),
  Copy: createIcon(Copy),
  Share: createIcon(Share2),
  ExternalLink: createIcon(ExternalLink),

  // 상태
  Check: createIcon(Check),
  Close: createIcon(X),
  Success: createIcon(CheckCircle),
  Error: createIcon(AlertCircle),
  Warning: createIcon(AlertCircle),
  Info: createIcon(Info),
  Help: createIcon(HelpCircle),

  // 방향
  ChevronRight: createIcon(ChevronRight),
  ChevronLeft: createIcon(ChevronLeft),
  ChevronDown: createIcon(ChevronDown),
  ChevronUp: createIcon(ChevronUp),

  // 기타 UI
  User: createIcon(User),
  Users: createIcon(Users),
  Logout: createIcon(LogOut),
  Bell: createIcon(Bell),
  Calendar: createIcon(Calendar),
  Clock: createIcon(Clock),
  Eye: createIcon(Eye),
  EyeOff: createIcon(EyeOff),
  More: createIcon(MoreVertical),
  MoreHorizontal: createIcon(MoreHorizontal),
  Star: createIcon(Star),
  Heart: createIcon(Heart),
  Bookmark: createIcon(Bookmark),
  Sparkles: createIcon(Sparkles),
  ArrowRight: createIcon(ArrowRight),

  // 비즈니스
  TrendingUp: createIcon(TrendingUp),
  TrendingDown: createIcon(TrendingDown),
  PiggyBank: createIcon(PiggyBank),
  Calculator: createIcon(Calculator),
  Blog: createIcon(BookOpen),

  // 테마
  Sun: createIcon(Sun),
  Moon: createIcon(Moon),
  Monitor: createIcon(Monitor),

  // 로딩
  Loader: ({ className, size = 'md' }: IconProps) => (
    <Loader2 className={cn(sizeMap[size], 'animate-spin', className)} />
  ),
};

// 타입 export
export type IconName = keyof typeof Icons;

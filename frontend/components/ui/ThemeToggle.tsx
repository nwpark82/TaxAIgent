'use client';

import { useThemeStore } from '@/stores/themeStore';
import { Icons } from './Icons';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useThemeStore();

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    if (theme === 'system') {
      return <Icons.Monitor className="w-5 h-5" />;
    }
    if (theme === 'dark') {
      return <Icons.Moon className="w-5 h-5" />;
    }
    return <Icons.Sun className="w-5 h-5" />;
  };

  const getLabel = () => {
    if (theme === 'system') return '시스템';
    if (theme === 'dark') return '다크';
    return '라이트';
  };

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      title={`현재: ${getLabel()} 모드`}
    >
      {getIcon()}
      <span className="text-sm hidden sm:inline">{getLabel()}</span>
    </button>
  );
}

'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Icons } from './Icons';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    label?: string;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

const variantStyles = {
  default: {
    card: 'card',
    icon: 'bg-gray-100 text-gray-600',
    value: 'text-gray-900',
  },
  primary: {
    card: 'card bg-gradient-to-br from-primary-500 to-primary-600',
    icon: 'bg-white/20 text-white',
    value: 'text-white',
  },
  success: {
    card: 'card card-success',
    icon: 'bg-success-100 text-success-600',
    value: 'text-success-600',
  },
  warning: {
    card: 'card card-warning',
    icon: 'bg-warning-100 text-warning-600',
    value: 'text-warning-600',
  },
  error: {
    card: 'card card-error',
    icon: 'bg-error-100 text-error-600',
    value: 'text-error-600',
  },
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  className,
}: StatsCardProps) {
  const styles = variantStyles[variant];
  const isPrimary = variant === 'primary';

  return (
    <div className={cn(styles.card, 'relative overflow-hidden', className)}>
      {/* 배경 장식 (primary 전용) */}
      {isPrimary && (
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full" />
      )}

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className={cn(
            'text-sm font-medium mb-1',
            isPrimary ? 'text-white/80' : 'text-gray-500'
          )}>
            {title}
          </p>
          <p className={cn(
            'text-2xl lg:text-3xl font-bold tracking-tight',
            styles.value
          )}>
            {value}
          </p>

          {/* 트렌드 표시 */}
          {trend && (
            <div className={cn(
              'flex items-center gap-1 mt-2',
              isPrimary ? 'text-white/90' : ''
            )}>
              {trend.value >= 0 ? (
                <Icons.TrendingUp
                  size="sm"
                  className={cn(
                    isPrimary ? 'text-white' : 'text-success-500'
                  )}
                />
              ) : (
                <Icons.TrendingDown
                  size="sm"
                  className={cn(
                    isPrimary ? 'text-white' : 'text-error-500'
                  )}
                />
              )}
              <span className={cn(
                'text-sm font-medium',
                !isPrimary && (trend.value >= 0 ? 'text-success-600' : 'text-error-600')
              )}>
                {trend.value >= 0 ? '+' : ''}{trend.value}%
              </span>
              {trend.label && (
                <span className={cn(
                  'text-sm',
                  isPrimary ? 'text-white/70' : 'text-gray-400'
                )}>
                  {trend.label}
                </span>
              )}
            </div>
          )}

          {/* 부가 설명 */}
          {subtitle && (
            <p className={cn(
              'text-sm mt-2',
              isPrimary ? 'text-white/70' : 'text-gray-400'
            )}>
              {subtitle}
            </p>
          )}
        </div>

        {/* 아이콘 */}
        {icon && (
          <div className={cn(
            'p-3 rounded-xl',
            styles.icon
          )}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

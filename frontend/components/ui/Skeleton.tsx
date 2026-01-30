'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-xl',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'skeleton-wave',
    none: '',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    />
  );
}

// Pre-built skeleton patterns
export function SkeletonCard() {
  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" height={16} className="w-3/4" />
          <Skeleton variant="text" height={12} className="w-1/2" />
        </div>
      </div>
      <Skeleton variant="rounded" height={100} className="w-full" />
      <div className="flex gap-2">
        <Skeleton variant="rounded" height={32} className="w-20" />
        <Skeleton variant="rounded" height={32} className="w-20" />
      </div>
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="card p-4 space-y-3">
          <Skeleton variant="text" height={14} className="w-1/2" />
          <Skeleton variant="text" height={28} className="w-3/4" />
          <Skeleton variant="rounded" height={8} className="w-full" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="card p-4 flex items-center gap-4">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" height={16} className="w-3/4" />
            <Skeleton variant="text" height={12} className="w-1/2" />
          </div>
          <Skeleton variant="text" height={20} width={80} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChat() {
  return (
    <div className="space-y-4">
      {/* AI message */}
      <div className="flex gap-3">
        <Skeleton variant="circular" width={32} height={32} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="rounded" height={60} className="w-4/5" />
          <Skeleton variant="text" height={10} className="w-16" />
        </div>
      </div>
      {/* User message */}
      <div className="flex gap-3 justify-end">
        <div className="flex-1 space-y-2 flex flex-col items-end">
          <Skeleton variant="rounded" height={40} className="w-3/5" />
          <Skeleton variant="text" height={10} className="w-16" />
        </div>
        <Skeleton variant="circular" width={32} height={32} />
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Icons } from './Icons';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Convenience functions
export function toast(options: Omit<Toast, 'id'>) {
  // This will be set by the provider
  if (typeof window !== 'undefined' && (window as any).__toast) {
    (window as any).__toast(options);
  }
}

toast.success = (title: string, description?: string) => {
  toast({ type: 'success', title, description });
};

toast.error = (title: string, description?: string) => {
  toast({ type: 'error', title, description });
};

toast.warning = (title: string, description?: string) => {
  toast({ type: 'warning', title, description });
};

toast.info = (title: string, description?: string) => {
  toast({ type: 'info', title, description });
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    const duration = toast.duration || 4000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Expose toast function globally for convenience
  useEffect(() => {
    (window as any).__toast = addToast;
    return () => {
      delete (window as any).__toast;
    };
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 200);
  };

  const typeConfig = {
    success: {
      icon: Icons.Success,
      bgClass: 'bg-success-50 dark:bg-success-900/30',
      borderClass: 'border-success-200 dark:border-success-800',
      iconClass: 'text-success-500',
      titleClass: 'text-success-900 dark:text-success-100',
    },
    error: {
      icon: Icons.Error,
      bgClass: 'bg-error-50 dark:bg-error-900/30',
      borderClass: 'border-error-200 dark:border-error-800',
      iconClass: 'text-error-500',
      titleClass: 'text-error-900 dark:text-error-100',
    },
    warning: {
      icon: Icons.Warning,
      bgClass: 'bg-warning-50 dark:bg-warning-900/30',
      borderClass: 'border-warning-200 dark:border-warning-800',
      iconClass: 'text-warning-500',
      titleClass: 'text-warning-900 dark:text-warning-100',
    },
    info: {
      icon: Icons.Info,
      bgClass: 'bg-primary-50 dark:bg-primary-900/30',
      borderClass: 'border-primary-200 dark:border-primary-800',
      iconClass: 'text-primary-500',
      titleClass: 'text-primary-900 dark:text-primary-100',
    },
  };

  const config = typeConfig[toast.type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-200',
        config.bgClass,
        config.borderClass,
        isExiting ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0 animate-slide-in-right'
      )}
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.iconClass)} />
      <div className="flex-1 min-w-0">
        <p className={cn('font-medium text-sm', config.titleClass)}>{toast.title}</p>
        {toast.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{toast.description}</p>
        )}
      </div>
      <button
        onClick={handleRemove}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <Icons.Close className="w-4 h-4" />
      </button>
    </div>
  );
}

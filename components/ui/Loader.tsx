import { cn } from '@/lib/utils';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

export default function Loader({ size = 'md', className, text }: LoaderProps) {
  const sizeStyles = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={cn('spinner', sizeStyles[size], className)} />
      {text && <p className="text-sm text-neutral-600">{text}</p>}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="text-center">
        <Loader size="xl" />
        <p className="mt-4 text-lg font-medium text-neutral-700">Chargement...</p>
      </div>
    </div>
  );
}

export function SkeletonLoader({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} />;
}



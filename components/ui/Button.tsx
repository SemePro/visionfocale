import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
      primary:
        'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-md hover:shadow-lg hover:shadow-glow-purple',
      secondary:
        'bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700',
      outline:
        'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100',
      ghost: 'text-primary-500 hover:bg-primary-50 active:bg-primary-100',
      danger:
        'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-md hover:shadow-lg',
      success:
        'bg-green-500 text-white hover:bg-green-600 active:bg-green-700 shadow-md hover:shadow-lg',
    };

    const sizeStyles = {
      sm: 'px-4 py-2 text-sm rounded-md gap-2',
      md: 'px-6 py-3 text-base rounded-lg gap-2',
      lg: 'px-8 py-4 text-lg rounded-xl gap-3',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
            <span>Chargement...</span>
          </>
        ) : (
          <>
            {leftIcon && leftIcon}
            {children}
            {rightIcon && rightIcon}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;



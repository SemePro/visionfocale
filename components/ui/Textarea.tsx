import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, disabled, leftIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-3 text-neutral-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <textarea
            className={cn(
              'input min-h-[120px] resize-y',
              leftIcon && 'pl-10',
              error && 'border-red-500 focus:ring-red-500',
              disabled && 'bg-neutral-100 cursor-not-allowed',
              className
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        {helperText && !error && <p className="mt-2 text-sm text-neutral-500">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;



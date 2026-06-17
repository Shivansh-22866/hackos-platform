import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink-muted font-mono">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full rounded-lg border bg-surface px-3 py-2.5 text-sm text-ink placeholder-ink-faint transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent',
            error ? 'border-red-500' : 'border-surface-border hover:border-ink-faint',
            className
          )}
          {...rest}
        />
        {error && <p className="text-xs text-red-400 font-mono">{error}</p>}
        {hint && !error && <p className="text-xs text-ink-faint">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink-muted font-mono">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full rounded-lg border bg-surface px-3 py-2.5 text-sm text-ink placeholder-ink-faint transition-colors resize-none',
            'focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent',
            error ? 'border-red-500' : 'border-surface-border hover:border-ink-faint',
            className
          )}
          {...rest}
        />
        {error && <p className="text-xs text-red-400 font-mono">{error}</p>}
        {hint && !error && <p className="text-xs text-ink-faint">{hint}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

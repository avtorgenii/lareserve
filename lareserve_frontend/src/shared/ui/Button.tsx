import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border-primary bg-primary text-white hover:bg-primary-hover focus-visible:ring-primary/35',
  secondary:
    'border-border bg-surface text-text hover:border-border-hover hover:bg-surface-subtle focus-visible:ring-primary/25',
  danger:
    'border-danger-border bg-danger-bg text-danger hover:bg-danger-bg/80 focus-visible:ring-danger/30',
  ghost:
    'border-transparent bg-transparent text-text-subtle hover:bg-surface-subtle hover:text-text focus-visible:ring-primary/25',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-9 px-4 text-sm',
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(' ');
}

export default function Button({
  variant = 'secondary',
  size = 'md',
  type = 'button',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border font-medium transition-colors outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-55',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}

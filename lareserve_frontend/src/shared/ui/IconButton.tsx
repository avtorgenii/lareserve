import type { ButtonHTMLAttributes } from 'react';

type IconButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type IconButtonSize = 'sm' | 'md';

const variantClasses: Record<IconButtonVariant, string> = {
  primary:
    'border-primary bg-primary text-white hover:bg-primary-hover focus-visible:ring-primary/35',
  secondary:
    'border-border bg-surface text-text-subtle hover:border-border-hover hover:text-text focus-visible:ring-primary/25',
  danger:
    'border-danger-border bg-danger-bg text-danger hover:bg-danger-bg/80 focus-visible:ring-danger/30',
  ghost:
    'border-transparent bg-transparent text-text-subtle hover:bg-surface-subtle hover:text-text focus-visible:ring-primary/25',
};

const sizeClasses: Record<IconButtonSize, string> = {
  sm: 'h-6 w-6 text-sm',
  md: 'h-8 w-8 text-sm',
};

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(' ');
}

export default function IconButton({
  variant = 'secondary',
  size = 'md',
  type = 'button',
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex cursor-pointer shrink-0 items-center justify-center rounded-md border font-medium transition-colors outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-55',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}

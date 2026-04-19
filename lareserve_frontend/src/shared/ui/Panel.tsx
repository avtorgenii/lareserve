import type { HTMLAttributes } from 'react';

type PanelTone = 'default' | 'subtle';
type PanelPadding = 'none' | 'sm' | 'md';

const toneClasses: Record<PanelTone, string> = {
  default: 'border-border bg-surface',
  subtle: 'border-border bg-surface-subtle',
};

const paddingClasses: Record<PanelPadding, string> = {
  none: '',
  sm: 'p-2',
  md: 'p-3',
};

type PanelProps = HTMLAttributes<HTMLDivElement> & {
  tone?: PanelTone;
  padding?: PanelPadding;
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(' ');
}

export default function Panel({
  tone = 'default',
  padding = 'md',
  className,
  ...props
}: PanelProps) {
  return (
    <div
      className={cx('rounded-lg border', toneClasses[tone], paddingClasses[padding], className)}
      {...props}
    />
  );
}

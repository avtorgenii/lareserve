import type { HTMLAttributes } from 'react';

type SectionLabelProps = HTMLAttributes<HTMLParagraphElement>;

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(' ');
}

export default function SectionLabel({ className, ...props }: SectionLabelProps) {
  return (
    <p
      className={cx('text-xs font-semibold uppercase tracking-wide text-text-muted', className)}
      {...props}
    />
  );
}

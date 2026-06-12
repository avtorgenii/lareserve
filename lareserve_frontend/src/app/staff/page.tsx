import Link from 'next/link';

import { AuthGuard } from '@/features/auth/ui/AuthGuard';
import { AuthActionButton } from '@/features/auth/ui/GoogleSignInButton';
import StaffViewPage from '@/features/staffView/ui/StaffViewPage';
import AppLayout from '@/shared/ui/AppLayout';

export default function StaffPage() {
  const today = new Date().toLocaleDateString('pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <AuthGuard>
      <AppLayout
        rightSlot={
          <div className="flex items-center gap-4">
            <span>{today}</span>
            <Link
              href="/editor"
              className="rounded-lg border border-border bg-white px-4 py-1.5 text-sm font-medium text-text hover:bg-surface-subtle"
            >
              Edytuj plan
            </Link>
            <AuthActionButton />
          </div>
        }
      >
        <StaffViewPage />
      </AppLayout>
    </AuthGuard>
  );
}

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
    <AppLayout rightSlot={today}>
      <StaffViewPage />
    </AppLayout>
  );
}

import CustomerReservationPage from '@/features/customerReservation/ui/CustomerReservationPage';
import AppLayout from '@/shared/ui/AppLayout';

export default function Home() {
  return (
    <AppLayout>
      <CustomerReservationPage />
    </AppLayout>
  );
}

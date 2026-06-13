export type Step = 1 | 2 | 3;

export type ReservationForm = {
  guestName: string;
  phone: string;
  email: string;
  specialRequests: string;
};

export const STEP_LABELS: Record<Step, string> = {
  1: 'Data & Czas',
  2: 'Wybierz stolik',
  3: 'Potwierdzenie',
};

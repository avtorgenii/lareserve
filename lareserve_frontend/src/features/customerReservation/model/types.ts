export type Step = 1 | 2 | 3;

export type ReservationForm = {
  guestName: string;
  phone: string;
  email: string;
  specialRequests: string;
};

export const FLOORS = [
  { id: 'ground', label: 'Parter' },
  { id: 'floor1', label: 'Piętro 1', disabled: true },
];

export const FLOOR_LABELS: Record<string, string> = {
  ground: 'Parter',
  floor1: 'Piętro 1',
};

export const STEP_LABELS: Record<Step, string> = {
  1: 'Data & Czas',
  2: 'Wybierz stolik',
  3: 'Potwierdzenie',
};

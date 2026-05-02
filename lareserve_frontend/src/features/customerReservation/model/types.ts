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

export const AVAILABLE_TIMES = [
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
];

export const MOCK_DATES = [
  'Piątek 27 marca 2026',
  'Sobota 28 marca 2026',
  'Niedziela 29 marca 2026',
  'Poniedziałek 30 marca 2026',
  'Wtorek 31 marca 2026',
];

export const STEP_LABELS: Record<Step, string> = {
  1: 'Data & Czas',
  2: 'Wybierz stolik',
  3: 'Potwierdzenie',
};

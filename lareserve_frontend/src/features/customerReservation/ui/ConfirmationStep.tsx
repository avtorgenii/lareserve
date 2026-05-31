import type { ReservationForm } from '../model/types';

type ConfirmationStepProps = {
  date: string;
  time: string;
  tableLabel: string;
  tableFloor: string;
  form: ReservationForm;
  onGoBack: () => void;
  onConfirm: () => void;
};

export default function ConfirmationStep({
  date,
  time,
  tableLabel,
  tableFloor,
  form,
  onGoBack,
  onConfirm,
}: ConfirmationStepProps) {
  const rows = [
    { label: 'Data', value: date },
    { label: 'Godzina', value: time },
    { label: 'Stolik', value: `${tableLabel} · ${tableFloor}` },
    { label: 'Imię i nazwisko', value: form.guestName },
    { label: 'Numer telefonu', value: form.phone },
    { label: 'Adres e-mail', value: form.email },
    ...(form.specialRequests
      ? [{ label: 'Wymagania specjalne', value: form.specialRequests }]
      : []),
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto bg-surface-subtle px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h2 className="mb-1 text-xl font-semibold text-text">Potwierdź rezerwację</h2>
        <p className="mb-8 text-sm text-text-muted">Sprawdź szczegóły przed wysłaniem.</p>

        <dl className="mb-8 divide-y divide-border rounded-xl border border-border">
          {rows.map(({ label, value }) => (
            <div key={label} className="flex justify-between px-4 py-3">
              <dt className="text-sm text-text-muted">{label}</dt>
              <dd className="text-sm font-medium text-text">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            Potwierdź rezerwację
          </button>
          <button
            onClick={onGoBack}
            className="w-full rounded-lg border border-border py-3 text-sm font-medium text-text-muted hover:bg-surface-subtle"
          >
            Wróć i zmień
          </button>
        </div>
      </div>
    </div>
  );
}

import { MOCK_DATES, AVAILABLE_TIMES } from '../model/types';

type DateTimePickerProps = {
  date: string;
  time: string;
  onDateChange: (d: string) => void;
  onTimeChange: (t: string) => void;
  onConfirm: () => void;
};

export default function DateTimePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
  onConfirm,
}: DateTimePickerProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-surface-subtle px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-text">Wybierz datę i czas</h2>

        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Data</p>
          <div className="flex flex-col gap-2">
            {MOCK_DATES.map((d) => (
              <button
                key={d}
                onClick={() => onDateChange(d)}
                className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                  date === d
                    ? 'border-primary bg-primary/5 font-medium text-primary'
                    : 'border-border text-text hover:bg-surface-subtle'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Godzina
          </p>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TIMES.map((t) => (
              <button
                key={t}
                onClick={() => onTimeChange(t)}
                className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                  time === t
                    ? 'border-primary bg-primary text-white'
                    : 'border-border text-text hover:bg-surface-subtle'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onConfirm}
          disabled={!date || !time}
          className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          Dalej — wybierz stolik
        </button>
      </div>
    </div>
  );
}

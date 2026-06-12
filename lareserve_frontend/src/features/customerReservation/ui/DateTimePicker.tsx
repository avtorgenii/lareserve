/** Converts an ISO date string (e.g. "2026-05-13") to a Polish locale label. */
function formatDatePolish(isoDate: string): string {
  // Use noon to avoid timezone-shift edge cases
  const date = new Date(`${isoDate}T12:00:00`);
  const raw = date.toLocaleDateString('pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  // Remove comma that some engines add after the weekday name
  const cleaned = raw.replace(',', '');
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

type DateTimePickerProps = {
  /** Available ISO date strings from the API, e.g. ["2026-05-13", ...] */
  dates: string[];
  /** Time-slot availability from the API, e.g. { "11:00": true, "12:00": false } */
  times: Record<string, boolean>;
  /** Currently selected ISO date string */
  date: string;
  /** Currently selected time "HH:MM" */
  time: string;
  datesLoading?: boolean;
  timesLoading?: boolean;
  onDateChange: (d: string) => void;
  onTimeChange: (t: string) => void;
  onConfirm: () => void;
};

export default function DateTimePicker({
  dates,
  times,
  date,
  time,
  datesLoading = false,
  timesLoading = false,
  onDateChange,
  onTimeChange,
  onConfirm,
}: DateTimePickerProps) {
  const safeDates = Array.isArray(dates) ? dates : [];

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto bg-surface-subtle px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-text">Wybierz datę i czas</h2>

        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Data</p>
          {datesLoading ? (
            <p className="text-sm text-text-muted">Ładowanie...</p>
          ) : (
            <div className="flex flex-col gap-2">
              {safeDates.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => onDateChange(d)}
                  className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                    date === d
                      ? 'border-primary bg-primary/5 font-medium text-primary'
                      : 'border-border text-text hover:bg-surface-subtle'
                  }`}
                >
                  {formatDatePolish(d)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Godzina
          </p>
          {timesLoading ? (
            <p className="text-sm text-text-muted">Ładowanie...</p>
          ) : Object.keys(times).length === 0 ? (
            <p className="text-sm text-text-muted">Brak dostępnych godzin dla tej daty.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {Object.entries(times).map(([t, available]) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => available && onTimeChange(t)}
                  disabled={!available}
                  className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                    time === t
                      ? 'border-primary bg-primary text-white'
                      : available
                        ? 'border-border text-text hover:bg-surface-subtle'
                        : 'cursor-not-allowed border-border text-text-muted opacity-40'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onConfirm}
          disabled={!date || !time || datesLoading || timesLoading}
          className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          Dalej
        </button>
      </div>
    </div>
  );
}

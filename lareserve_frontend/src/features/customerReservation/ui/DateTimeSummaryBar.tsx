type DateTimeSummaryBarProps = {
  date: string;
  time: string;
  onChangeClick: () => void;
};

export default function DateTimeSummaryBar({ date, time, onChangeClick }: DateTimeSummaryBarProps) {
  return (
    <div className="relative flex items-center justify-center bg-emerald-50 px-6 py-3">
      <span className="text-sm font-semibold text-emerald-900">
        {date} · {time}
      </span>
      <button
        onClick={onChangeClick}
        className="absolute right-6 rounded border border-emerald-300 bg-white px-3 py-1 text-xs text-text-muted hover:bg-surface-subtle"
      >
        Zmień
      </button>
    </div>
  );
}

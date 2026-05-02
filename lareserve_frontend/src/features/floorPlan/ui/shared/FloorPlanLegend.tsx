type LegendVariant = 'customer' | 'staff';

const LEGEND_ITEMS: Record<LegendVariant, { label: string; color: string }[]> = {
  customer: [
    { label: 'Dostępny', color: '#a3a3a3' },
    { label: 'Wybrany', color: '#10b981' },
    { label: 'Niedostępny', color: '#fb7185' },
  ],
  staff: [
    { label: 'Wolny', color: '#a3a3a3' },
    { label: 'Zarezerwowany', color: '#10b981' },
    { label: 'Zajęty', color: '#fb7185' },
  ],
};

type FloorPlanLegendProps = {
  variant: LegendVariant;
};

export default function FloorPlanLegend({ variant }: FloorPlanLegendProps) {
  return (
    <div className="flex items-center gap-4">
      {LEGEND_ITEMS[variant].map(({ label, color }) => (
        <div key={label} className="flex items-center gap-1.5">
          <span
            className="inline-block h-3.5 w-3.5 rounded-full border-2"
            style={{ borderColor: color, backgroundColor: `${color}22` }}
          />
          <span className="text-xs text-text-muted">{label}</span>
        </div>
      ))}
    </div>
  );
}

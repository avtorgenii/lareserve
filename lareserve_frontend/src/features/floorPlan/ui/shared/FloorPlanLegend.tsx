type LegendVariant = 'customer' | 'staff';

type LegendItem = {
  label: string;
  strokeVar: string;
  fillVar: string;
};

const LEGEND_ITEMS: Record<LegendVariant, LegendItem[]> = {
  customer: [
    {
      label: 'Dostępny',
      strokeVar: '--color-status-available-stroke',
      fillVar: '--color-status-available-fill',
    },
    {
      label: 'Zajęty',
      strokeVar: '--color-status-occupied-stroke',
      fillVar: '--color-status-occupied-fill',
    },
  ],
  staff: [
    {
      label: 'Wolny',
      strokeVar: '--color-status-available-stroke',
      fillVar: '--color-status-available-fill',
    },
    {
      label: 'Zarezerwowany',
      strokeVar: '--color-status-reserved-stroke',
      fillVar: '--color-status-reserved-fill',
    },
    {
      label: 'Zajęty',
      strokeVar: '--color-status-occupied-stroke',
      fillVar: '--color-status-occupied-fill',
    },
  ],
};

type FloorPlanLegendProps = {
  variant: LegendVariant;
};

export default function FloorPlanLegend({ variant }: FloorPlanLegendProps) {
  return (
    <div className="flex items-center gap-4">
      {LEGEND_ITEMS[variant].map(({ label, strokeVar, fillVar }) => (
        <div key={label} className="flex items-center gap-1.5">
          <span
            className="inline-block h-3.5 w-3.5 rounded-full border-2"
            style={{
              borderColor: `var(${strokeVar})`,
              backgroundColor: `var(${fillVar})`,
            }}
          />
          <span className="text-xs text-text-muted">{label}</span>
        </div>
      ))}
    </div>
  );
}

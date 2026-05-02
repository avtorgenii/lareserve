type Floor = {
  id: string;
  label: string;
  disabled?: boolean;
};

type FloorSelectorProps = {
  floors: Floor[];
  activeFloorId: string;
  onChange: (floorId: string) => void;
  variant?: 'tabs' | 'pills';
};

export default function FloorSelector({
  floors,
  activeFloorId,
  onChange,
  variant = 'pills',
}: FloorSelectorProps) {
  if (variant === 'tabs') {
    return (
      <div className="flex gap-2">
        {floors.map((floor) => (
          <button
            key={floor.id}
            onClick={() => !floor.disabled && onChange(floor.id)}
            disabled={floor.disabled}
            className={`rounded px-4 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              floor.id === activeFloorId
                ? 'bg-primary text-white'
                : 'border border-border bg-white text-text-muted hover:bg-surface-subtle'
            }`}
          >
            {floor.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {floors.map((floor) => (
        <button
          key={floor.id}
          onClick={() => !floor.disabled && onChange(floor.id)}
          disabled={floor.disabled}
          className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            floor.id === activeFloorId
              ? 'bg-primary text-white'
              : 'text-text-muted hover:bg-surface-subtle hover:text-text'
          }`}
        >
          {floor.label}
        </button>
      ))}
    </div>
  );
}

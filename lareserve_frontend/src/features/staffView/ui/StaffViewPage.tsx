'use client';

import { useState } from 'react';

import { zoomIn, zoomOut } from '@/features/floorPlan/model/floorPlanSlice';
import { selectFloorPlanElements, selectViewportScale } from '@/features/floorPlan/model/selectors';
import FloorPlanCanvas from '@/features/floorPlan/ui/FloorPlanCanvas';
import FloorPlanLegend from '@/features/floorPlan/ui/shared/FloorPlanLegend';
import FloorSelector from '@/features/floorPlan/ui/shared/FloorSelector';
import {
  selectTableStatusCounts,
  selectTableStatusesById,
  selectTodaysReservations,
  selectReservationsForTable,
  selectTableStatusesByLabel,
} from '@/features/reservations/model/selectors';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const FLOORS = [
  { id: 'ground', label: 'Parter' },
  { id: 'floor1', label: 'Piętro 1', disabled: true },
];

const STATUS_LABELS = {
  available: 'Wolny',
  reserved: 'Zarezerwowany',
  occupied: 'Zajęty',
} as const;

const STATUS_COLORS = {
  available: { bg: 'bg-neutral-100', text: 'text-neutral-500', border: 'border-neutral-300' },
  reserved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300' },
  occupied: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-300' },
} as const;

const RESERVATION_STATUS_LABELS = {
  upcoming: 'nadchodzi',
  current: 'teraz',
  completed: 'zakończona',
} as const;

const RESERVATION_STATUS_COLORS = {
  upcoming: 'bg-neutral-100 text-neutral-600',
  current: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-neutral-100 text-neutral-400',
} as const;

export default function StaffViewPage() {
  const dispatch = useAppDispatch();
  const [activeFloorId, setActiveFloorId] = useState('ground');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const elements = useAppSelector(selectFloorPlanElements);
  const tableStatuses = useAppSelector(selectTableStatusesById);
  const statusCounts = useAppSelector(selectTableStatusCounts);
  const todaysReservations = useAppSelector(selectTodaysReservations);
  const viewportScale = useAppSelector(selectViewportScale);
  const statusesByLabel = useAppSelector(selectTableStatusesByLabel);

  const selectedElement = selectedElementId
    ? elements.find((el) => el.id === selectedElementId)
    : null;

  const tableReservations = useAppSelector((state) =>
    selectedElement ? selectReservationsForTable(state, selectedElement.label) : []
  );

  const selectedTableStatus = selectedElement ? statusesByLabel[selectedElement.label] : undefined;

  const handleTableClick = (elementId: string) => {
    setSelectedElementId((prev) => (prev === elementId ? null : elementId));
  };

  return (
    <div className="flex min-h-0 flex-1">
      {/* Left sidebar */}
      <aside className="flex w-56 shrink-0 flex-col gap-6 overflow-y-auto border-r border-border bg-white p-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Piętro
          </p>
          <FloorSelector
            floors={FLOORS}
            activeFloorId={activeFloorId}
            onChange={setActiveFloorId}
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Status stolików
          </p>
          <ul className="space-y-1.5">
            {(['available', 'reserved', 'occupied'] as const).map((status) => (
              <li key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full border-2"
                    style={{
                      borderColor:
                        status === 'available'
                          ? '#a3a3a3'
                          : status === 'reserved'
                            ? '#10b981'
                            : '#fb7185',
                    }}
                  />
                  <span className="text-sm text-text">{STATUS_LABELS[status]}</span>
                </div>
                <span className="text-sm font-semibold text-text">{statusCounts[status]}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Nadchodzące dzisiaj
          </p>
          <ul className="space-y-2">
            {todaysReservations.map((reservation) => (
              <li key={reservation.id} className="rounded-lg border border-border p-2">
                <div className="flex items-start justify-between gap-1">
                  <span className="text-sm font-medium text-text">{reservation.guestName}</span>
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${RESERVATION_STATUS_COLORS[reservation.status]}`}
                  >
                    {RESERVATION_STATUS_LABELS[reservation.status]}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-text-muted">
                  {reservation.time} · {reservation.partySize} os. · {reservation.tableLabel}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Center: canvas */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex items-center px-6 pt-4 pb-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Plan restauracji — Parter
          </span>
        </div>

        <div className="min-h-0 flex-1">
          <FloorPlanCanvas
            mode="view"
            tableStatuses={tableStatuses}
            onTableClick={handleTableClick}
          />
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-3">
          <FloorPlanLegend variant="staff" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(zoomOut())}
              className="flex h-7 w-7 items-center justify-center rounded border border-border bg-white text-text-muted hover:bg-surface-subtle disabled:opacity-40"
            >
              −
            </button>
            <span className="w-14 text-center text-xs text-text-muted">
              {Math.round(viewportScale * 100)}%
            </span>
            <button
              onClick={() => dispatch(zoomIn())}
              className="flex h-7 w-7 items-center justify-center rounded border border-border bg-white text-text-muted hover:bg-surface-subtle disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Right: table details */}
      <div className="w-72 shrink-0 overflow-y-auto border-l border-border bg-white p-6">
        {selectedElement ? (
          <>
            <h2 className="mb-4 text-base font-semibold text-text">
              {selectedElement.label} · Szczegóły
            </h2>

            {selectedTableStatus && (
              <div className="mb-4 flex items-center justify-between">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${STATUS_COLORS[selectedTableStatus].bg} ${STATUS_COLORS[selectedTableStatus].text} ${STATUS_COLORS[selectedTableStatus].border}`}
                >
                  {STATUS_LABELS[selectedTableStatus]}
                </span>
                <span className="text-sm text-text-muted">
                  {selectedElement.type === 'roundTable' ? '4 miejsca' : '4–6 miejsc'}
                </span>
              </div>
            )}

            {tableReservations.length > 0 && (
              <>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Następna rezerwacja
                </p>
                {(() => {
                  const next = tableReservations.find((r) => r.status === 'upcoming');
                  return next ? (
                    <div className="mb-4 rounded-lg border border-border p-3">
                      <div className="flex items-start justify-between">
                        <span className="font-medium text-text">{next.guestName}</span>
                        <span className="text-xs text-text-muted">{next.time}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-text-muted">{next.partySize} osoby</p>
                    </div>
                  ) : null;
                })()}

                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Rezerwacje {selectedElement.label}
                </p>
                <ul className="space-y-2">
                  {tableReservations.map((reservation) => (
                    <li
                      key={reservation.id}
                      className="flex items-start justify-between rounded-lg border border-border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-text">{reservation.guestName}</p>
                        <p className="text-xs text-text-muted">
                          {reservation.time} · {reservation.partySize}{' '}
                          {reservation.partySize === 1
                            ? 'osoba'
                            : reservation.partySize < 5
                              ? 'osoby'
                              : 'osób'}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${RESERVATION_STATUS_COLORS[reservation.status]}`}
                      >
                        {RESERVATION_STATUS_LABELS[reservation.status]}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {tableReservations.length === 0 && (
              <p className="text-sm text-text-muted">Brak rezerwacji na dzisiaj</p>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-sm text-text-muted">
              Kliknij stolik, aby zobaczyć szczegóły
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

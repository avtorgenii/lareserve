import DateTimeSummaryBar from './DateTimeSummaryBar';

import type { ReservationForm } from '../model/types';
import type { FloorData } from '@/features/floorPlan/model/types';
import type { FloorElement } from '@/features/floorPlan/model/types';

import FloorPlanCanvas from '@/features/floorPlan/ui/FloorPlanCanvas';
import FloorPlanLegend from '@/features/floorPlan/ui/shared/FloorPlanLegend';
import FloorSelector from '@/features/floorPlan/ui/shared/FloorSelector';

export default function TablePickerStep({
  date,
  time,
  floors,
  activeFloorId,
  selectedElement,
  form,
  onChangeDateTime,
  onFloorChange,
  onTableClick,
  onFormChange,
  onConfirm,
}: {
  date: string;
  time: string;
  floors: Pick<FloorData, 'id' | 'name'>[];
  activeFloorId: string;
  selectedElement: FloorElement | null | undefined;
  form: ReservationForm;
  onChangeDateTime: () => void;
  onFloorChange: (id: string) => void;
  onTableClick: (id: string) => void;
  onFormChange: (patch: Partial<ReservationForm>) => void;
  onConfirm: () => void;
}) {
  const tableType = selectedElement?.type === 'roundTable' ? 'Okrągły' : 'Prostokątny';
  const activeFloorName = floors.find((f) => f.id === activeFloorId)?.name ?? activeFloorId;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DateTimeSummaryBar date={date} time={time} onChangeClick={onChangeDateTime} />

      <div className="flex min-h-0 flex-1">
        {/* Canvas with absolute overlays */}
        <div className="relative min-h-0 min-w-0 flex-1">
          <FloorPlanCanvas mode="view" onTableClick={onTableClick} />

          {/* Top overlay: plan label + floor tabs */}
          <div className="pointer-events-none absolute left-0 right-0 top-0 flex items-start justify-between px-6 pt-5">
            <span className="rounded-sm bg-white/70 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-text-muted backdrop-blur-sm">
              Plan restauracji
            </span>
            <div className="pointer-events-auto">
              <FloorSelector
                floors={floors.map((f) => ({ id: f.id, label: f.name }))}
                activeFloorId={activeFloorId}
                onChange={onFloorChange}
                variant="tabs"
              />
            </div>
          </div>

          {/* Bottom overlay: legend + hint */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 pb-5">
            <div className="rounded-sm bg-white/70 px-2 py-1 backdrop-blur-sm">
              <FloorPlanLegend variant="customer" />
            </div>
            <span className="rounded-sm bg-white/70 px-2 py-0.5 text-xs text-text-muted backdrop-blur-sm">
              Naciśnij aby wybrać stolik
            </span>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex w-80 shrink-0 flex-col overflow-x-hidden border-l border-border bg-white">
          {selectedElement ? (
            <>
              {/* Fixed header — always visible */}
              <div className="shrink-0 px-6 pt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Wybrano
                </p>
                <div className="mb-6 rounded-lg border-l-4 border-l-primary bg-surface-subtle p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-text">{selectedElement.label}</p>
                      <p className="mt-0.5 text-xs text-text-muted">
                        {tableType} · 4 miejsca · {activeFloorName}
                      </p>
                    </div>
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      wolny
                    </span>
                  </div>
                </div>

                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Szczegóły rezerwacji
                </p>
              </div>

              {/* Scrollable form */}
              <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-1 pb-6">
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs text-text-muted">Imię i nazwisko</label>
                    <input
                      type="text"
                      autoComplete="name"
                      value={form.guestName}
                      onChange={(e) => onFormChange({ guestName: e.target.value })}
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-text-muted">Numer telefonu</label>
                    <input
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => onFormChange({ phone: e.target.value })}
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-text-muted">Adres e-mail</label>
                    <input
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => onFormChange({ email: e.target.value })}
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-text-muted">
                      Wymagania specjalne <span className="text-text-subtle">(opcjonalne)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={form.specialRequests}
                      onChange={(e) => onFormChange({ specialRequests: e.target.value })}
                      placeholder="np. alergie, stolik dla dziecka ..."
                      className="w-full resize-none rounded-lg border border-border px-3 py-2 text-sm text-text outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Fixed footer button */}
              <div className="shrink-0 px-6 py-4">
                <button
                  onClick={onConfirm}
                  disabled={!form.guestName || !form.phone || !form.email}
                  className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Dalej
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-6">
              <p className="text-center text-sm text-text-muted">
                Wybierz stolik na planie, aby kontynuować
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

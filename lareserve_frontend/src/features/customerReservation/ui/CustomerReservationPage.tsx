'use client';

import { useEffect, useMemo, useState } from 'react';

import ConfirmationStep from './ConfirmationStep';
import DateTimePicker from './DateTimePicker';
import StepIndicator from './StepIndicator';
import TablePickerStep from './TablePickerStep';
import {
  fetchAvailableDates,
  fetchAvailableTables,
  fetchAvailableTimes,
  submitReservation,
} from '../model/api';

import type { Step, ReservationForm } from '../model/types';
import type { TableStatus } from '@/features/floorPlan/model/types';

import { setActiveFloor } from '@/features/floorPlan/model/floorPlanSlice';
import {
  selectActiveFloorId,
  selectFloorPlanElements,
  selectFloorsList,
} from '@/features/floorPlan/model/selectors';
import { RESTAURANT_ID } from '@/shared/lib/constants';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

/** Converts an ISO date string to a human-readable Polish label for display. */
function formatDatePolish(isoDate: string): string {
  if (!isoDate) return '';
  const date = new Date(`${isoDate}T12:00:00`);
  const raw = date.toLocaleDateString('pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const cleaned = raw.replace(',', '');
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export default function CustomerReservationPage() {
  const dispatch = useAppDispatch();
  const [currentStep, setCurrentStep] = useState<Step>(1);

  // ISO date strings from API
  const [dates, setDates] = useState<string[]>([]);
  // Availability map from API: { "11:00": true, "12:00": false, ... }
  const [times, setTimes] = useState<Record<string, boolean>>({});
  const [tableAvailability, setTableAvailability] = useState<Record<string, boolean>>({});
  const [datesLoading, setDatesLoading] = useState(false);
  const [timesLoading, setTimesLoading] = useState(false);
  const [tablesLoading, setTablesLoading] = useState(false);

  // Selected ISO date ("YYYY-MM-DD") and time ("HH:MM")
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [activeFloorId, setActiveFloorId] = useState('');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [form, setForm] = useState<ReservationForm>({
    guestName: '',
    phone: '',
    email: '',
    specialRequests: '',
  });

  const elements = useAppSelector(selectFloorPlanElements);
  const floors = useAppSelector(selectFloorsList);
  const reduxActiveFloorId = useAppSelector(selectActiveFloorId);

  // Keep local active floor in sync with the store; also initialise it from store on first render.
  useEffect(() => {
    if (reduxActiveFloorId && reduxActiveFloorId !== activeFloorId) {
      setActiveFloorId(reduxActiveFloorId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxActiveFloorId]);

  const selectedElement = selectedElementId
    ? elements.find((el) => el.id === selectedElementId)
    : null;

  // Fetch available dates on mount
  useEffect(() => {
    setDatesLoading(true);
    fetchAvailableDates(RESTAURANT_ID)
      .then((fetchedDates) => {
        setDates(fetchedDates);
        if (fetchedDates.length > 0) {
          setSelectedDate(fetchedDates[0]);
        }
      })
      .catch((err) => console.error('[Reservation] Failed to fetch dates:', err))
      .finally(() => setDatesLoading(false));
  }, []);

  // Fetch available times whenever the selected date changes
  useEffect(() => {
    if (!selectedDate) return;
    let isActive = true;

    setTimesLoading(true);
    setSelectedTime('');
    fetchAvailableTimes(RESTAURANT_ID, selectedDate)
      .then((fetchedTimes) => {
        if (!isActive) return;

        const availabilityEntries = Object.entries(fetchedTimes);

        setTimes(fetchedTimes);
        // Auto-select first available time slot
        const firstAvailable = availabilityEntries.find(([, available]) => available)?.[0];
        setSelectedTime((currentTime) => {
          if (currentTime && fetchedTimes[currentTime]) {
            return currentTime;
          }
          return firstAvailable ?? '';
        });
      })
      .catch((err) => {
        if (!isActive) return;
        console.error('[Reservation] Failed to fetch times:', err);
        setTimes({});
      })
      .finally(() => {
        if (isActive) {
          setTimesLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [selectedDate]);

  // Fetch available tables whenever selected date and time change.
  useEffect(() => {
    if (!selectedDate || !selectedTime) {
      setTableAvailability({});
      return;
    }

    let isActive = true;
    setTablesLoading(true);

    fetchAvailableTables(RESTAURANT_ID, selectedDate, selectedTime)
      .then((fetchedAvailability) => {
        if (!isActive) return;
        setTableAvailability(fetchedAvailability);
      })
      .catch((err) => {
        if (!isActive) return;
        console.error('[Reservation] Failed to fetch table availability:', err);
        setTableAvailability({});
      })
      .finally(() => {
        if (isActive) {
          setTablesLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [selectedDate, selectedTime]);

  const tableStatuses = useMemo<Record<string, TableStatus>>(() => {
    return Object.entries(tableAvailability).reduce<Record<string, TableStatus>>(
      (acc, [tableId, available]) => {
        acc[tableId] = available ? 'available' : 'occupied';
        return acc;
      },
      {}
    );
  }, [tableAvailability]);

  const isSelectedTableAvailable =
    !!selectedElement && tableAvailability[selectedElement.id] === true && !tablesLoading;

  const handleFormChange = (patch: Partial<ReservationForm>) => {
    setForm((f) => ({ ...f, ...patch }));
  };

  const handleConfirmReservation = async () => {
    if (!selectedElement || tableAvailability[selectedElement.id] !== true) {
      alert('Wybrany stolik jest już niedostępny. Wybierz inny stolik.');
      setCurrentStep(2);
      return;
    }
    const [year, month, day] = selectedDate.split('-').map(Number);
    const [hours, minutes] = selectedTime.split(':').map(Number);
    // Build local wall-clock datetime, then convert to UTC ISO for API transport.
    const dateTime = new Date(year, month - 1, day, hours, minutes, 0).toISOString();
    try {
      await submitReservation(
        RESTAURANT_ID,
        selectedElement.id,
        dateTime,
        activeFloorId,
        form.guestName,
        form.email,
        form.phone,
        form.specialRequests || undefined
      );
      alert(
        `Rezerwacja wysłana!\nStolik: ${selectedElement.label}\nData: ${formatDatePolish(selectedDate)} ${selectedTime}`
      );
    } catch (err) {
      console.error('[Reservation] Submit failed:', err);
      alert('Nie udało się wysłać rezerwacji. Spróbuj ponownie.');
    }
  };

  // Human-readable date passed to display-only child components
  const displayDate = formatDatePolish(selectedDate);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <StepIndicator currentStep={currentStep} />

      {currentStep === 1 && (
        <DateTimePicker
          dates={dates}
          times={times}
          date={selectedDate}
          time={selectedTime}
          datesLoading={datesLoading}
          timesLoading={timesLoading}
          onDateChange={setSelectedDate}
          onTimeChange={setSelectedTime}
          onConfirm={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 2 && (
        <TablePickerStep
          date={displayDate}
          time={selectedTime}
          floors={floors}
          activeFloorId={activeFloorId}
          selectedElement={selectedElement}
          tableAvailability={tableAvailability}
          tableStatuses={tableStatuses}
          tableAvailabilityLoading={tablesLoading}
          isSelectedTableAvailable={isSelectedTableAvailable}
          form={form}
          onChangeDateTime={() => setCurrentStep(1)}
          onFloorChange={(id) => {
            setActiveFloorId(id);
            dispatch(setActiveFloor(id));
            setSelectedElementId(null);
          }}
          onTableClick={setSelectedElementId}
          onFormChange={handleFormChange}
          onConfirm={() => {
            if (!selectedElement || tableAvailability[selectedElement.id] !== true) {
              alert('Wybrany stolik jest niedostępny. Wybierz inny stolik.');
              return;
            }
            setCurrentStep(3);
          }}
        />
      )}

      {currentStep === 3 && selectedElement && (
        <ConfirmationStep
          date={displayDate}
          time={selectedTime}
          tableLabel={selectedElement.label}
          tableFloor={floors.find((f) => f.id === activeFloorId)?.name ?? activeFloorId}
          form={form}
          onGoBack={() => setCurrentStep(2)}
          onConfirm={handleConfirmReservation}
        />
      )}
    </div>
  );
}

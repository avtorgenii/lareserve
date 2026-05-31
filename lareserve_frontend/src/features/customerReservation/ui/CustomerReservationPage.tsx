'use client';

import { useEffect, useState } from 'react';

import ConfirmationStep from './ConfirmationStep';
import DateTimePicker from './DateTimePicker';
import StepIndicator from './StepIndicator';
import TablePickerStep from './TablePickerStep';
import { fetchAvailableDates, fetchAvailableTimes, submitReservation } from '../model/api';
import { FLOOR_LABELS } from '../model/types';

import type { Step, ReservationForm } from '../model/types';

import { selectFloorPlanElements } from '@/features/floorPlan/model/selectors';
import { RESTAURANT_ID } from '@/shared/lib/constants';
import { useAppSelector } from '@/store/hooks';

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
  const [currentStep, setCurrentStep] = useState<Step>(1);

  // ISO date strings from API
  const [dates, setDates] = useState<string[]>([]);
  // Availability map from API: { "11:00": true, "12:00": false, ... }
  const [times, setTimes] = useState<Record<string, boolean>>({});
  const [datesLoading, setDatesLoading] = useState(false);
  const [timesLoading, setTimesLoading] = useState(false);

  // Selected ISO date ("YYYY-MM-DD") and time ("HH:MM")
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [activeFloorId, setActiveFloorId] = useState('ground');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [form, setForm] = useState<ReservationForm>({
    guestName: '',
    phone: '',
    email: '',
    specialRequests: '',
  });

  const elements = useAppSelector(selectFloorPlanElements);
  const selectedElement = selectedElementId
    ? elements.find((el) => el.id === selectedElementId)
    : null;

  // Fetch available dates on mount
  useEffect(() => {
    setDatesLoading(true);
    fetchAvailableDates(RESTAURANT_ID)
      .then((fetchedDates) => {
        console.log('[Reservation][DEBUG] fetched dates:', fetchedDates);
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
        const availableTimes = availabilityEntries
          .filter(([, available]) => available)
          .map(([slot]) => slot);
        const unavailableTimes = availabilityEntries
          .filter(([, available]) => !available)
          .map(([slot]) => slot);

        console.log('[Reservation][DEBUG] fetched time availability:', {
          date: selectedDate,
          raw: fetchedTimes,
          availableCount: availableTimes.length,
          unavailableCount: unavailableTimes.length,
          availableTimes,
          unavailableTimes,
        });

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

  const handleFormChange = (patch: Partial<ReservationForm>) => {
    setForm((f) => ({ ...f, ...patch }));
  };

  const handleConfirmReservation = async () => {
    if (!selectedElement) return;
    const dateTime = `${selectedDate}T${selectedTime}:00Z`;
    try {
      await submitReservation(
        RESTAURANT_ID,
        selectedElement.id,
        dateTime,
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
          activeFloorId={activeFloorId}
          selectedElement={selectedElement}
          form={form}
          onChangeDateTime={() => setCurrentStep(1)}
          onFloorChange={setActiveFloorId}
          onTableClick={setSelectedElementId}
          onFormChange={handleFormChange}
          onConfirm={() => setCurrentStep(3)}
        />
      )}

      {currentStep === 3 && selectedElement && (
        <ConfirmationStep
          date={displayDate}
          time={selectedTime}
          tableLabel={selectedElement.label}
          tableFloor={FLOOR_LABELS[activeFloorId]}
          form={form}
          onGoBack={() => setCurrentStep(2)}
          onConfirm={handleConfirmReservation}
        />
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';

import ConfirmationStep from './ConfirmationStep';
import DateTimePicker from './DateTimePicker';
import StepIndicator from './StepIndicator';
import TablePickerStep from './TablePickerStep';
import { FLOOR_LABELS } from '../model/types';

import type { Step, ReservationForm } from '../model/types';

import { selectFloorPlanElements } from '@/features/floorPlan/model/selectors';
import { useAppSelector } from '@/store/hooks';

export default function CustomerReservationPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedDate, setSelectedDate] = useState('Sobota 28 marca 2026');
  const [selectedTime, setSelectedTime] = useState('19:00');
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

  const handleFormChange = (patch: Partial<ReservationForm>) => {
    setForm((f) => ({ ...f, ...patch }));
  };

  const handleConfirmReservation = () => {
    // TODO: dispatch to API
    alert(
      `Rezerwacja wysłana!\nStolik: ${selectedElement?.label}\nData: ${selectedDate} ${selectedTime}`
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <StepIndicator currentStep={currentStep} />

      {currentStep === 1 && (
        <DateTimePicker
          date={selectedDate}
          time={selectedTime}
          onDateChange={setSelectedDate}
          onTimeChange={setSelectedTime}
          onConfirm={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 2 && (
        <TablePickerStep
          date={selectedDate}
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
          date={selectedDate}
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

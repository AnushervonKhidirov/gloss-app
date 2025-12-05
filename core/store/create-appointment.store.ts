import type { Service } from '@type/service.type';
import { SelectableTime } from '@type/time.type';
import type { Worker } from '@type/worker.type';
import type { Dayjs } from 'dayjs';

import { create } from 'zustand';

type CreateAppointmentState = {
  step: number;
  selectedService: Service | null;
  selectedWorker: Worker | null;
  selectedTime: Dayjs | null;
  time: SelectableTime | null;
};

type CreateAppointmentAction = {
  setStep: (loading: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setSelectedService: (selectedService: Service | null | undefined) => void;
  setSelectedWorker: (selectedWorker: Worker | null | undefined) => void;
  setSelectedTime: (selectedTime: Dayjs | null | undefined) => void;
  setTime: (time: SelectableTime | null) => void;
  reset: () => void;
};

const initialState: CreateAppointmentState = {
  step: 0,
  selectedService: null,
  selectedWorker: null,
  selectedTime: null,
  time: null,
};

export const useCreateAppointmentStore = create<CreateAppointmentState & CreateAppointmentAction>(
  set => ({
    ...initialState,

    setStep: step => set({ step }),
    nextStep: () => set(state => ({ step: state.step + 1 })),
    prevStep: () => set(state => ({ step: state.step - 1 })),
    setSelectedService: selectedService => set({ selectedService }),
    setSelectedWorker: selectedWorker => set({ selectedWorker }),
    setSelectedTime: selectedTime => set({ selectedTime }),
    setTime: time => set({ time }),

    reset: () => set({ ...initialState }),
  }),
);

export default useCreateAppointmentStore;

import type { Appointment } from '@type/appointment.type';

import { create } from 'zustand';

type MyAppointmentState = {
  myAppointments: Appointment[];
  setMyAppointments: (appointments: Appointment[]) => void;
  pushMyAppointments: (appointments: Appointment[]) => void;
  deleteMyAppointments: (appointments: Appointment) => void;
};

type AppointmentState = {
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[]) => void;
  pushAppointments: (appointments: Appointment[]) => void;
  deleteAppointment: (appointments: Appointment) => void;
};

type CompletedAppointmentState = {
  completedAppointments: Appointment[];
  setCompletedAppointments: (appointments: Appointment[]) => void;
  pushCompletedAppointments: (appointments: Appointment[]) => void;
  deleteCompletedAppointment: (appointments: Appointment) => void;
};

type AppointmentStore = MyAppointmentState &
  AppointmentState &
  CompletedAppointmentState & {
    deleteFromAll: (appointments: Appointment) => void;
  };

const useAppointmentStore = create<AppointmentStore>(set => ({
  myAppointments: [],
  appointments: [],
  completedAppointments: [],

  setMyAppointments: myAppointments => set(() => ({ myAppointments })),
  pushMyAppointments: newAppointment =>
    set(state => ({ myAppointments: [...state.myAppointments, ...newAppointment] })),
  deleteMyAppointments: deletedAppointment =>
    set(state => {
      const myAppointments = state.myAppointments.filter(
        appointments => appointments.id !== deletedAppointment.id,
      );
      return { myAppointments };
    }),

  setAppointments: appointments => set(() => ({ appointments })),
  pushAppointments: newAppointment =>
    set(state => ({ appointments: [...state.appointments, ...newAppointment] })),
  deleteAppointment: deletedAppointment =>
    set(state => {
      const appointments = state.appointments.filter(
        appointments => appointments.id !== deletedAppointment.id,
      );
      return { appointments };
    }),

  setCompletedAppointments: completedAppointments => set(() => ({ completedAppointments })),
  pushCompletedAppointments: newAppointment =>
    set(state => ({ completedAppointments: [...state.completedAppointments, ...newAppointment] })),

  deleteCompletedAppointment: deletedAppointment =>
    set(state => {
      const appointments = state.completedAppointments.filter(
        appointments => appointments.id !== deletedAppointment.id,
      );
      return { appointments };
    }),

  deleteFromAll: deletedAppointment =>
    set(state => {
      const appointments = state.appointments.filter(
        appointments => appointments.id !== deletedAppointment.id,
      );
      const myAppointments = state.myAppointments.filter(
        appointments => appointments.id !== deletedAppointment.id,
      );
      const completedAppointments = state.completedAppointments.filter(
        appointments => appointments.id !== deletedAppointment.id,
      );
      return { appointments, myAppointments, completedAppointments };
    }),
}));

export default useAppointmentStore;

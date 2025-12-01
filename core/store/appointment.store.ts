import type { Appointment } from '@type/appointment.type';

import { create } from 'zustand';

type AppointmentState = {
  appointments: Appointment[];
  myAppointments: Appointment[];
  completedAppointments: Appointment[];
};

type AppointmentSingleState = {
  appointment: Appointment;
  myAppointment: Appointment;
  completedAppointment: Appointment;
};

type AppointmentActions = {
  setAppointments: ({
    appointments,
    myAppointments,
    completedAppointments,
  }: Partial<AppointmentState>) => void;
  pushAppointments: ({
    appointments,
    myAppointments,
    completedAppointments,
  }: Partial<AppointmentState>) => void;
  deleteAppointment: ({
    appointment,
    myAppointment,
    completedAppointment,
  }: Partial<AppointmentSingleState>) => void;
};

const useAppointmentStore = create<AppointmentState & AppointmentActions>(set => ({
  myAppointments: [],
  appointments: [],
  completedAppointments: [],

  setAppointments: ({ appointments, completedAppointments, myAppointments }) =>
    set(state => {
      return {
        appointments: appointments ?? state.appointments,
        completedAppointments: completedAppointments ?? state.completedAppointments,
        myAppointments: myAppointments ?? state.myAppointments,
      };
    }),

  pushAppointments: ({ appointments, completedAppointments, myAppointments }) =>
    set(state => {
      return {
        appointments: appointments ? [...state.appointments, ...appointments] : state.appointments,
        completedAppointments: completedAppointments
          ? [...state.completedAppointments, ...completedAppointments]
          : state.completedAppointments,
        myAppointments: myAppointments
          ? [...state.myAppointments, ...myAppointments]
          : state.myAppointments,
      };
    }),

  deleteAppointment: ({ appointment, completedAppointment, myAppointment }) =>
    set(state => {
      return {
        appointments: appointment
          ? state.appointments.filter(appointmentsState => appointmentsState.id !== appointment.id)
          : state.appointments,

        completedAppointments: completedAppointment
          ? state.completedAppointments.filter(
              completedAppointmentsState =>
                completedAppointmentsState.id !== completedAppointment.id,
            )
          : state.completedAppointments,

        myAppointments: myAppointment
          ? state.myAppointments.filter(
              myAppointmentsState => myAppointmentsState.id !== myAppointment.id,
            )
          : state.myAppointments,
      };
    }),
}));

export default useAppointmentStore;

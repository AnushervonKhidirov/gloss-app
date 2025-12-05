import type { Dayjs } from 'dayjs';
import type { Appointment } from './appointment.type';
import type { SelectedService } from './service.type';
import type { User } from './user.type';

export type Worker = Omit<User, 'username' | 'verified' | 'archived' | 'role'> & {
  workerService: SelectedService[];
  appointments: Omit<Appointment, 'user' | 'client' | 'service'>[];
};

export type FindQueryWorkerAppointment = {
  userId?: number;
  serviceId?: number;
  dateFrom?: Date | Dayjs;
  dateTo?: Date | Dayjs;
};

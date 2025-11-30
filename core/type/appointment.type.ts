import type { Dayjs } from 'dayjs';
import type { Client } from './client.type';
import type { Service } from './service.type';
import type { User } from './user.type';

export type Appointment = {
  id: number;
  startAt: Dayjs;
  endAt: Dayjs;
  userId: number;
  user: User & { workerService: { serviceId: number; price: number | null }[] };
  clientId: number;
  client: Client;
  serviceId: number;
  service: Service;
};

export type CreateAppointment = Pick<Appointment, 'userId' | 'serviceId' | 'clientId'> & {
  clientId: number;
  startAt: string;
};

export type QueryMyAppointment = {
  clientId?: number;
  serviceId?: number;
  dateFrom?: Dayjs;
  dateTo?: Dayjs;
};

export type QueryAppointment = QueryMyAppointment & {
  userId?: number;
  exceptUserId?: number;
};

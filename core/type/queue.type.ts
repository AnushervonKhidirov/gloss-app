import type { Dayjs } from 'dayjs';
import type { Client } from './client.type';
import type { Service } from './service.type';
import type { User } from './user.type';

export type Queue = {
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

export type CreateQueue = Pick<Queue, 'userId' | 'serviceId' | 'clientId'> & {
  clientId: number;
  startAt: string;
};

export type QueryMyQueue = {
  clientId?: string;
  serviceId?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type QueryQueue = QueryMyQueue & {
  userId?: string;
  exceptUserId?: string;
};

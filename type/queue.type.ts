import type { Client } from './client.type';
import type { Service } from './service.type';
import type { User } from './user.type';

export type Queue = {
  id: number;
  startAt: Date;
  endAt: Date;
  userId: number;
  user: User;
  clientId?: number;
  client?: Client;
  serviceId: number;
  service: Service;
};

export type CreateQueue = Pick<Queue, 'userId' | 'serviceId' | 'clientId'> & {
  clientId: number;
  startAt: string;
};

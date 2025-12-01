import type { Specialty } from './specialty.type';

export type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string | null;
  phone: string;
  verified: boolean;
  archived: boolean;
  specialtyId: number | null;
  specialty: Omit<Specialty, 'desc'> | null;
  role: Role;
};

export type CreateUser = {
  username: string;
  password: string;
  firstName: string;
  lastName?: string;
};

export type UpdateUser = Partial<CreateUser>;

export enum Role {
  WORKER = 'WORKER',
  ADMIN = 'ADMIN',
}

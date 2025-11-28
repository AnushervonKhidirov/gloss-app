export type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string | null;
  phone: string;
  verified: boolean;
  archived: boolean;
  specialtyId: number | null;
  specialty: { id: number; value: string } | null;
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

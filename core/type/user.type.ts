export type User = {
  id: number;
  username: string;
  lastName: string | null;
  firstName: string;
  verified: boolean;
  archived: boolean;
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

export type Client = {
  id: number;
  name: string;
  phone: string;
};

export type CreateClient = Omit<Client, 'id'>
export type UpdateClient = Partial<CreateClient>

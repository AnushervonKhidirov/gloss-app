export type Client = {
  id: number;
  name: string;
  phone: string;
};

export type CreateClient = Omit<Client, 'id'>;
export type UpdateClient = Partial<CreateClient>;

export type QueryClient = {
  name?: string;
  phone?: string;
};

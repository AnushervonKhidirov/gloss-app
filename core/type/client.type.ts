export type Client = {
  id: number;
  name: string;
  phone: string;
};

export type CreateClient = Omit<Client, 'id'>;
export type UpdateClient = CreateClient;

export type QueryClient = {
  name?: string;
  phone?: string;
  omitBlackList?: boolean;
};

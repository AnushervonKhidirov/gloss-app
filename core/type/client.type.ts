export type Client = {
  id: number;
  name: string;
  phone: string;
  blocked: boolean;
};

export type CreateClient = Omit<Client, 'id' | 'blocked'>;
export type UpdateClient = CreateClient;

export type QueryClient = {
  name?: string;
  phone?: string;
  omitBlackList?: boolean;
};

export type BlackList = {
  id: number;
  phone: string;
};

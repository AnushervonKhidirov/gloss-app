export type Category = {
  id: number;
  value: string;
};

export type CreateCategory = {
  value: string;
};

export type UpdateCategory = Partial<CreateCategory>;

import type { Category } from './category.type';

export type Service = {
  id: number;
  name: string;
  price: number;
  desc: string | null;
  duration: number;
  category: Category;
  categoryId: number;
};

export type CreateService = {
  name: string;
  price: number;
  duration: number;
  categoryId: number;
  desc?: string;
};

export type UpdateService = Partial<CreateService>;

export type WorkerService = {
  id: number;
  userId: number;
  serviceId: number;
  price: number | null;
  service: Service;
};

export type ServicesByCategory = {
  [key: string]: Service[];
};

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

import type { Category } from '@type/category.type';
import type { SelectedService, Service } from '@type/service.type';

import { create } from 'zustand';

type ServiceState = {
  services: Service[];
  setServices: (services: Service[]) => void;
  pushServices: (services: Service[]) => void;
};

type SelectedServiceState = {
  selectedServices: SelectedService[];
  setSelectedServices: (services: SelectedService[]) => void;
};

type CategoryState = {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  pushCategories: (categories: Category[]) => void;
};

type useServiceStore = ServiceState &
  SelectedServiceState &
  CategoryState & {
    setMany: ({
      services,
      selectedServices,
      categories,
    }: {
      services?: Service[];
      selectedServices?: SelectedService[];
      categories?: Category[];
    }) => void;
  };

const useServiceStore = create<useServiceStore>(set => ({
  services: [],
  createServiceModalVisible: false,

  selectedServices: [],
  selectServicesModalVisible: false,

  categories: [],
  createCategoryModalVisible: false,

  setServices: services => set(() => ({ services })),
  pushServices: newServices => set(state => ({ services: [...state.services, ...newServices] })),

  setSelectedServices: selectedServices => set(() => ({ selectedServices })),

  setCategories: categories => set(() => ({ categories })),
  pushCategories: newCategories =>
    set(state => ({ categories: [...state.categories, ...newCategories] })),

  setMany: ({ services, selectedServices, categories }) =>
    set(state => {
      return {
        services: services ?? state.services,
        selectedServices: selectedServices ?? state.selectedServices,
        categories: categories ?? state.categories,
      };
    }),
}));

export default useServiceStore;

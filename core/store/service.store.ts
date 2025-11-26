import type { Category } from '@type/category.type';
import type { SelectedService, Service } from '@type/service.type';

import { create } from 'zustand';

type ServiceState = {
  services: Service[];
  setServices: (services: Service[]) => void;
  pushServices: (services: Service[]) => void;
  editService: (service: Service) => void;
  deleteService: (service: Service) => void;
};

type SelectedServiceState = {
  selectedServices: SelectedService[];
  setSelectedServices: (services: SelectedService[]) => void;
};

type CategoryState = {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  pushCategories: (categories: Category[]) => void;
  editCategory: (category: Category) => void;
  deleteCategory: (category: Category) => void;
};

type UseServiceStore = ServiceState &
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

const useServiceStore = create<UseServiceStore>(set => ({
  services: [],
  createServiceModalVisible: false,

  selectedServices: [],
  selectServicesModalVisible: false,

  categories: [],
  createCategoryModalVisible: false,

  setServices: services => set(() => ({ services })),
  pushServices: newServices => set(state => ({ services: [...state.services, ...newServices] })),
  editService: editedService =>
    set(state => {
      const newServiceList = state.services.map(service => {
        return service.id === editedService.id ? editedService : service;
      });
      return { services: newServiceList };
    }),
  deleteService: deletedService =>
    set(state => {
      const newServiceList = state.services.filter(service => service.id !== deletedService.id);
      return { services: newServiceList };
    }),

  setSelectedServices: selectedServices => set(() => ({ selectedServices })),

  setCategories: categories => set(() => ({ categories })),
  pushCategories: newCategories =>
    set(state => ({ categories: [...state.categories, ...newCategories] })),
  editCategory: editedCategory =>
    set(state => {
      const newCategoryList = state.categories.map(category => {
        return category.id === editedCategory.id ? editedCategory : category;
      });
      return { categories: newCategoryList };
    }),
  deleteCategory: deletedCategory =>
    set(state => {
      const newCategoryList = state.categories.filter(
        category => category.id !== deletedCategory.id,
      );
      return { categories: newCategoryList };
    }),

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

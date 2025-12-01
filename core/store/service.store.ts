import type { SelectedService, Service } from '@type/service.type';

import { create } from 'zustand';

type ServiceState = {
  services: Service[];
  selectedServices: SelectedService[];
};

type ServiceSingleState = {
  service: Service;
  selectedService: SelectedService;
};

type ServiceActions = {
  setServices: ({ services, selectedServices }: Partial<ServiceState>) => void;
  pushServices: ({ services, selectedServices }: Partial<ServiceState>) => void;
  editService: ({ service, selectedService }: Partial<ServiceSingleState>) => void;
  deleteService: ({ service, selectedService }: Partial<ServiceSingleState>) => void;
};

const useServiceStore = create<ServiceState & ServiceActions>(set => ({
  services: [],
  selectedServices: [],

  setServices: ({ services, selectedServices }) =>
    set(state => {
      return {
        services: services ?? state.services,
        selectedServices: selectedServices ?? state.selectedServices,
      };
    }),

  pushServices: ({ services, selectedServices }) =>
    set(state => {
      return {
        services: services ? [...state.services, ...services] : state.services,
        selectedServices: selectedServices
          ? [...state.selectedServices, ...selectedServices]
          : state.selectedServices,
      };
    }),

  editService: ({ service, selectedService }) =>
    set(state => {
      return {
        services: service
          ? state.services.map(serviceState =>
              serviceState.id === service.id ? service : serviceState,
            )
          : state.services,
        selectedServices: selectedService
          ? state.selectedServices.map(serviceState =>
              serviceState.id === selectedService.id ? selectedService : serviceState,
            )
          : state.selectedServices,
      };
    }),

  deleteService: ({ service, selectedService }) =>
    set(state => {
      return {
        services: service
          ? state.services.filter(serviceState => serviceState.id !== service.id)
          : state.services,
        selectedServices: selectedService
          ? state.selectedServices.filter(serviceState => serviceState.id !== selectedService.id)
          : state.selectedServices,
      };
    }),
}));

export default useServiceStore;

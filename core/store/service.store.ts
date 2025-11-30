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
  setServices: ({ services, selectedServices }: ServiceState) => void;
  pushServices: ({ services, selectedServices }: ServiceState) => void;
  editService: ({ service, selectedService }: ServiceSingleState) => void;
  deleteService: ({ service, selectedService }: ServiceSingleState) => void;
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
      const updatedServices = state.services.map(serviceState => {
        return serviceState.id === service.id ? service : serviceState;
      });

      const updatedSelectedServices = state.selectedServices.map(serviceState => {
        return serviceState.id === selectedService.id ? selectedService : serviceState;
      });

      return { services: updatedServices, selectedServices: updatedSelectedServices };
    }),

  deleteService: ({ service, selectedService }) =>
    set(state => {
      return {
        services: state.services.filter(serviceState => serviceState.id !== service.id),
        selectedServices: state.selectedServices.filter(
          serviceState => serviceState.id !== selectedService.id,
        ),
      };
    }),
}));

export default useServiceStore;

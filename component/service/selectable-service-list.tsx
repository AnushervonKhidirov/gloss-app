import type { CreateUpdateWorkerService, SelectedService, Service } from '@type/service.type';
import type { FC } from 'react';

import ButtonPrimary from '@commonComponent/button-primary';
import ScrollView from '@commonComponent/scroll-view';
import { useState } from 'react';
import { Alert } from 'react-native';
import SelectedServiceCard from './selected-service-card';

import serviceService from '@service/service.service';

type SelectableServiceListProps = {
  services: Service[];
  selectedList: SelectedService[];
  onSuccess: (workerServices: SelectedService[]) => void;
  onRefresh: () => Promise<void>;
};

const SelectableServiceList: FC<SelectableServiceListProps> = ({
  services,
  selectedList,
  onSuccess,
  onRefresh,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState<Service[]>(
    selectedList.map(selected => selected.service),
  );

  async function submit() {
    setLoading(true);

    const workerServices: CreateUpdateWorkerService[] = selectedServices.map(selectedService => {
      const originalService = services.find(service => service.id === selectedService.id);
      const price = originalService?.price === selectedService.price ? null : selectedService.price;

      if (price) return { serviceId: selectedService.id, price: price };
      return { serviceId: selectedService.id };
    });

    const [newWorkerServices, err] = await serviceService.selectedHandler(workerServices);

    if (err) {
      Alert.alert('Ошибка', 'Что-то пошло не так, пожалуйста повторите позже');
    } else {
      onSuccess(newWorkerServices);
    }

    setLoading(false);
  }

  function selectHandler(service: Service, selected: boolean) {
    const newServices = [...selectedServices];
    const existingIndex = newServices.findIndex(serviceItem => serviceItem.id === service.id);

    if (existingIndex === -1 && selected) {
      newServices.push(service);
      setSelectedServices(newServices);
    }

    if (existingIndex !== -1 && selected) {
      newServices[existingIndex] = service;
      setSelectedServices(newServices);
    }

    if (existingIndex !== -1 && !selected) {
      newServices.splice(existingIndex, 1);
      setSelectedServices(newServices);
    }
  }

  return (
    <ScrollView
      searchable
      onRefresh={onRefresh}
      items={services}
      renderItem={service => (
        <SelectedServiceCard
          key={`selected-${service.id}`}
          service={service}
          selectedService={selectedList.find(selected => selected.serviceId === service.id)}
          onSelect={selectHandler}
        />
      )}
    >
      <ButtonPrimary loading={loading} onPress={submit}>
        Сохранить
      </ButtonPrimary>
    </ScrollView>
  );
};

export default SelectableServiceList;

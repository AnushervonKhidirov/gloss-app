import type { SelectedService, Service } from '@type/service.type';

import useServiceStore from '@store/service.store';
import { useState } from 'react';

import { Button } from '@ant-design/react-native';
import Modal from '@commonComponent/modal';
import { Alert } from 'react-native';
import SelectableServiceList from '../selectable-service-list';
import ServiceList from '../service-list';

import serviceService from '@services/service.service';

function convertSelectedService(selectedServices: SelectedService[]): Service[] {
  return selectedServices.map(workerService => {
    return {
      ...workerService.service,
      price: workerService.price ?? workerService.service.price,
    };
  });
}

const MyServiceSection = () => {
  const { services, selectedServices, setServices, setSelectedServices } = useServiceStore(
    state => state,
  );
  const [selectServicesModalVisible, setSelectServicesModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  function pushWorkerServices(workerService: SelectedService[]) {
    setSelectedServices(workerService);
    setSelectServicesModalVisible(false);
  }

  function openSelectServiceModal() {
    if (services.length === 0) {
      Alert.alert('Нет созданных услуг', 'Сначала создайте услуги в разделе "Все услуги"');
      return;
    }

    setSelectServicesModalVisible(true);
  }

  async function refreshServices() {
    console.log('refreshServices');
    
    setRefreshing(true);
    const [services, serviceErr] = await serviceService.findMany();
    const [selectedServices, selectedErr] = await serviceService.findManySelected();

    if (selectedErr || serviceErr) {
      Alert.alert('Ошибка', 'Что-то пошло не так');
    } else {
      setSelectedServices(selectedServices);
      setServices(services);
    }

    setRefreshing(false);
  }

  return (
    <ServiceList
      services={convertSelectedService(selectedServices)}
      refreshing={refreshing}
      onRefresh={refreshServices}
      emptyMessage="У вас пока нет выбранных услуг"
    >
      <Button type="primary" onPress={openSelectServiceModal}>
        {selectedServices.length === 0 ? 'Выбрать услуги' : 'Редактировать'}
      </Button>

      <Modal
        title="Выбор услуг"
        isOpen={selectServicesModalVisible}
        close={() => setSelectServicesModalVisible(false)}
      >
        <SelectableServiceList
          services={services}
          selectedList={selectedServices}
          refreshing={refreshing}
          onSuccess={pushWorkerServices}
          onRefresh={refreshServices}
        />
      </Modal>
    </ServiceList>
  );
};

export default MyServiceSection;

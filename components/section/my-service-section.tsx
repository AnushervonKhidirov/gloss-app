import type { SelectedService, Service } from '@type/service.type';

import useServiceStore from '@store/service.store';
import { useState } from 'react';

import { Button } from '@ant-design/react-native';
import Modal from '@components/modal';
import SelectableServiceList from '@components/selectable-service-list';
import ServiceList from '@components/service-list';
import { Alert } from 'react-native';

function convertSelectedService(selectedServices: SelectedService[]): Service[] {
  return selectedServices.map(workerService => {
    return {
      ...workerService.service,
      price: workerService.price ?? workerService.service.price,
    };
  });
}

const MyServiceSection = () => {
  const { services, selectedServices, setSelectedServices } = useServiceStore(state => state);
  const [selectServicesModalVisible, setSelectServicesModalVisible] = useState(false);

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

  return (
    <ServiceList
      services={convertSelectedService(selectedServices)}
      emptyMessage="У вас пока нет выбранных услуг"
    >
      <Button type="primary" onPress={openSelectServiceModal}>
        Выбрать услуги
      </Button>

      <Modal
        title="Выбор услуг"
        isOpen={selectServicesModalVisible}
        close={() => setSelectServicesModalVisible(false)}
      >
        <SelectableServiceList
          services={services}
          selectedList={selectedServices}
          onSuccess={pushWorkerServices}
        />
      </Modal>
    </ServiceList>
  );
};

export default MyServiceSection;

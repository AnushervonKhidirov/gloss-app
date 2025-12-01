import type { SelectedService, Service } from '@type/service.type';

import serviceService from '@service/service.service';
import useServiceStore from '@store/service.store';
import { useLayoutEffect, useState } from 'react';

import LoadingView from '@commonComponent/loading-view';
import ServiceList from '@component/service/service-list';
import useUserStore from '@store/user.store';
import { Alert } from 'react-native';

import { Button } from '@ant-design/react-native';
import Modal from '@commonComponent/modal';
import SelectableServiceList from '@component/service/selectable-service-list';
import { alertError } from '@helper/error-handler';

function convertSelectedService(selectedServices: SelectedService[]): Service[] {
  return selectedServices.map(selectedService => {
    return {
      ...selectedService.service,
      price: selectedService.price ?? selectedService.service.price,
    };
  });
}

const SelectedServiceScreen = () => {
  const user = useUserStore(state => state.user);

  const { services, selectedServices, setServices } = useServiceStore(state => state);
  const [selectServicesModalVisible, setSelectServicesModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  function setSelectedServices(selectedServices: SelectedService[]) {
    setServices({ selectedServices });
    setSelectServicesModalVisible(false);
  }

  function openSelectServiceModal() {
    if (services.length === 0) {
      Alert.alert('Нет созданных услуг', 'Сначала создайте услуги в разделе "Все услуги"');
      return;
    }

    setSelectServicesModalVisible(true);
  }

  async function fetchOnLoad() {
    setLoading(true);
    await fetchData();
    setLoading(false);
  }

  async function fetchData() {
    await fetchServices();
    await fetchSelectedServices();
  }

  async function fetchServices() {
    const [services, err] = await serviceService.findMany();

    if (err) {
      alertError(err);
    } else {
      setServices({ services });
    }
  }

  async function fetchSelectedServices() {
    const [services, err] = await serviceService.findManySelected({ userId: user?.id });

    if (err) {
      alertError(err);
    } else {
      setServices({ selectedServices: services });
    }
  }

  useLayoutEffect(() => {
    fetchOnLoad();
  }, []);

  return (
    <LoadingView loading={loading}>
      <ServiceList
        services={convertSelectedService(selectedServices)}
        onRefresh={fetchData}
        keyExtractor={service => `selected-list-${service.id}`}
        emptyMessage="У вас пока нет выбранных услуг"
      >
        <Button type="primary" onPress={openSelectServiceModal}>
          {selectedServices.length === 0 ? 'Выбрать услуги' : 'Редактировать'}
        </Button>
      </ServiceList>

      <Modal
        title="Выбор услуг"
        isOpen={selectServicesModalVisible}
        close={() => setSelectServicesModalVisible(false)}
      >
        <SelectableServiceList
          services={services}
          selectedList={selectedServices}
          onSuccess={setSelectedServices}
          onRefresh={fetchData}
        />
      </Modal>
    </LoadingView>
  );
};

export default SelectedServiceScreen;

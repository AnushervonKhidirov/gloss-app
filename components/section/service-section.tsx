import type { Service } from '@type/service.type';

import useServiceStore from '@store/service.store';
import { useState } from 'react';

import { Button } from '@ant-design/react-native';
import CreateServiceForm from '@components/form/create-service-form';
import Modal from '@components/modal';
import ServiceList from '@components/service-list';
import { Alert } from 'react-native';

const ServiceSection = () => {
  const { services, categories, pushServices } = useServiceStore(state => state);
  const [createServiceModalVisible, setCreateServiceModalVisible] = useState(false);

  function pushService(service: Service) {
    pushServices([service]);
    setCreateServiceModalVisible(false);
  }

  function openCreateServiceModal() {
    if (categories.length === 0) {
      Alert.alert('Нет созданных категорий', 'Сначала создайте категории в разделе "Категории"');
      return;
    }

    setCreateServiceModalVisible(true);
  }

  return (
    <ServiceList
      services={services}
      editable={true}
      emptyMessage="Список предоставляемых услуг пуст"
    >
      <Button type="primary" onPress={openCreateServiceModal}>
        Создать услугу
      </Button>

      <Modal
        title="Создание услуги"
        isOpen={createServiceModalVisible}
        close={() => setCreateServiceModalVisible(false)}
      >
        <CreateServiceForm categories={categories} onSuccess={pushService} />
      </Modal>
    </ServiceList>
  );
};

export default ServiceSection;

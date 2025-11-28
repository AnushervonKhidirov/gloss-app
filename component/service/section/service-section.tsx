import type { Service } from '@type/service.type';

import useServiceStore from '@store/service.store';
import useUserStore from '@store/user.store';
import { Role } from '@type/user.type';
import { useState } from 'react';

import { Button } from '@ant-design/react-native';
import Modal from '@commonComponent/modal';
import { Alert } from 'react-native';
import CreateServiceForm from '../form/create-service-form';
import EditServiceForm from '../form/edit-service-form';
import ServiceList from '../service-list';

import serviceService from '@service/service.service';

const ServiceSection = () => {
  const user = useUserStore(state => state.user);
  const { services, categories, setServices, pushServices, editService, deleteService } =
    useServiceStore(state => state);

  const [toEdit, setToEdit] = useState<Service | null>(null);
  const [createServiceModalVisible, setCreateServiceModalVisible] = useState(false);
  const [editServiceModalVisible, setEditServiceModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  function push(service: Service) {
    pushServices([service]);
    setCreateServiceModalVisible(false);
  }

  function edit(service: Service) {
    editService(service);
    setEditServiceModalVisible(false);
  }

  function removeConfirm(service: Service) {
    Alert.alert(
      'Удаление',
      `После удаления нельзя восстановить! Вы хотите удалить ${service.name}?`,
      [
        {
          text: 'Да',
          onPress: () => remove(service),
        },
        {
          text: 'Нет',
        },
      ],
    );
  }

  function openCreateForm() {
    if (categories.length === 0) {
      Alert.alert('Нет созданных категорий', 'Сначала создайте категории в разделе "Категории"');
      return;
    }

    setCreateServiceModalVisible(true);
  }

  function openEditServiceModal(service: Service) {
    setToEdit(service);
    setEditServiceModalVisible(true);
  }

  async function refreshServices() {
    setRefreshing(true);
    const [services, err] = await serviceService.findMany();

    if (err) {
      Alert.alert('Ошибка', err.error);
    } else {
      setServices(services);
    }

    setRefreshing(false);
  }

  async function remove(service: Service) {
    const [removedService, err] = await serviceService.delete(service.id);

    if (err) {
      Alert.alert('Ошибка', err.error);
    } else {
      deleteService(removedService);
    }
  }

  return (
    <ServiceList
      services={services}
      editable={true}
      refreshing={refreshing}
      emptyMessage="Список предоставляемых услуг пуст"
      onEdit={user?.role === Role.ADMIN ? openEditServiceModal : undefined}
      onRemove={user?.role === Role.ADMIN ? removeConfirm : undefined}
      onRefresh={refreshServices}
    >
      {user?.role === Role.ADMIN && (
        <>
          <Button type="primary" onPress={openCreateForm}>
            Создать услугу
          </Button>

          <Modal
            title="Создание услуги"
            isOpen={createServiceModalVisible}
            close={() => setCreateServiceModalVisible(false)}
          >
            <CreateServiceForm categories={categories} onSuccess={push} />
          </Modal>

          <Modal
            title="Редактирование услуги"
            isOpen={editServiceModalVisible}
            close={() => setEditServiceModalVisible(false)}
          >
            <EditServiceForm serviceToEdit={toEdit} categories={categories} onSuccess={edit} />
          </Modal>
        </>
      )}
    </ServiceList>
  );
};

export default ServiceSection;

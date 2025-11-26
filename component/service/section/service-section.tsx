import type { Service } from '@type/service.type';

import useServiceStore from '@store/service.store';
import { useState } from 'react';

import { Button } from '@ant-design/react-native';
import Modal from '@commonComponent/modal';
import { Alert } from 'react-native';
import CreateServiceForm from '../form/create-service-form';
import EditServiceForm from '../form/edit-service-form';
import ServiceList from '../service-list';

import serviceService from '@services/service.service';

const ServiceSection = () => {
  const { services, categories, pushServices, editService, deleteService } = useServiceStore(
    state => state,
  );
  const [toEdit, setToEdit] = useState<Service | null>(null);
  const [createServiceModalVisible, setCreateServiceModalVisible] = useState(false);
  const [editServiceModalVisible, setEditServiceModalVisible] = useState(false);

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

  async function remove(service: Service) {
    const [removedService, err] = await serviceService.delete(service.id);

    if (err) {
      if (err.statusCode === 403) {
        Alert.alert('Запрет', 'Только администранор может создавать услуги');
      } else if (err.statusCode >= 500) {
        Alert.alert('Ошибка сервера', 'Что-то пошло не так, попробуйте позже');
      } else {
        Alert.alert('Ошибка', 'Причина не известна');
      }
    } else {
      deleteService(removedService);
    }
  }

  return (
    <ServiceList
      services={services}
      editable={true}
      emptyMessage="Список предоставляемых услуг пуст"
      onEdit={openEditServiceModal}
      onRemove={removeConfirm}
    >
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
    </ServiceList>
  );
};

export default ServiceSection;

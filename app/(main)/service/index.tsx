import type { Service } from '@type/service.type';

import categoryService from '@service/category.service';
import serviceService from '@service/service.service';
import useCategoryStore from '@store/category.store';
import useServiceStore from '@store/service.store';
import { useLayoutEffect, useState } from 'react';

import LoadingView from '@commonComponent/loading-view';
import ServiceList from '@component/service/service-list';
import useUserStore from '@store/user.store';
import { Alert } from 'react-native';

import { Button } from '@ant-design/react-native';
import Modal from '@commonComponent/modal';
import CreateServiceForm from '@component/service/form/create-service-form';
import EditServiceForm from '@component/service/form/edit-service-form';
import { alertError } from '@helper/error-handler';
import { Role } from '@type/user.type';

const ServiceScreen = () => {
  const user = useUserStore(state => state.user);
  const { services, setServices, pushServices, editService, deleteService } = useServiceStore(
    state => state,
  );
  const { categories, setCategories } = useCategoryStore(state => state);

  const [loading, setLoading] = useState(false);
  const [toEdit, setToEdit] = useState<Service | null>(null);
  const [createServiceModalVisible, setCreateServiceModalVisible] = useState(false);
  const [editServiceModalVisible, setEditServiceModalVisible] = useState(false);

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

  function push(service: Service) {
    pushServices({ services: [service] });
    setCreateServiceModalVisible(false);
  }

  function edit(service: Service) {
    editService({ service });
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

  async function remove(service: Service) {
    const [removedService, err] = await serviceService.delete(service.id);

    if (err) {
      alertError(err);
    } else {
      deleteService({ service: removedService });
    }
  }

  async function fetchOnLoad() {
    setLoading(true);
    await fetchData();
    setLoading(false);
  }

  async function fetchData() {
    await fetchServices();
    await fetchCategories();
  }

  async function fetchServices() {
    const [services, err] = await serviceService.findMany();

    if (err) {
      alertError(err);
    } else {
      setServices({ services });
    }
  }

  async function fetchCategories() {
    const [categories, err] = await categoryService.findMany();

    if (err) {
      alertError(err);
    } else {
      setCategories(categories);
    }
  }

  useLayoutEffect(() => {
    fetchOnLoad();
  }, []);

  return (
    <LoadingView loading={loading}>
      <ServiceList
        services={services}
        onRefresh={fetchData}
        onEdit={user?.role === Role.ADMIN ? openEditServiceModal : undefined}
        onRemove={user?.role === Role.ADMIN ? removeConfirm : undefined}
      >
        {user?.role === Role.ADMIN && (
          <Button type="primary" onPress={openCreateForm}>
            Создать услугу
          </Button>
        )}
      </ServiceList>

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
    </LoadingView>
  );
};

export default ServiceScreen;

import type { Category } from '@type/category.type';
import type { SelectedService, Service } from '@type/service.type';

import { Button, Tabs } from '@ant-design/react-native';
import { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';

import CategoryList from '@components/category-list';
import CreateCategoryForm from '@components/form/create-category-form';
import CreateServiceForm from '@components/form/create-service-form';
import Modal from '@components/modal';
import SelectableServiceList from '@components/selectable-service-list';
import ServiceList from '@components/service-list';

import { CategoryService } from '@services/category.service';
import { ServiceService } from '@services/service.service';

const categoryService = new CategoryService();
const serviceService = new ServiceService();

const tabs = [{ title: 'Все услуги' }, { title: 'Мои услуги' }, { title: 'Категории' }];

const ServicesScreen = () => {
  const [createServiceModalVisible, setCreateServiceModalVisible] = useState(false);
  const [selectServicesModalVisible, setSelectServicesModalVisible] = useState(false);
  const [createCategoryModalVisible, setCreateCategoryModalVisible] = useState(false);

  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  function openCreateServiceModal() {
    if (categories.length === 0) {
      Alert.alert('Нет созданных категорий', 'Сначала создайте категории в разделе "Категории"');
      return;
    }

    setCreateServiceModalVisible(true);
  }

  function openSelectServiceModal() {
    if (services.length === 0) {
      Alert.alert('Нет созданных услуг', 'Сначала создайте услуги в разделе "Все услуги"');
      return;
    }

    setSelectServicesModalVisible(true);
  }

  async function fetchServices() {
    const [services, err] = await serviceService.findMany();

    if (err) {
      console.log(err);
    } else {
      setServices(services);
    }
  }

  async function fetchSelectedServices() {
    const [services, err] = await serviceService.findManySelected();

    if (err) {
      console.log(err);
    } else {
      setSelectedServices(services);
    }
  }

  async function fetchCategories() {
    const [categories, err] = await categoryService.findMany();

    if (err) {
      console.log(err);
    } else {
      setCategories(categories);
    }
  }

  async function fetchData() {
    await fetchServices();
    await fetchSelectedServices();
    await fetchCategories();
  }

  function pushService(service: Service) {
    setServices(prevState => [...prevState, service]);
    setCreateServiceModalVisible(false);
  }

  function pushCategory(category: Category) {
    setCategories(prevState => [...prevState, category]);
    setCreateCategoryModalVisible(false);
  }

  function pushWorkerServices(workerService: SelectedService[]) {
    setSelectedServices(workerService);
    setSelectServicesModalVisible(false);
  }

  function convertSelectedService(selectedServices: SelectedService[]): Service[] {
    return selectedServices.map(workerService => {
      return {
        ...workerService.service,
        price: workerService.price ?? workerService.service.price,
      };
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Tabs tabs={tabs}>
        <ServiceList services={services} emptyMessage="Список предоставляемых услуг пуст">
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

        <CategoryList categories={categories}>
          <Button type="primary" onPress={() => setCreateCategoryModalVisible(true)}>
            Создать категорию
          </Button>

          <Modal
            title="Создание категории"
            isOpen={createCategoryModalVisible}
            close={() => setCreateCategoryModalVisible(false)}
          >
            <CreateCategoryForm onSuccess={pushCategory} />
          </Modal>
        </CategoryList>
      </Tabs>
    </View>
  );
};

export default ServicesScreen;

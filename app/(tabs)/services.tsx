import type { Category } from '@type/category.type';
import type { Service } from '@type/service.type';

import { Tabs } from '@ant-design/react-native';
import CategoryList from '@components/category-list';
import CreateCategoryForm from '@components/form/create-category-form';
import CreateServiceForm from '@components/form/create-service-form';
import Modal from '@components/modal';
import ServiceList from '@components/service-list';
import { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';

import { CategoryService } from '@services/category.service';
import { ServiceService } from '@services/service.service';

const categoryService = new CategoryService();
const serviceService = new ServiceService();

const tabs = [{ title: 'Все услуги' }, { title: 'Мои услуги' }, { title: 'Категории' }];

const ServicesScreen = () => {
  const [createServiceModalVisible, setCreateServiceModalVisible] = useState(false);
  const [createCategoryModalVisible, setCreateCategoryModalVisible] = useState(false);

  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  async function fetchServices() {
    const [services, err] = await serviceService.findMany();

    if (err) {
      console.log(err);
    } else {
      setServices(services);
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
    await fetchCategories();
  }

  function pushService(service: Service) {
    setServices(prevState => [...prevState, service]);
  }

  function pushCategory(category: Category) {
    setCategories(prevState => [...prevState, category]);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
      <View style={{ flex: 1 }}>
        <Tabs tabs={tabs}>
          <ServiceList services={services}>
            <Button title="Создать услугу" onPress={() => setCreateServiceModalVisible(true)} />

            <Modal
              title="Создание услуги"
              isOpen={createServiceModalVisible}
              close={() => setCreateServiceModalVisible(false)}
            >
              <CreateServiceForm categories={categories} onSuccess={pushService} />
            </Modal>
          </ServiceList>

          <View>
            <Text>Content of Second Tab</Text>
          </View>

          <CategoryList categories={categories}>
            <Button title="Создать категорию" onPress={() => setCreateCategoryModalVisible(true)} />

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

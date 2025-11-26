import useServiceStore from '@store/service.store';
import { useEffect, useState } from 'react';

import { Tabs } from '@ant-design/react-native';
import LoadingView from '@commonComponent/loading-view';
import CategorySection from '@component/category/section/category-section';
import MyServiceSection from '@component/service/section/my-service-section';
import ServiceSection from '@component/service/section/service-section';

import categoryService from '@services/category.service';
import serviceService from '@services/service.service';

const tabs = [{ title: 'Все услуги' }, { title: 'Мои услуги' }, { title: 'Категории' }];

const ServicesScreen = () => {
  const { setMany } = useServiceStore(state => state);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  async function fetchData() {
    setLoading(true);

    const [services, servicesErr] = await serviceService.findMany();
    const [selectedServices, selectedServicesErr] = await serviceService.findManySelected();
    const [categories, categoriesErr] = await categoryService.findMany();

    if (servicesErr || selectedServicesErr || categoriesErr) {
      setIsError(true);
    } else {
      setMany({ services, selectedServices, categories });
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <LoadingView
      loading={loading}
      isError={isError}
      errorMessage="Невозможно получить данные, пожалуйста повторите позже"
    >
      <Tabs tabs={tabs}>
        <ServiceSection />
        <MyServiceSection />
        <CategorySection />
      </Tabs>
    </LoadingView>
  );
};

export default ServicesScreen;

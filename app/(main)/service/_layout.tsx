import { TabBar } from '@component/common';

const tabs = [{ name: 'index', title: 'Все услуги' }, { name: 'selected', title: 'Мои услуги' }]

const ServiceLayout = () => {
  return <TabBar tabs={tabs} />;
};

export default ServiceLayout;

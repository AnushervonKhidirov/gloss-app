import { TabBar } from '@component/common';

const tabs = [
  { name: 'index', title: 'Мои записи' },
  { name: 'other', title: 'Остальные' },
  { name: 'completed', title: 'Законченные' },
];

const AppointmentLayout = () => {
  return <TabBar tabs={tabs} />;
};

export default AppointmentLayout;

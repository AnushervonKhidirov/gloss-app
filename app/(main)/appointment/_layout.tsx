import TabBar from '@commonComponent/tab-bar';

const tabs = [
  { name: 'index', title: 'Мои записи' },
  { name: 'other', title: 'Остальные' },
  { name: 'passed', title: 'Прошедшие' },
];

const AppointmentLayout = () => {
  return <TabBar tabs={tabs} />;
};

export default AppointmentLayout;

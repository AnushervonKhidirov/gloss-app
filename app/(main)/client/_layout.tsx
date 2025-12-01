import TabBar from '@commonComponent/tab-bar';

const tabs = [
  { name: 'index', title: 'Все' },
  { name: 'black-list', title: 'Черный список' },
];

const ClientLayout = () => {
  return <TabBar tabs={tabs} />;
};

export default ClientLayout;

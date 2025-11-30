import { Drawer } from 'expo-router/drawer';

import { blue } from '@ant-design/colors';

import dayjs from 'dayjs';
import ru from 'dayjs/locale/ru';
import duration from 'dayjs/plugin/duration';
import localeData from 'dayjs/plugin/localeData';
import { StyleSheet } from 'react-native';

dayjs.locale(ru);
dayjs.extend(localeData);
dayjs.extend(duration);

const MainLayout = () => {
  return (
    <Drawer
      screenOptions={{
        swipeEdgeWidth: 45,
        drawerPosition: 'right',
        drawerContentContainerStyle: styles.drawerMenu,
        drawerItemStyle: styles.drawerMenuItem,
        drawerActiveBackgroundColor: blue.primary,
        drawerActiveTintColor: '#fff',
        drawerInactiveBackgroundColor: blue[0],
        drawerInactiveTintColor: '#000',
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />

      <Drawer.Screen
        name="appointment"
        options={{
          drawerLabel: 'Записи',
          title: 'Записи',
        }}
      />

      <Drawer.Screen
        name="client"
        options={{
          drawerLabel: 'Клиенты',
          title: 'Клиенты',
        }}
      />

      <Drawer.Screen
        name="service"
        options={{
          drawerLabel: 'Услуги',
          title: 'Услуги',
        }}
      />

      <Drawer.Screen
        name="worker"
        options={{
          drawerLabel: 'Сотрудники',
          title: 'Сотрудники',
        }}
      />

      <Drawer.Screen
        name="category"
        options={{
          drawerLabel: 'Категории',
          title: 'Категории',
        }}
      />

      <Drawer.Screen
        name="company"
        options={{
          drawerLabel: 'Компания',
          title: 'Компания',
        }}
      />

      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: 'Профиль',
          title: 'Профиль',
        }}
      />
    </Drawer>
  );
};

const styles = StyleSheet.create({
  drawerMenu: {
    gap: 10,
  },
  drawerMenuItem: {
    borderRadius: 10,
  },
});

export default MainLayout;

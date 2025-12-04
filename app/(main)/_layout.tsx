import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Drawer } from 'expo-router/drawer';
import { StyleSheet } from 'react-native';

import { Provider } from '@ant-design/react-native';
import { antTheme, grey } from '@constant/theme';

import dayjs from 'dayjs';
import ru from 'dayjs/locale/ru';
import duration from 'dayjs/plugin/duration';
import localeData from 'dayjs/plugin/localeData';

dayjs.locale(ru);
dayjs.extend(localeData);
dayjs.extend(duration);

const MainLayout = () => {
  return (
    <Provider theme={antTheme}>
      <Drawer
        screenOptions={{
          swipeEdgeWidth: 55,
          drawerPosition: 'right',
          drawerStyle: styles.drawer,
          drawerContentContainerStyle: styles.drawerMenu,
          drawerItemStyle: styles.drawerMenuItem,
          drawerActiveBackgroundColor: grey[9],
          drawerActiveTintColor: grey[1],
          drawerInactiveBackgroundColor: grey[1],
          drawerInactiveTintColor: grey[9],
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        <Drawer.Screen
          name="appointment"
          options={{
            title: 'Записи',
            drawerLabel: 'Записи',
            drawerIcon: ({ color }) => (
              <MaterialCommunityIcons name="calendar-account" size={24} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="create-appointment"
          options={{
            title: 'Добавить запись',
            drawerLabel: 'Добавить запись',
            drawerIcon: ({ color }) => (
              <MaterialCommunityIcons name="calendar-plus" size={24} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="client"
          options={{
            title: 'Клиенты',
            drawerLabel: 'Клиенты',
            drawerIcon: ({ color }) => (
              <MaterialCommunityIcons name="human-male-female" size={24} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="worker"
          options={{
            title: 'Сотрудники',
            drawerLabel: 'Сотрудники',
            drawerIcon: ({ color }) => (
              <MaterialCommunityIcons name="account-group" size={24} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="service"
          options={{
            title: 'Услуги',
            drawerLabel: 'Услуги',
            drawerIcon: ({ color }) => (
              <MaterialCommunityIcons name="hand-coin" size={24} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="category"
          options={{
            title: 'Категории',
            drawerLabel: 'Категории',
            drawerIcon: ({ color }) => (
              <MaterialCommunityIcons name="folder-open" size={24} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="specialty"
          options={{
            title: 'Специальности',
            drawerLabel: 'Специальности',
            drawerIcon: ({ color }) => (
              <MaterialCommunityIcons name="book-education" size={24} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="company"
          options={{
            title: 'Компания',
            drawerLabel: 'Компания',
            drawerIcon: ({ color }) => (
              <MaterialCommunityIcons name="office-building" size={24} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="profile"
          options={{
            title: 'Профиль',
            drawerLabel: 'Профиль',
            drawerIcon: ({ color }) => (
              <MaterialCommunityIcons name="account" size={24} color={color} />
            ),
          }}
        />
      </Drawer>
    </Provider>
  );
};

const styles = StyleSheet.create({
  drawer: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  drawerMenu: {
    gap: 10,
  },
  drawerMenuItem: {
    borderRadius: 5,
  },
});

export default MainLayout;

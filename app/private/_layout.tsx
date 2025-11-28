import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const TabsLayout = () => {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <Tabs screenOptions={{ headerShown: false, animation: 'shift' }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Записи',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons size={28} name="human-queue" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="clients"
          options={{
            title: 'Клиенты',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons size={24} name="human-male-female" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="services"
          options={{
            title: 'Услуги',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons size={24} name="hand-coin" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="workers"
          options={{
            title: 'Сотрудники',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons size={24} name="account-multiple" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Прифиль',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons size={24} name="account" color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
};

export default TabsLayout;

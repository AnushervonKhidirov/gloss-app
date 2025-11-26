import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Foundation from '@expo/vector-icons/Foundation';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const TabsLayout = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs screenOptions={{ headerShown: false, animation: 'fade' }}>
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
          name="workers"
          options={{
            title: 'Сотрудники',
            tabBarIcon: ({ color }) => <Foundation size={28} name="torsos-all" color={color} />,
          }}
        />

        <Tabs.Screen
          name="services"
          options={{
            title: 'Услуги',
            tabBarIcon: ({ color }) => (
              <FontAwesome6 size={24} name="hands-holding-circle" color={color} />
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

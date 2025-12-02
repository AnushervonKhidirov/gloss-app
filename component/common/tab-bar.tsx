import type { FC } from 'react';

import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

import { grey } from '@constant/theme';

type TabBarProps = {
  tabs?: TabList[];
};

type TabList = {
  name: string;
  title: string;
};

const TabBar: FC<TabBarProps> = ({ tabs }) => {
  const tabList = tabs && tabs.length > 0 ? tabs : [{ name: 'index', title: '' }];

  return (
    <Tabs
      screenOptions={{
        sceneStyle: { padding: 16 },
        headerShown: false,
        animation: 'shift',
        tabBarStyle: { display: tabList.length > 1 ? undefined : 'none' },
        tabBarIconStyle: { display: 'none' },
        tabBarItemStyle: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        tabBarLabelStyle: { fontSize: 14, fontWeight: 700 },
        tabBarInactiveTintColor: grey[5],
        tabBarActiveTintColor: grey[9],
      }}
    >
      {tabList.map(({ name, title }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: title,
          }}
        />
      ))}
    </Tabs>
  );
};

const styles = StyleSheet.create({});

export default TabBar;

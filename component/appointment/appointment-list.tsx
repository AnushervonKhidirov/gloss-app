import type { Appointment } from '@type/appointment.type';
import type { FC } from 'react';

import { useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import AppointmentCard from './appointment-card';

type AppointmentListProps = {
  appointments: Appointment[];
  emptyMessage?: string;
  refresh: () => Promise<void>;
};

const AppointmentList: FC<AppointmentListProps> = ({ appointments, emptyMessage, refresh }) => {
  const message = emptyMessage ?? 'Список пуст';

  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }

  return (
    <ScrollView
      style={{ flex: 1, paddingRight: 10, marginRight: -10 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={{ gap: 10, flex: 1 }}>
        {appointments.length > 0 ? (
          appointments.map(appointment => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))
        ) : (
          <Text>{message}</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default AppointmentList;

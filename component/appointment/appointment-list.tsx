import type { Appointment } from '@type/appointment.type';
import type { FC } from 'react';

import ScrollView from '@commonComponent/scroll-view';
import { Text } from 'react-native';
import AppointmentCard from './appointment-card';

type AppointmentListProps = {
  appointments: Appointment[];
  emptyMessage?: string;
  refresh: () => Promise<void>;
};

const AppointmentList: FC<AppointmentListProps> = ({ appointments, emptyMessage, refresh }) => {
  const message = emptyMessage ?? 'Список пуст';

  return (
    <ScrollView onRefresh={refresh}>
      {appointments.length > 0 ? (
        appointments.map(appointment => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))
      ) : (
        <Text>{message}</Text>
      )}
    </ScrollView>
  );
};

export default AppointmentList;

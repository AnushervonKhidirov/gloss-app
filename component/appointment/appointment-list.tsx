import type { Appointment } from '@type/appointment.type';
import type { FC } from 'react';

import ScrollView from '@commonComponent/scroll-view';
import AppointmentCard from './appointment-card';

type AppointmentListProps = {
  appointments: Appointment[];
  refresh: () => Promise<void>;
};

const AppointmentList: FC<AppointmentListProps> = ({ appointments, refresh }) => {
  return (
    <ScrollView
      searchable
      searchIconName="calendar-search-outline"
      onRefresh={refresh}
      items={appointments}
      renderItem={appointment => <AppointmentCard key={appointment.id} appointment={appointment} />}
    />
  );
};

export default AppointmentList;

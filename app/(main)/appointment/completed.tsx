import useAppointmentStore from '@store/appointment.store';
import dayjs from 'dayjs';
import { useLayoutEffect, useState } from 'react';

import LoadingView from '@commonComponent/loading-view';
import AppointmentList from '@component/appointment/appointment-list';
import { Alert } from 'react-native';

import appointmentService from '@service/appointment.service';

const PassedAppointmentScreen = () => {
  const { completedAppointments, setCompletedAppointments } = useAppointmentStore(state => state);
  const [loading, setLoading] = useState(true);

  async function fetchOnLoad() {
    setLoading(true);
    await fetch();
    setLoading(false);
  }

  async function fetch() {
    const [appointments, err] = await appointmentService.findMany({ dateTo: dayjs() });

    if (err) {
      Alert.alert(err.error, Array.isArray(err.message) ? err.message.join(';') : err.message);
    } else {
      setCompletedAppointments(appointments);
    }
  }

  useLayoutEffect(() => {
    fetchOnLoad();
  }, []);

  return (
    <LoadingView loading={loading}>
      <AppointmentList appointments={completedAppointments} refresh={fetch} />
    </LoadingView>
  );
};

export default PassedAppointmentScreen;

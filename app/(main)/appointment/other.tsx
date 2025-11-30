import useAppointmentStore from '@store/appointment.store';
import useUserStore from '@store/user.store';
import dayjs from 'dayjs';
import { useLayoutEffect, useState } from 'react';

import LoadingView from '@commonComponent/loading-view';
import AppointmentList from '@component/appointment/appointment-list';
import { Alert } from 'react-native';

import appointmentService from '@service/appointment.service';

const OthersAppointmentScreen = () => {
  const user = useUserStore(state => state.user);
  const { appointments, setAppointments } = useAppointmentStore(state => state);
  const [loading, setLoading] = useState(true);

  async function fetchOnLoad() {
    setLoading(true);
    await fetch();
    setLoading(false);
  }

  async function fetch() {
    const [appointments, err] = await appointmentService.findMany({
      exceptUserId: user?.id,
      dateFrom: dayjs(),
    });

    if (err) {
      Alert.alert(err.error, Array.isArray(err.message) ? err.message.join(';') : err.message);
    } else {
      setAppointments(appointments);
    }
  }

  useLayoutEffect(() => {
    fetchOnLoad();
  }, []);

  return (
    <LoadingView loading={loading}>
      <AppointmentList appointments={appointments} refresh={fetch} />
    </LoadingView>
  );
};

export default OthersAppointmentScreen;

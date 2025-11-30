import useAppointmentStore from '@store/appointment.store';
import dayjs from 'dayjs';
import { useLayoutEffect, useState } from 'react';

import LoadingView from '@commonComponent/loading-view';
import AppointmentList from '@component/appointment/appointment-list';
import { Alert } from 'react-native';

import appointmentService from '@service/appointment.service';

const MyAppointmentScreen = () => {
  const { myAppointments, setMyAppointments } = useAppointmentStore(state => state);
  const [loading, setLoading] = useState(true);

  async function fetchOnLoad() {
    setLoading(true);
    await fetch();
    setLoading(false);
  }

  async function fetch() {
    const [appointments, err] = await appointmentService.findMy({ dateFrom: dayjs() });

    if (err) {
      Alert.alert(err.error, err.message);
    } else {
      setMyAppointments(appointments);
    }
  }

  useLayoutEffect(() => {
    fetchOnLoad();
  }, []);

  return (
    <LoadingView loading={loading}>
      <AppointmentList appointments={myAppointments} refresh={fetch} />
    </LoadingView>
  );
};

export default MyAppointmentScreen;

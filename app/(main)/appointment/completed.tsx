import useAppointmentStore from '@store/appointment.store';
import dayjs from 'dayjs';
import { useLayoutEffect, useState } from 'react';

import LoadingView from '@commonComponent/loading-view';
import AppointmentList from '@component/appointment/appointment-list';

import { alertError } from '@helper/error-handler';
import appointmentService from '@service/appointment.service';

const PassedAppointmentScreen = () => {
  const { completedAppointments, setAppointments } = useAppointmentStore(state => state);
  const [loading, setLoading] = useState(true);

  async function fetchOnLoad() {
    setLoading(true);
    await fetch();
    setLoading(false);
  }

  async function fetch() {
    const [appointments, err] = await appointmentService.findMany({ dateTo: dayjs() });

    if (err) {
      alertError(err)
    } else {
      setAppointments({ completedAppointments: appointments });
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

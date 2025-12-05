import type { SelectableTime } from '@type/time.type';
import type { Worker } from '@type/worker.type';
import type { Dayjs } from 'dayjs';
import type { FC } from 'react';

import useCreateAppointmentStore from '@store/create-appointment.store';
import { useEffect, useState } from 'react';

import Card from '@commonComponent/card';
import DatePicker from '@commonComponent/date-picker';
import LoadingView from '@commonComponent/loading-view';
import ScrollView from '@commonComponent/scroll-view';
import { Text, View } from 'react-native';
import AppointmentTimeList from '../appointment-time-list';

import { appointmentTimeList } from '@constant/appointment-time-list';
import { grey } from '@constant/theme';
import { alertError } from '@helper/error-handler';
import workerService from '@service/worker.service';
import dayjs from 'dayjs';

const SelectWorkerSection = () => {
  const { selectedService, setSelectedWorker, setSelectedTime, setTime } =
    useCreateAppointmentStore(state => state);
  const [loading, setLoading] = useState(false);

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [date, setDate] = useState(dayjs());

  async function fetchOnLoad() {
    setLoading(true);
    await fetchWorkers();
    setLoading(false);
  }

  async function fetchWorkers() {
    setSelectedWorker(undefined);
    setSelectedTime(undefined);
    setTime(null);

    if (!selectedService) {
      alertError({ error: 'Ошибка', message: 'Услуга не выбрана', statusCode: 0 });
      return;
    }

    const [workers, err] = await workerService.findMany({
      serviceId: selectedService.id,
      dateFrom: date.startOf('day'),
      dateTo: date.endOf('day'),
    });

    if (err) {
      alertError(err);
    } else {
      setWorkers(workers);
    }
  }

  useEffect(() => {
    if (workers.length === 0) fetchOnLoad();
  }, [selectedService, date]);

  return (
    selectedService && (
      <View style={{ flex: 1, gap: 16 }}>
        <DatePicker onSelect={setDate} />

        <LoadingView loading={loading} style={{ flex: 1 }}>
          <ScrollView
            searchable
            onRefresh={fetchWorkers}
            items={workers}
            renderItem={worker => (
              <WorkerCard key={'worker-' + worker.id} worker={worker} date={date} />
            )}
          />
        </LoadingView>
      </View>
    )
  );
};

const WorkerCard: FC<{ worker: Worker; date: Dayjs }> = ({ worker, date }) => {
  const { selectedService, time, setSelectedWorker, setSelectedTime, setTime } =
    useCreateAppointmentStore(state => state);

  const price = worker.workerService[0].price ?? worker.workerService[0].service.price;

  const bookedTimes = worker.appointments.map(appointment => {
    const startAt = dayjs(appointment.startAt);
    const endAt = dayjs(appointment.endAt);

    return { ...appointment, startAt, endAt };
  });

  const times = selectedService
    ? appointmentTimeList.map(time => {
        const now = dayjs();
        const timeAsDate = getSelectedTime(time);
        const timeEndAsDate = dayjs(timeAsDate).set(
          'minute',
          dayjs(timeAsDate).minute() + selectedService.duration,
        );

        const isWeekend = timeAsDate.get('day') === 0 || timeAsDate.get('day') === 6;
        const isTimePassed = timeAsDate < now;

        let disabled: boolean = isTimePassed || isWeekend;

        if (!disabled) {
          for (const bookedTime of bookedTimes) {
            const isBooked = timeAsDate >= bookedTime.startAt && timeAsDate < bookedTime.endAt;
            const isMeedDeadline =
              timeEndAsDate <= bookedTime.startAt || timeAsDate >= bookedTime.startAt;

            if (!isBooked && isMeedDeadline) continue;
            disabled = true;
          }
        }

        return { disabled, value: getSelectedTime(time), relatedToId: worker.id };
      })
    : [];

  function getSelectedTime(time: string) {
    const [h, m] = time.split(':').map(item => Number.parseInt(item));
    return dayjs(date).set('hour', h).set('minute', m).set('second', 0);
  }

  function selectTime(time: SelectableTime | null) {
    setTime(time);
    setSelectedTime(time?.value);
    setSelectedWorker(time ? worker : null);
  }

  return (
    <Card>
      <Card.Header
        content={<Text style={{ fontSize: 17 }}>{worker.firstName}</Text>}
        extra={<Text style={{ color: grey[6] }}>Цена: {price} с</Text>}
      />

      <Card.Body>
        <AppointmentTimeList
          relatedToId={worker.id}
          selectedTime={time}
          times={times}
          onSelect={selectTime}
        />
      </Card.Body>
    </Card>
  );
};

export default SelectWorkerSection;

import type { Appointment } from '@type/appointment.type';
import type { Dayjs } from 'dayjs';
import type { FC } from 'react';

import useAppointmentStore from '@store/appointment.store';
import useUserStore from '@store/user.store';
import { Role } from '@type/user.type';
import dayjs from 'dayjs';
import { useState } from 'react';

import { blue, gray, green, orange } from '@ant-design/colors';
import { Button, Card, WingBlank } from '@ant-design/react-native';
import ConnectActionButtons from '@commonComponent/connect-action-buttons';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { cardStyle } from '@constant/card-style';
import { getDateString, minutesToTime } from '@helper/time-converter.helper';
import appointmentService from '@service/appointment.service';
import parsePhoneNumber from 'libphonenumber-js';

function getPrice(appointment: Appointment) {
  const workerService = appointment.user.workerService.find(
    service => service.serviceId === appointment.serviceId,
  );

  return workerService?.price ?? appointment.service.price;
}

function getStatusData(startAt: Dayjs, endAt: Dayjs) {
  const now = dayjs();
  if (now.isAfter(endAt)) return { color: green.primary, text: 'Окончено' };
  if (now.isAfter(startAt) && now.isBefore(endAt))
    return { color: blue.primary, text: 'Обслуживается' };
  return { color: orange.primary, text: 'В ожидании очереди' };
}

const AppointmentCard: FC<{ appointment: Appointment }> = ({ appointment }) => {
  return (
    <Card>
      <Card.Header
        styles={cardStyle.header}
        title={
          <AppointmentHeader
            clientName={appointment.client.name}
            serviceName={appointment.service.name}
          />
        }
        extra={<ConnectActionButtons phone={appointment.client.phone} />}
      />

      <Card.Body>
        <WingBlank>
          <AppointmentItemBody appointment={appointment} />
        </WingBlank>
      </Card.Body>

      <Card.Footer content={<FooterActions appointment={appointment} />} />
    </Card>
  );
};

const AppointmentHeader: FC<{ clientName: string; serviceName: string }> = ({
  clientName,
  serviceName,
}) => {
  return (
    <View>
      <Text style={{ fontSize: 17 }}>{clientName}</Text>
      <Text style={{ color: gray[2] }}>{serviceName}</Text>
    </View>
  );
};

const AppointmentItemBody: FC<{ appointment: Appointment }> = ({ appointment }) => {
  const phone = parsePhoneNumber(appointment.client.phone);

  const price = getPrice(appointment);
  const priceText = price === 0 ? 'Бесплатно' : price + ' с';

  const statusData = getStatusData(appointment.startAt, appointment.endAt);

  return (
    <View style={{ gap: 5 }}>
      <View style={styles.bodyListItem}>
        <Text>Сотрудник</Text>
        <Text>{appointment.user.firstName}</Text>
      </View>

      <View style={styles.bodyListItem}>
        <Text>Номер телефона</Text>
        <Text>{phone?.formatNational()}</Text>
      </View>

      <View style={styles.bodyListItem}>
        <Text>Продолжительность</Text>
        <Text>{minutesToTime(appointment.service.duration)}</Text>
      </View>

      <View style={styles.bodyListItem}>
        <Text>Цена</Text>
        <Text>{priceText}</Text>
      </View>

      <View style={styles.bodyListItem}>
        <Text>Запись на</Text>
        <Text>{getDateString(appointment.startAt)}</Text>
      </View>

      <View style={styles.bodyListItem}>
        <Text>Статус</Text>
        <Text style={{ color: statusData.color, fontWeight: '700' }}>{statusData.text}</Text>
      </View>
    </View>
  );
};

const FooterActions: FC<{ appointment: Appointment }> = ({ appointment }) => {
  const user = useUserStore(state => state.user);
  const { deleteAppointment } = useAppointmentStore(state => state);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [statisticLoading, setStatisticLoading] = useState(false);

  const isPassed = dayjs().isAfter(appointment.endAt);

  function confirmRemoving() {
    const text = isPassed ? 'удалить' : 'отменить'

    Alert.alert(
      'Удаление',
      `Вы уверены что хотите ${text} очередь клиента ${appointment.client.name}`,
      [{ text: 'Да', onPress: () => remove(appointment) }, { text: 'Нет' }],
    );
  }

  function confirmStatistic() {
    Alert.alert(
      'Статистика',
      `Добавить в статистику предоставленную услугу клиенту ${appointment.client.name}`,
      [{ text: 'Да', onPress: () => addToStatistic(appointment) }, { text: 'Нет' }],
    );
  }

  async function remove(appointment: Appointment) {
    setRemoveLoading(true);

    const [appointmentToRemove, err] = await appointmentService.delete(appointment.id);

    if (err) {
      Alert.alert('Ошибка', err.error);
    } else {
      deleteAppointment({
        appointment: appointmentToRemove,
        myAppointment: appointmentToRemove,
        completedAppointment: appointmentToRemove,
      });
    }

    setRemoveLoading(false);
  }

  async function addToStatistic(appointment: Appointment) {
    setStatisticLoading(true);

    const statistic = {
      clientName: appointment.client.name,
      clientPhone: appointment.client.phone,
      service: appointment.service.name,
      appointmentTo: appointment.user.firstName,
      appointmentAt: appointment.startAt.toISOString(),
      price: getPrice(appointment),
    };

    console.log(statistic);

    setStatisticLoading(false);
  }

  return (
    (user?.role === Role.ADMIN || user?.id === appointment.userId) && (
      <View style={{ alignSelf: 'flex-end', flexDirection: 'row', gap: 5 }}>
        <Button type="warning" size="small" loading={removeLoading} onPress={confirmRemoving}>
          {isPassed ? 'Удалить' : 'Отменить'}
        </Button>

        {isPassed && user?.role === Role.ADMIN && (
          <Button type="primary" size="small" loading={statisticLoading} onPress={confirmStatistic}>
            Добавить в статистику
          </Button>
        )}
      </View>
    )
  );
};

const styles = StyleSheet.create({
  bodyListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default AppointmentCard;

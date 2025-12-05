import type { Service } from '@type/service.type';
import type { Worker } from '@type/worker.type';
import type { Dayjs } from 'dayjs';
import type { FC } from 'react';

import Card from '@commonComponent/card';
import { StyleSheet, Text, View } from 'react-native';

import { grey } from '@constant/theme';
import { getDateString, minutesToTime } from '@helper/time-converter.helper';

const CreatedAppointmentCard: FC<{ service: Service; worker: Worker; time: Dayjs }> = ({
  service,
  worker,
  time,
}) => {
  return (
    <Card>
      <Card.Header
        content={
          <AppointmentHeader serviceName={service.name} categoryName={service.category.value} />
        }
      />

      <Card.Body>
        <AppointmentItemBody service={service} worker={worker} time={time} />
      </Card.Body>
    </Card>
  );
};

const AppointmentHeader: FC<{ serviceName: string; categoryName: string }> = ({
  serviceName,
  categoryName,
}) => {
  return (
    <View>
      <Text style={{ fontSize: 17 }}>{serviceName}</Text>
      <Text style={{ color: grey[6] }}>{categoryName}</Text>
    </View>
  );
};

const AppointmentItemBody: FC<{ service: Service; worker: Worker; time: Dayjs }> = ({
  service,
  worker,
  time,
}) => {
  const price = worker.workerService[0].price ?? worker.workerService[0].service.price;
  const priceText = price === 0 ? 'Бесплатно' : price + ' с';

  return (
    <View style={{ gap: 5 }}>
      <View style={styles.bodyListItem}>
        <Text>Сотрудник</Text>
        <Text>{worker.firstName}</Text>
      </View>

      <View style={styles.bodyListItem}>
        <Text>Продолжительность</Text>
        <Text>{minutesToTime(service.duration)}</Text>
      </View>

      <View style={styles.bodyListItem}>
        <Text>Цена</Text>
        <Text>{priceText}</Text>
      </View>

      <View style={styles.bodyListItem}>
        <Text>Запись на</Text>
        <Text>{getDateString(time)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bodyListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default CreatedAppointmentCard;

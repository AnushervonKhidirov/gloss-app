import type { Queue } from '@type/queue.type';
import type { Dayjs } from 'dayjs';
import type { FC } from 'react';

import { Button, Card, WingBlank } from '@ant-design/react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import useQueueStore from '@store/queue.store';
import useUserStore from '@store/user.store';
import { useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { blue, gray, green, orange } from '@ant-design/colors';
import { getDateString, minutesToTime } from '@helper/time-converter.helper';
import dayjs from 'dayjs';

import { scrollerTabMarginBottom } from '@constant/scroller';
import queueService from '@service/queue.service';
import { Role } from '@type/user.type';
import parsePhoneNumber from 'libphonenumber-js';

type QueueListProps = {
  queue: Queue[];
  emptyMessage?: string;
  refresh: () => Promise<void>;
};

type QueueItemProps = {
  queue: Queue;
};

type QueueItemHeaderTextProps = {
  clientName: string;
  serviceName: string;
};

function getStatusData(startAt: Dayjs, endAt: Dayjs) {
  const now = dayjs();
  if (now.isAfter(endAt)) return { color: green.primary, text: 'Окончено' };
  if (now.isAfter(startAt) && now.isBefore(endAt))
    return { color: blue.primary, text: 'Обслуживается' };
  return { color: orange.primary, text: 'В ожидании очереди' };
}

function getPrice(queue: Queue) {
  const workerService = queue.user.workerService.find(
    service => service.serviceId === queue.serviceId,
  );

  return workerService?.price ?? queue.service.price;
}

const QueueList: FC<QueueListProps> = ({ queue, emptyMessage, refresh }) => {
  const message = emptyMessage ?? 'Пока нет очереди';

  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ marginBottom: scrollerTabMarginBottom }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.list}>
          {queue.length > 0 ? (
            queue.map(queueItem => <QueueItem key={queueItem.id} queue={queueItem} />)
          ) : (
            <Text>{message}</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const QueueItem: FC<QueueItemProps> = ({ queue }) => {
  return (
    <Card>
      <Card.Header
        title={
          <QueueItemHeaderText clientName={queue.client.name} serviceName={queue.service.name} />
        }
        extra={<ConversationActions queue={queue} />}
      />

      <Card.Body>
        <WingBlank>
          <QueueItemBody queue={queue} />
        </WingBlank>
      </Card.Body>

      <Card.Footer content={<FooterActions queue={queue} />} />
    </Card>
  );
};

const QueueItemBody: FC<{ queue: Queue }> = ({ queue }) => {
  const phone = parsePhoneNumber(queue.client.phone);

  const price = getPrice(queue);
  const priceText = price === 0 ? 'Бесплатно' : price + ' с';

  const statusData = getStatusData(queue.startAt, queue.endAt);

  return (
    <View style={{ gap: 5 }}>
      <View style={styles.bodyListItem}>
        <Text>Сотрудник</Text>
        <Text>{queue.user.firstName}</Text>
      </View>

      <View style={styles.bodyListItem}>
        <Text>Номер телефона</Text>
        <Text>{phone?.formatNational()}</Text>
      </View>

      <View style={styles.bodyListItem}>
        <Text>Продолжительность</Text>
        <Text>{minutesToTime(queue.service.duration)}</Text>
      </View>

      <View style={styles.bodyListItem}>
        <Text>Цена</Text>
        <Text>{priceText}</Text>
      </View>

      <View style={styles.bodyListItem}>
        <Text>Запись на</Text>
        <Text>{getDateString(queue.startAt)}</Text>
      </View>

      <View style={styles.bodyListItem}>
        <Text>Статус</Text>
        <Text style={{ color: statusData.color, fontWeight: '700' }}>{statusData.text}</Text>
      </View>
    </View>
  );
};

const QueueItemHeaderText: FC<QueueItemHeaderTextProps> = ({ clientName, serviceName }) => {
  return (
    <View>
      <Text style={{ fontSize: 17 }}>{clientName}</Text>
      <Text style={{ color: gray[2] }}>{serviceName}</Text>
    </View>
  );
};

const ConversationActions: FC<Omit<QueueItemProps, 'onRemove'>> = ({ queue }) => {
  return (
    <View style={{ alignSelf: 'flex-end', flexDirection: 'row', gap: 5 }}>
      <Pressable onPress={() => Linking.openURL(`sms:${queue.client.phone}`)}>
        <MaterialCommunityIcons name="email-outline" size={24} color={blue.primary} />
      </Pressable>

      <Pressable onPress={() => Linking.openURL(`tel:${queue.client.phone}`)}>
        <MaterialCommunityIcons name="phone" size={24} color={green.primary} />
      </Pressable>
    </View>
  );
};

const FooterActions: FC<QueueItemProps> = ({ queue }) => {
  const user = useUserStore(state => state.user);
  const { deleteFromAll } = useQueueStore(state => state);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [statisticLoading, setStatisticLoading] = useState(false);

  const isPassed = dayjs().isAfter(queue.endAt);

  function confirmRemoving() {
    Alert.alert('Удаление', `Вы уверены что хотите отменить очередь клиента ${queue.client.name}`, [
      { text: 'Да', onPress: () => removeQueue(queue) },
      { text: 'Нет' },
    ]);
  }

  function confirmStatistic() {
    Alert.alert(
      'Статистика',
      `Добавить в статистику предоставленную услугу клиенту ${queue.client.name}`,
      [{ text: 'Да', onPress: () => addToStatistic(queue) }, { text: 'Нет' }],
    );
  }

  async function removeQueue(queue: Queue) {
    setRemoveLoading(true);

    const [queueToRemove, err] = await queueService.delete(queue.id);

    if (err) {
      Alert.alert('Ошибка', err.error);
    } else {
      deleteFromAll(queueToRemove);
    }

    setRemoveLoading(false);
  }

  async function addToStatistic(queue: Queue) {
    setStatisticLoading(true);

    const statistic = {
      clientName: queue.client.name,
      clientPhone: queue.client.phone,
      service: queue.service.name,
      appointmentTo: queue.user.firstName,
      appointmentAt: queue.startAt.toISOString(),
      price: getPrice(queue),
    };

    console.log(statistic);

    setStatisticLoading(false);
  }

  return (
    (user?.role === Role.ADMIN || user?.id === queue.userId) && (
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
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  list: {
    gap: 10,
    flex: 1,
  },
  bodyListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default QueueList;

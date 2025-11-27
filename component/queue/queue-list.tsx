import type { Queue } from '@type/queue.type';
import type { FC, PropsWithChildren } from 'react';

import { Card, WingBlank } from '@ant-design/react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { blue, gray, green } from '@ant-design/colors';
import { getDateString, minutesToTime } from '@helper/time-converter.helper';

type ServiceListProps = PropsWithChildren<{
  queue: Queue[];
  emptyMessage?: string;
  refreshing: boolean;
  onRefresh: () => Promise<void>;
}>;

type ServiceItemProps = {
  queue: Queue;
};

type ServiceItemHeaderTextProps = {
  title: string;
  category: string;
};

function call(phone: string) {
    Linking.openURL(`tel:${phone}`);
  }

  function sms(phone: string) {
    Linking.openURL(`sms:${phone}`);
  }

const QueueList: FC<ServiceListProps> = ({
  queue,
  emptyMessage,
  refreshing = false,
  onRefresh,
  children,
}) => {
  const message = emptyMessage ?? 'Пока нет очереди';

  return (
    <View style={styles.container}>
      <View>{children}</View>

      <ScrollView
        style={{ marginBottom: 43 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.list}>
          {queue.length > 0 ? (
            queue.map(queueItem => (
              <QueueItem key={queueItem.id} queue={queueItem} />
            ))
          ) : (
            <Text>{message}</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const QueueItem: FC<ServiceItemProps> = ({ queue }) => {
  return (
    <Card>
      <Card.Header
        title={<QueueItemHeaderText title={queue.client.name} category={queue.service.name} />}
        extra={<ConversationActions queue={queue} />}
      />

      <Card.Body>
        <WingBlank>
          <QueueItemBody queue={queue} />
        </WingBlank>
      </Card.Body>

      {/* <Card.Footer content={service.price + ' с'} extra={minutesToTime(service.duration)} /> */}
    </Card>
  );
};

const QueueItemBody: FC<{ queue: Queue }> = ({ queue }) => {
  return (
    <View style={{ gap: 5 }}>
      <View style={styles.bodyListItem}>
        <Text>Сотрудник</Text>
        <Text>{queue.user.firstName}</Text>
      </View>

      <View style={styles.bodyListItem}>
        <Text>Номер телефона</Text>
        <Text>{queue.client.phone}</Text>
      </View>

      <View style={styles.bodyListItem}>
        <Text>Продолжительность</Text>
        <Text>{minutesToTime(queue.service.duration)}</Text>
      </View>

      <View style={styles.bodyListItem}>
        <Text>Запись на</Text>
        <Text>{getDateString(queue.startAt)}</Text>
      </View>
    </View>
  );
};

const QueueItemHeaderText: FC<ServiceItemHeaderTextProps> = ({ title, category }) => {
  return (
    <View>
      <Text style={{ fontSize: 17 }}>{title}</Text>
      <Text style={{ color: gray[2] }}>{category}</Text>
    </View>
  );
};

const ConversationActions: FC<ServiceItemProps> = ({ queue }) => {
  return (
    <View style={{ alignSelf: 'flex-end', flexDirection: 'row', gap: 5 }}>
      <Pressable onPress={() => sms(queue.client.phone)}>
        <MaterialCommunityIcons name="email-outline" size={24} color={blue.primary} />
      </Pressable>

      <Pressable onPress={() => call(queue.client.phone)}>
        <MaterialCommunityIcons name="phone" size={24} color={green.primary} />
      </Pressable>
    </View>
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

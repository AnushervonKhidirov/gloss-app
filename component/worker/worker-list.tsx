import type { User } from '@type/user.type';
import { useState, type ComponentProps, type FC, type PropsWithChildren } from 'react';

import { Button, Card, WingBlank } from '@ant-design/react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import useUserStore from '@store/user.store';
import useUsersStore from '@store/users.store';
import { Role } from '@type/user.type';
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

import userService from '@service/user.service';

import { blue, gray, green, orange, red } from '@ant-design/colors';
import { scrollerTabMarginBottom } from '@constant/scroller';
import parsePhoneNumber from 'libphonenumber-js';

type WorkerListProps = PropsWithChildren<{
  workers: User[];
  emptyMessage?: string;
  onRefresh: () => Promise<void>;
}>;

function getStatusData(worker: User) {
  let statusData = { color: orange[3], text: 'Ожидает подтверждения' };
  if (worker.verified) statusData = { color: green.primary!, text: 'Подвержден' };
  if (worker.archived) statusData = { color: red.primary!, text: 'Уволен' };
  return statusData;
}

function getStatusIcon(worker: User) {
  const icons: {
    [key in 'verified' | 'notVerified' | 'archived']: {
      name: ComponentProps<typeof MaterialCommunityIcons>['name'];
      color: string;
    };
  } = {
    verified: { name: 'account-check', color: green.primary! },
    notVerified: { name: 'account-clock', color: orange[3] },
    archived: { name: 'account-cancel', color: red.primary! },
  };

  let icon = icons.notVerified;
  if (worker.verified) icon = icons.verified;
  if (worker.archived) icon = icons.archived;

  return icon;
}

const WorkerList: FC<WorkerListProps> = ({ workers, emptyMessage, onRefresh, children }) => {
  const message = emptyMessage ?? 'У вас пока нет работников';

  const [refreshing, setRefreshing] = useState(false);

  async function refresh() {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      {children}

      <ScrollView
        style={{ marginBottom: scrollerTabMarginBottom }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        <View style={styles.list}>
          {workers.length > 0 ? (
            workers.map(worker => <WorkerItem key={worker.id} worker={worker} />)
          ) : (
            <Text>{message}</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const WorkerItem: FC<{ worker: User }> = ({ worker }) => {
  return (
    <Card>
      <Card.Header
        title={<Text style={{ fontSize: 17 }}>{worker.firstName}</Text>}
        extra={<ConversationActions worker={worker} />}
      />

      {worker.specialty ? (
        <Card.Body>
          <WingBlank>
            <WorkerItemBody worker={worker} />
          </WingBlank>
        </Card.Body>
      ) : (
        <></>
      )}

      <Card.Footer content={<WorkerActionButtons worker={worker} />} />
    </Card>
  );
};

const ConversationActions: FC<{ worker: User }> = ({ worker }) => {
  const user = useUserStore(state => state.user);

  return (
    user?.id !== worker.id && (
      <View style={{ alignSelf: 'flex-end', flexDirection: 'row', gap: 5 }}>
        <Pressable onPress={() => Linking.openURL(`sms:${worker.phone}`)}>
          <MaterialCommunityIcons name="email-outline" size={24} color={blue.primary} />
        </Pressable>

        <Pressable onPress={() => Linking.openURL(`tel:${worker.phone}`)}>
          <MaterialCommunityIcons name="phone" size={24} color={green.primary} />
        </Pressable>
      </View>
    )
  );
};

const WorkerItemBody: FC<{ worker: User }> = ({ worker }) => {
  const phone = parsePhoneNumber(worker.phone);
  const statusData = getStatusData(worker);

  return (
    <View style={{ gap: 5 }}>
      {worker.specialty && (
        <View>
          <Text>Должность:</Text>
          <Text style={{ color: gray[2], fontSize: 13 }}>{worker.specialty.value}</Text>
        </View>
      )}

      {phone && (
        <View style={styles.bodyListItem}>
          <Text>Номер телефона</Text>
          <Text>{phone.formatNational()}</Text>
        </View>
      )}

      <View style={styles.bodyListItem}>
        <Text>Статус</Text>
        <Text style={{ color: statusData.color, fontWeight: '700' }}>{statusData.text}</Text>
      </View>
    </View>
  );
};

const WorkerActionButtons: FC<{ worker: User }> = ({ worker }) => {
  const user = useUserStore(state => state.user);
  const { updateUser, removeUser } = useUsersStore(state => state);

  function rejectConfirm(user: User) {
    Alert.alert('Отклонить', `Отклонить запрос от ${user.firstName}?`, [
      { text: 'Да', onPress: () => remove(user.id) },
      { text: 'Нет' },
    ]);
  }

  function removeConfirm(user: User) {
    Alert.alert(
      'Отклонить',
      `Удалить работника ${user.firstName}?\n\nВсе данные этого работника будут безозвратно утеряны.`,
      [{ text: 'Да', onPress: () => remove(user.id) }, { text: 'Нет' }],
    );
  }

  async function approve(userId: number) {
    const [approvedUser, err] = await userService.approve(userId);

    if (err) {
      Alert.alert('Ошибка', err.error);
    } else {
      updateUser(approvedUser);
    }
  }

  async function archive(userId: number) {
    const [archivedUser, err] = await userService.archive(userId);

    if (err) {
      Alert.alert('Ошибка', err.error);
    } else {
      updateUser(archivedUser);
    }
  }

  async function unarchive(userId: number) {
    const [archivedUser, err] = await userService.unArchive(userId);

    if (err) {
      Alert.alert('Ошибка', err.error);
    } else {
      updateUser(archivedUser);
    }
  }

  async function remove(userId: number) {
    const [archivedUser, err] = await userService.delete(userId);

    if (err) {
      Alert.alert('Ошибка', err.error);
    } else {
      removeUser(archivedUser);
    }
  }

  return user?.role === Role.ADMIN && worker.role !== Role.ADMIN ? (
    <View style={styles.actionButtonsWrapper}>
      {worker.archived && (
        <>
          <Button type="warning" size="small" onPress={() => removeConfirm(worker)}>
            Удалить
          </Button>

          <Button type="primary" size="small" onPress={() => unarchive(worker.id)}>
            Восстановить
          </Button>
        </>
      )}

      {worker.verified && !worker.archived && (
        <Button type="warning" size="small" onPress={() => archive(worker.id)}>
          Уволить
        </Button>
      )}

      {!worker.verified && (
        <>
          <Button type="warning" size="small" onPress={() => rejectConfirm(worker)}>
            Отклонить
          </Button>

          <Button
            type="primary"
            style={{ backgroundColor: green.primary, borderColor: green.primary }}
            size="small"
            onPress={() => approve(worker.id)}
          >
            Подтвертидь
          </Button>
        </>
      )}
    </View>
  ) : (
    <View />
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
  actionButtonsWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  bodyListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
});

export default WorkerList;

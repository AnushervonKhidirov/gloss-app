import type { User } from '@type/user.type';
import type { ComponentProps, FC } from 'react';

import { Button, Card, WingBlank } from '@ant-design/react-native';
import ConnectActionButtons from '@commonComponent/connect-action-buttons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import useUserStore from '@store/user.store';
import useUsersStore from '@store/users.store';
import { Role } from '@type/user.type';
import { Alert, StyleSheet, Text, View } from 'react-native';

import userService from '@service/user.service';

import { gray, green, orange, red } from '@ant-design/colors';
import { cardStyle } from '@constant/card-style';
import { alertError } from '@helper/error-handler';
import parsePhoneNumber from 'libphonenumber-js';

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

  return (
    <MaterialCommunityIcons
      name={icon.name}
      color={icon.color}
      size={24}
      style={{ marginRight: 10 }}
    />
  );
}

const WorkerCard: FC<{ worker: User }> = ({ worker }) => {
  const StatusIcon = getStatusIcon(worker);

  return (
    <Card>
      <Card.Header
        styles={cardStyle.header}
        thumb={StatusIcon}
        title={<Text style={{ fontSize: 17 }}>{worker.firstName}</Text>}
        extra={<ConnectActionButtons phone={worker.phone} />}
      />

      <Card.Body>
        <WingBlank>
          <WorkerItemBody worker={worker} />
        </WingBlank>
      </Card.Body>

      <Card.Footer content={<WorkerActionButtons worker={worker} />} />
    </Card>
  );
};

const WorkerItemBody: FC<{ worker: User }> = ({ worker }) => {
  const phone = parsePhoneNumber(worker.phone);

  return (
    <View style={{ gap: 5 }}>
      {worker.specialty && (
        <View>
          <Text>Должность:</Text>
          <Text style={{ color: gray[2], fontSize: 13 }}>{worker.specialty.name}</Text>
        </View>
      )}

      {phone && (
        <View style={styles.bodyListItem}>
          <Text>Номер телефона</Text>
          <Text>{phone.formatNational()}</Text>
        </View>
      )}
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
      alertError(err);
    } else {
      updateUser(approvedUser);
    }
  }

  async function archive(userId: number) {
    const [archivedUser, err] = await userService.archive(userId);

    if (err) {
      alertError(err);
    } else {
      updateUser(archivedUser);
    }
  }

  async function unarchive(userId: number) {
    const [archivedUser, err] = await userService.unArchive(userId);

    if (err) {
      alertError(err);
    } else {
      updateUser(archivedUser);
    }
  }

  async function remove(userId: number) {
    const [archivedUser, err] = await userService.delete(userId);

    if (err) {
      alertError(err);
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

export default WorkerCard;

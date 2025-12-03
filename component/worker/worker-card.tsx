import type { ActionButtonData } from '@commonComponent/action-buttons-modal';
import type { User } from '@type/user.type';
import type { ComponentProps, FC } from 'react';

import { Card, WingBlank } from '@ant-design/react-native';
import ActionButtonsModal from '@commonComponent/action-buttons-modal';
import ConnectActionButtons from '@commonComponent/connect-action-buttons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import useUserStore from '@store/user.store';
import useUsersStore from '@store/users.store';
import { Role } from '@type/user.type';
import { Alert, StyleSheet, Text, View } from 'react-native';

import userService from '@service/user.service';
import { useEffect, useState } from 'react';

import { cardStyle } from '@constant/card-style';
import { alertError } from '@helper/error-handler';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import { green, grey, orange, red } from '@constant/theme';

function getStatusIcon(worker: User) {
  const icons: {
    [key in 'verified' | 'notVerified' | 'archived']: {
      name: ComponentProps<typeof MaterialCommunityIcons>['name'];
      color: string;
    };
  } = {
    verified: { name: 'account-check', color: green[5] },
    notVerified: { name: 'account-clock', color: orange[5] },
    archived: { name: 'account-cancel', color: red[5] },
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
  const phone = parsePhoneNumberFromString(worker.phone, 'TJ');

  return (
    <View style={{ gap: 5 }}>
      {worker.specialty && (
        <View>
          <Text>Должность:</Text>
          <Text style={{ color: grey[6], fontSize: 13 }}>{worker.specialty.name}</Text>
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

  const [actions, setActions] = useState<ActionButtonData[]>([]);
  const [actionVisible, setActionVisible] = useState(false);

  const isAdmin = user?.role === Role.ADMIN;
  const isWorkerAdmin = worker.role !== Role.ADMIN;

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

    setActionVisible(false);
  }

  async function archive(userId: number) {
    const [archivedUser, err] = await userService.archive(userId);

    if (err) {
      alertError(err);
    } else {
      updateUser(archivedUser);
    }

    setActionVisible(false);
  }

  async function unarchive(userId: number) {
    const [archivedUser, err] = await userService.unArchive(userId);

    if (err) {
      alertError(err);
    } else {
      updateUser(archivedUser);
    }

    setActionVisible(false);
  }

  async function remove(userId: number) {
    const [archivedUser, err] = await userService.delete(userId);

    if (err) {
      alertError(err);
    } else {
      removeUser(archivedUser);
    }

    setActionVisible(false);
  }

  useEffect(() => {
    const actionButtons: ActionButtonData[] = [];

    if (worker.archived) {
      actionButtons.push(
        {
          iconName: 'account-remove-outline',
          text: 'Удалить сотрудника',
          action: () => removeConfirm(worker),
        },
        {
          iconName: 'account-check-outline',
          text: 'Восстановить сотрудника',
          action: () => unarchive(worker.id),
        },
      );
    }

    if (worker.verified && !worker.archived) {
      actionButtons.push({
        iconName: 'account-cancel-outline',
        text: 'Уволить сотрудника',
        action: () => archive(worker.id),
      });
    }

    if (!worker.verified) {
      actionButtons.push(
        {
          iconName: 'account-minus-outline',
          text: 'Отклонить',
          action: () => rejectConfirm(worker),
        },
        {
          iconName: 'account-check-outline',
          text: 'Подтвертидь',
          action: () => approve(worker.id),
        },
      );
    }

    setActions(actionButtons);
  }, [worker]);

  return (
    isAdmin &&
    isWorkerAdmin && (
      <View style={styles.actionButtonsWrapper}>
        <ActionButtonsModal
          actions={actions}
          visible={actionVisible}
          setVisible={setActionVisible}
        />
      </View>
    )
  );
};

const styles = StyleSheet.create({
  actionButtonsWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  bodyListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
});

export default WorkerCard;

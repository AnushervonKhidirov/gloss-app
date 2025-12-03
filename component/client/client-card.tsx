import type { ActionButtonData } from '@commonComponent/action-buttons-modal';
import type { Client } from '@type/client.type';
import type { FC } from 'react';

import useBlackListStore from '@store/black-list.store';
import useClientsStore from '@store/clients.store';
import useUserStore from '@store/user.store';
import { Role } from '@type/user.type';
import { useEffect, useState } from 'react';

import { Card } from '@ant-design/react-native';
import ActionButtonsModal from '@commonComponent/action-buttons-modal';
import ConnectActionButtons from '@commonComponent/connect-action-buttons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Alert, StyleSheet, Text, View } from 'react-native';

import clientService from '@service/client.service';

import { cardStyle } from '@constant/card-style';
import { grey, red } from '@constant/theme';
import { alertError } from '@helper/error-handler';
import blackListService from '@service/black-list.service';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

type ClientCardProps = {
  client: Client;
  onEdit: (client: Client) => void;
};

const ClientCard: FC<ClientCardProps> = ({ client, onEdit }) => {
  const cardThumb = client.blocked ? (
    <MaterialCommunityIcons
      name="block-helper"
      size={24}
      color={red[4]}
      style={{ marginRight: 10 }}
    />
  ) : (
    <View style={styles.thumbAvatar}>
      <Text style={{ color: grey[1], fontWeight: 700, fontSize: 13 }}>
        {client.name[0].toUpperCase()}
      </Text>
    </View>
  );

  return (
    <Card>
      <Card.Header
        styles={cardStyle.header}
        thumb={cardThumb}
        title={<ClientHeader client={client} />}
        extra={<ConnectActionButtons phone={client.phone} />}
      />

      <Card.Footer extra={<FooterActions client={client} onEdit={onEdit} />} />
    </Card>
  );
};

const ClientHeader: FC<{ client: Client }> = ({ client }) => {
  const phone = parsePhoneNumberFromString(client.phone, 'TJ');

  return (
    <View>
      <Text style={{ fontSize: 17 }}>{client.name}</Text>
      <Text style={{ color: grey[6] }}>{phone?.formatNational()}</Text>
    </View>
  );
};

const FooterActions: FC<ClientCardProps> = ({ client, onEdit }) => {
  const user = useUserStore(state => state.user);
  const { updateClient, removeCLient } = useClientsStore(state => state);
  const { pushBlackList, deleteBlackList } = useBlackListStore(state => state);

  const [actions, setActions] = useState<ActionButtonData[]>([]);
  const [actionVisible, setActionVisible] = useState(false);

  const isAdmin = user?.role === Role.ADMIN;

  const blackListActions: ActionButtonData[] = [
    {
      iconName: 'account-cancel-outline',
      text: 'Добавить в Черный список',
      action: confirmBlackList,
    },
    {
      iconName: 'account-check-outline',
      text: 'Убрать из Черного списка',
      action: confirmRestore,
    },
  ];

  const adminActions: ActionButtonData[] = [
    {
      iconName: 'account-remove-outline',
      text: 'Удалить',
      action: confirmRemoving,
    },
    {
      iconName: 'account-edit-outline',
      text: 'Редактировать',
      action: () => onEdit(client),
    },
  ];

  function confirmRemoving() {
    Alert.alert('Удаление', `Вы уверены что хотите удалить клиента ${client.name}`, [
      { text: 'Да', onPress: () => removeClient(client) },
      { text: 'Нет' },
    ]);
  }

  function confirmBlackList() {
    Alert.alert(
      'Удаление',
      `Вы уверены что хотите добавить в черный список клиента ${client.name}`,
      [{ text: 'Да', onPress: () => addToBlackList(client) }, { text: 'Нет' }],
    );
  }

  function confirmRestore() {
    Alert.alert(
      'Удаление',
      `Вы уверены что хотите восстановить из черного списка клиента ${client.name}`,
      [{ text: 'Да', onPress: () => restoreFromBlackList(client) }, { text: 'Нет' }],
    );
  }

  async function removeClient(client: Client) {
    const [clientToRemove, err] = await clientService.delete(client.id);

    if (err) {
      const message =
        err.statusCode === 400
          ? 'Клиент не может быть удален.\nВозможно у него запись на прием. (Удалите сперва запись)'
          : err.message;

      alertError({ ...err, message });
    } else {
      removeCLient(clientToRemove);
    }

    setActionVisible(false);
  }

  async function addToBlackList(client: Client) {
    const [blackListItem, err] = await blackListService.add({ phone: client.phone });

    if (err) {
      alertError(err);
    } else {
      updateClient({ ...client, blocked: true });
      pushBlackList([blackListItem]);
    }

    setActionVisible(false);
  }

  async function restoreFromBlackList(client: Client) {
    const [blackListItem, err] = await blackListService.remove({ phone: client.phone });

    if (err) {
      alertError(err);
    } else {
      updateClient({ ...client, blocked: false });
      deleteBlackList(blackListItem);
    }

    setActionVisible(false);
  }

  useEffect(() => {
    const actionButtons: ActionButtonData[] = [];

    actionButtons.push(blackListActions[Number(client.blocked)]);
    if (isAdmin) actionButtons.push(...adminActions);

    setActions(actionButtons);
  }, [client.blocked]);

  return (
    user?.role === Role.ADMIN && (
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
  thumbAvatar: {
    width: 24,
    height: 24,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: grey[5],
    borderRadius: 24,
  },
});

export default ClientCard;

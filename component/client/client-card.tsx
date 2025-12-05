import type { ActionButtonData } from '@commonComponent/action-buttons';
import type { Client } from '@type/client.type';
import type { FC } from 'react';

import useBlackListStore from '@store/black-list.store';
import useClientsStore from '@store/clients.store';
import useUserStore from '@store/user.store';
import { Role } from '@type/user.type';
import { useEffect, useState } from 'react';

import ActionButtons from '@commonComponent/action-buttons';
import Card from '@commonComponent/card';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';

import clientService from '@service/client.service';

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
    <MaterialCommunityIcons name="block-helper" size={24} color={red[4]} />
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
        thumb={cardThumb}
        content={<ClientHeader client={client} />}
        extra={<Actions client={client} onEdit={onEdit} />}
      />
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

const Actions: FC<ClientCardProps> = ({ client, onEdit }) => {
  const isAdmin = useUserStore(state => state.user?.role === Role.ADMIN);
  const { updateClient, removeCLient } = useClientsStore(state => state);
  const { pushBlackList, deleteBlackList } = useBlackListStore(state => state);

  const [actions, setActions] = useState<ActionButtonData[]>([]);
  const [actionVisible, setActionVisible] = useState(false);

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

    actionButtons.push(
      {
        iconName: 'phone-outline',
        text: 'Позвонить',
        action: () => {
          setActionVisible(false);
          Linking.openURL(`tel:${client.phone}`);
        },
      },
      {
        iconName: 'email-outline',
        text: 'Написать SMS',
        action: () => {
          setActionVisible(false);
          Linking.openURL(`sms:${client.phone}`);
        },
      },
    );

    if (isAdmin) {
      actionButtons.push(
        {
          iconName: 'account-edit-outline',
          text: 'Редактировать',
          action: () => onEdit(client),
        },
        {
          iconName: 'account-remove-outline',
          text: 'Удалить',
          action: confirmRemoving,
        },
      );
    }

    actionButtons.push(
      client.blocked
        ? {
            iconName: 'account-check-outline',
            text: 'Убрать из Черного списка',
            action: confirmRestore,
          }
        : {
            iconName: 'account-cancel-outline',
            text: 'Добавить в Черный список',
            action: confirmBlackList,
          },
    );

    setActions(actionButtons);
  }, [client.blocked]);

  return <ActionButtons actions={actions} visible={actionVisible} setVisible={setActionVisible} />;
};

const styles = StyleSheet.create({
  thumbAvatar: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: grey[5],
    borderRadius: 24,
  },
});

export default ClientCard;

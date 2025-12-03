import type { Client } from '@type/client.type';
import type { FC } from 'react';

import useClientsStore from '@store/clients.store';
import useUserStore from '@store/user.store';
import { Role } from '@type/user.type';
import { useState } from 'react';

import { Button, Card } from '@ant-design/react-native';
import ConnectActionButtons from '@commonComponent/connect-action-buttons';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { cardStyle } from '@constant/card-style';
import { grey } from '@constant/theme';
import { alertError } from '@helper/error-handler';
import clientService from '@service/client.service';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

type ClientCardProps = {
  client: Client;
  onEdit: (client: Client) => void;
};

const ClientCard: FC<ClientCardProps> = ({ client, onEdit }) => {
  return (
    <Card>
      <Card.Header
        styles={cardStyle.header}
        title={<ClientHeader client={client} />}
        extra={<ConnectActionButtons phone={client.phone} />}
      />

      <Card.Footer content={<FooterActions client={client} onEdit={onEdit} />} />
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
  const { removeCLient } = useClientsStore(state => state);
  const [removeLoading, setRemoveLoading] = useState(false);

  function confirmRemoving() {
    Alert.alert('Удаление', `Вы уверены что хотите удалить клиента ${client.name}`, [
      { text: 'Да', onPress: () => removeClient(client) },
      { text: 'Нет' },
    ]);
  }

  async function removeClient(client: Client) {
    setRemoveLoading(true);

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

    setRemoveLoading(false);
  }

  return (
    user?.role === Role.ADMIN && (
      <View style={styles.actionButtonsWrapper}>
        <Button type="warning" size="small" loading={removeLoading} onPress={confirmRemoving}>
          Удалить
        </Button>

        <Button type="primary" size="small" onPress={() => onEdit(client)}>
          Редактировать
        </Button>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  actionButtonsWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 5,
    marginBlock: 5,
  },
});

export default ClientCard;

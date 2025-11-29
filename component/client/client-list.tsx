import type { Client } from '@type/client.type';
import type { FC, PropsWithChildren } from 'react';

import { Button, Card } from '@ant-design/react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import clientService from '@service/client.service';
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

import { blue, gray, green } from '@ant-design/colors';
import { scrollerTabMarginBottom } from '@constant/scroller';
import useClientsStore from '@store/clients.store';
import useUserStore from '@store/user.store';
import { Role } from '@type/user.type';
import parsePhoneNumber from 'libphonenumber-js';

type ClientListProps = PropsWithChildren<{
  clients: Client[];
  emptyMessage?: string;
  onRefresh: () => Promise<void>;
  onEdit: (client: Client) => void;
}>;

type ClientWithEditProps = {
  client: Client;
  onEdit: (client: Client) => void;
};

const ClientList: FC<ClientListProps> = ({
  clients,
  emptyMessage,
  onRefresh,
  onEdit,
  children,
}) => {
  const message = emptyMessage ?? 'У вас пока нет клиентов';

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
          {clients.length > 0 ? (
            clients.map(clients => <ClientItem key={clients.id} client={clients} onEdit={onEdit} />)
          ) : (
            <Text>{message}</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const ClientItem: FC<ClientWithEditProps> = ({ client, onEdit }) => {
  return (
    <Card>
      <Card.Header
        title={<ClientItemHeaderText client={client} />}
        extra={<ConversationActions client={client} />}
      />

      <Card.Footer content={<FooterActions client={client} onEdit={onEdit} />} />
    </Card>
  );
};

const ClientItemHeaderText: FC<{ client: Client }> = ({ client }) => {
  const phone = parsePhoneNumber(client.phone);

  return (
    <View>
      <Text style={{ fontSize: 17 }}>{client.name}</Text>
      <Text style={{ color: gray[2] }}>{phone?.formatNational()}</Text>
    </View>
  );
};

const ConversationActions: FC<{ client: Client }> = ({ client }) => {
  return (
    <View style={{ alignSelf: 'flex-end', flexDirection: 'row', gap: 5 }}>
      <Pressable onPress={() => Linking.openURL(`sms:${client.phone}`)}>
        <MaterialCommunityIcons name="email-outline" size={24} color={blue.primary} />
      </Pressable>

      <Pressable onPress={() => Linking.openURL(`tel:${client.phone}`)}>
        <MaterialCommunityIcons name="phone" size={24} color={green.primary} />
      </Pressable>
    </View>
  );
};

const FooterActions: FC<ClientWithEditProps> = ({ client, onEdit }) => {
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
      Alert.alert(err.error, err.message);
    } else {
      removeCLient(clientToRemove);
    }

    setRemoveLoading(false);
  }

  return (
    user?.role === Role.ADMIN && (
      <View style={{ alignSelf: 'flex-end', flexDirection: 'row', gap: 5 }}>
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
});

export default ClientList;

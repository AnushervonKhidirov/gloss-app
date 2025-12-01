import type { Client } from '@type/client.type';
import type { FC } from 'react';

import ScrollView from '@commonComponent/scroll-view';
import { Text } from 'react-native';
import ClientCard from './client-card';

type ClientListProps = {
  clients: Client[];
  emptyMessage?: string;
  onRefresh: () => Promise<void>;
  onEdit: (client: Client) => void;
};

const ClientList: FC<ClientListProps> = ({ clients, emptyMessage, onRefresh, onEdit }) => {
  const message = emptyMessage ?? 'У вас пока нет клиентов';

  return (
    <ScrollView onRefresh={onRefresh}>
      {clients.length > 0 ? (
        clients.map(clients => <ClientCard key={clients.id} client={clients} onEdit={onEdit} />)
      ) : (
        <Text>{message}</Text>
      )}
    </ScrollView>
  );
};

export default ClientList;

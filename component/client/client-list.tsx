import type { Client } from '@type/client.type';
import type { FC } from 'react';

import { ScrollView } from '@component/common';
import ClientCard from './client-card';

type ClientListProps = {
  clients: Client[];
  onRefresh: () => Promise<void>;
  onEdit: (client: Client) => void;
};

const ClientList: FC<ClientListProps> = ({ clients, onRefresh, onEdit }) => {
  return (
    <ScrollView
      searchable
      searchIconName="account-search-outline"
      onRefresh={onRefresh}
      items={clients}
      renderItem={client => <ClientCard key={client.id} client={client} onEdit={onEdit} />}
    />
  );
};

export default ClientList;

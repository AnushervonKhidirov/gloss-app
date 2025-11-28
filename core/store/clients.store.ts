import type { Client } from '@type/client.type';

import { create } from 'zustand';

type ClientsState = {
  clients: Client[];
  setClients: (clients: Client[]) => void;
  updateClient: (client: Client) => void;
  removeCLient: (client: Client) => void;
};

const useClientsStore = create<ClientsState>(set => ({
  clients: [],
  setClients: clients => set(() => ({ clients })),
  updateClient: updatedClient =>
    set(state => {
      const newUserList = state.clients.map(client =>
        client.id === updatedClient.id ? updatedClient : client,
      );
      return { clients: newUserList };
    }),

  removeCLient: removedClient =>
    set(state => {
      const newUserList = state.clients.filter(client => client.id !== removedClient.id);
      return { clients: newUserList };
    }),
}));

export default useClientsStore;

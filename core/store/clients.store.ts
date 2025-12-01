import type { Client } from '@type/client.type';

import { create } from 'zustand';

type ClientsState = {
  clients: Client[];
};

type ClientsSActions = {
  setClients: (clients: Client[]) => void;
  updateClient: (client: Client) => void;
  removeCLient: (client: Client) => void;
};

const useClientsStore = create<ClientsState & ClientsSActions>(set => ({
  clients: [],

  setClients: clients => set(() => ({ clients })),
  updateClient: updatedClient =>
    set(state => {
      return {
        clients: state.clients.map(client =>
          client.id === updatedClient.id ? updatedClient : client,
        ),
      };
    }),

  removeCLient: removedClient =>
    set(state => {
      return { clients: state.clients.filter(client => client.id !== removedClient.id) };
    }),
}));

export default useClientsStore;

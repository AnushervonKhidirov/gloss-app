import type { Client } from '@type/client.type';

import useClientsStore from '@store/clients.store';
import { useLayoutEffect, useState } from 'react';

import LoadingView from '@commonComponent/loading-view';
import ClientList from '@component/client/client-list';

import Modal from '@commonComponent/modal';
import EditClientForm from '@component/client/form/edit-client-form';
import { alertError } from '@helper/error-handler';
import clientService from '@service/client.service';

function convertForSearchInBlackList<T extends { blocked: boolean }>(
  arr: T[],
): (T & { blockedText?: string })[] {
  return arr.map(item => {
    const blocked = item.blocked ? { blockedText: 'Black list | Черный список' } : {};
    return { ...item, ...blocked };
  });
}

const ClientScreen = () => {
  const { clients, setClients, updateClient } = useClientsStore(state => state);
  const [loading, setLoading] = useState(false);

  const [toEdit, setToEdit] = useState<Client | null>(null);
  const [editClientModalVisible, setEditClientModalVisible] = useState(false);

  function openEditClientModal(client: Client) {
    setToEdit(client);
    setEditClientModalVisible(true);
  }

  function edit(client: Client) {
    updateClient(client);
    setEditClientModalVisible(false);
  }

  async function fetchOnLoad() {
    setLoading(true);
    await fetch();
    setLoading(false);
  }

  async function fetch() {
    const [clients, err] = await clientService.findMany();

    if (err) {
      alertError(err);
    } else {
      setClients(clients);
    }
  }

  useLayoutEffect(() => {
    fetchOnLoad();
  }, []);

  return (
    <LoadingView loading={loading}>
      <ClientList
        clients={convertForSearchInBlackList(clients)}
        onRefresh={fetch}
        onEdit={openEditClientModal}
      />

      <Modal
        title="Редактирование клиента"
        isOpen={editClientModalVisible}
        close={() => setEditClientModalVisible(false)}
      >
        <EditClientForm clientToEdit={toEdit} onSuccess={edit} />
      </Modal>
    </LoadingView>
  );
};

export default ClientScreen;

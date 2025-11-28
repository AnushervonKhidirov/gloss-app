import type { Client } from '@type/client.type';

import LoadingView from '@commonComponent/loading-view';
import Modal from '@commonComponent/modal';
import ClientList from '@component/client/client-list';
import EditClientForm from '@component/client/form/edit-client-form';
import useClientsStore from '@store/clients.store';
import { useEffect, useState } from 'react';
import { Alert, Text } from 'react-native';

import clientService from '@service/client.service';

const ClientScreen = () => {
  const { clients, setClients, updateClient } = useClientsStore(state => state);

  const [loading, setLoading] = useState(false);
  const [toEdit, setToEdit] = useState<Client | null>(null);
  const [editClientModalVisible, setEditClientModalVisible] = useState(false);

  async function fetchClientsOnLoad() {
    setLoading(true);
    await fetchClients();
    setLoading(false);
  }

  async function fetchClients() {
    const [users, err] = await clientService.findMany();

    if (err) {
      Alert.alert('Ошибка', err.error);
    } else {
      setClients(users);
    }
  }

  function openEditClientModal(client: Client) {
    setToEdit(client);
    setEditClientModalVisible(true);
  }

  function edit(client: Client) {
    updateClient(client);
    setEditClientModalVisible(false);
  }

  useEffect(() => {
    fetchClientsOnLoad();
  }, []);

  return (
    <LoadingView loading={loading}>
      <ClientList clients={clients} onRefresh={fetchClients} onEdit={openEditClientModal}>
        <Text style={{ fontSize: 20, fontWeight: 700 }}>Ваши клиенты</Text>
      </ClientList>

      <Modal
        title="Редактирование категории"
        isOpen={editClientModalVisible}
        close={() => setEditClientModalVisible(false)}
      >
        <EditClientForm clientToEdit={toEdit} onSuccess={edit} />
      </Modal>
    </LoadingView>
  );
};

export default ClientScreen;

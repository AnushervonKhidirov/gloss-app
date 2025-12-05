import type { BlackList } from '@type/client.type';

import useBlackListStore from '@store/black-list.store';
import useClientsStore from '@store/clients.store';
import { useLayoutEffect, useState } from 'react';

import BlackListCard from '@component/black-list/black-list-card';
import BlackListAddForm from '@component/black-list/form/black-list-add-form';
import { Button, LoadingView, Modal, ScrollView } from '@component/common';

import { alertError } from '@helper/error-handler';
import blackListService from '@service/black-list.service';

const ClientBlackListScreen = () => {
  const { clients, updateClient } = useClientsStore(state => state);
  const { blackList, setBlackList, pushBlackList, deleteBlackList } = useBlackListStore(
    state => state,
  );
  const [loading, setLoading] = useState(false);

  const [blackListFormAddModalVisible, setBlackListFormAddModalVisible] = useState(false);

  function addBlackList(blackList: BlackList) {
    const client = clients.find(client => client.phone === blackList.phone);
    if (client) updateClient({ ...client, blocked: true });

    pushBlackList([blackList]);
    setBlackListFormAddModalVisible(false);
  }

  async function fetchOnLoad() {
    setLoading(true);
    await fetch();
    setLoading(false);
  }

  async function fetch() {
    const [blackList, err] = await blackListService.findAll();

    if (err) {
      alertError(err);
    } else {
      setBlackList(blackList);
    }
  }

  async function restore(phone: string) {
    const [blackList, err] = await blackListService.remove({ phone });

    if (err) {
      alertError(err);
    } else {
      const client = clients.find(client => client.phone === blackList.phone);
      if (client) updateClient({ ...client, blocked: false });

      deleteBlackList(blackList);
    }
  }

  useLayoutEffect(() => {
    fetchOnLoad();
  }, []);

  return (
    <LoadingView loading={loading}>
      <ScrollView
        searchable
        items={blackList}
        onRefresh={fetch}
        renderItem={({ id, phone }) => (
          <BlackListCard key={phone + id} blackList={{ id, phone }} restore={restore} />
        )}
      >
        <Button title="Добавить" onPress={() => setBlackListFormAddModalVisible(true)} />
      </ScrollView>

      <Modal
        title="Черный список"
        isOpen={blackListFormAddModalVisible}
        close={() => setBlackListFormAddModalVisible(false)}
      >
        <BlackListAddForm onSuccess={addBlackList} />
      </Modal>
    </LoadingView>
  );
};

export default ClientBlackListScreen;

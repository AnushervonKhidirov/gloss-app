import type { User } from '@type/user.type';

import LoadingView from '@commonComponent/loading-view';
import WorkerList from '@component/worker/worker-list';
import useUsersStore from '@store/users.store';
import { useEffect, useState } from 'react';
import { Alert, Text } from 'react-native';

import userService from '@services/user.service';

const WorkersScreen = () => {
  const { users, setUsers, updateUser } = useUsersStore(state => state);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchUsers(refreshing: boolean = false) {
    if (refreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const [users, err] = await userService.findMany();
    if (err) {
      Alert.alert('Ошибка');
    } else {
      setUsers(users);
    }

    setLoading(false);
    setRefreshing(false);
  }

  async function approveUser(user: User) {
    const [approvedUser, err] = await userService.approve(user);

    if (err) {
      Alert.alert('Ошибка');
    } else {
      updateUser(approvedUser);
    }
  }

  async function archiveUser(user: User) {
    const [archivedUser, err] = await userService.archive(user);

    if (err) {
      Alert.alert('Ошибка');
    } else {
      updateUser(archivedUser);
    }
  }

  async function unarchiveUser(user: User) {
    const [archivedUser, err] = await userService.unArchive(user);

    if (err) {
      Alert.alert('Ошибка');
    } else {
      updateUser(archivedUser);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <LoadingView loading={loading}>
      <WorkerList
        workers={users}
        refreshing={refreshing}
        onRefresh={fetchUsers}
        approve={approveUser}
        archive={archiveUser}
        unarchive={unarchiveUser}
      >
        <Text style={{ fontSize: 20, fontWeight: 700 }}>Ваши сотрудники</Text>
      </WorkerList>
    </LoadingView>
  );
};

export default WorkersScreen;

import LoadingView from '@commonComponent/loading-view';
import WorkerList from '@component/worker/worker-list';
import useUsersStore from '@store/users.store';
import { useEffect, useState } from 'react';
import { Alert, Text } from 'react-native';

import userService from '@service/user.service';

const WorkersScreen = () => {
  const { users, setUsers } = useUsersStore(state => state);
  const [loading, setLoading] = useState(false);

  async function fetchUsersOnLoad() {
    setLoading(true);
    await fetchUsers();
    setLoading(false);
  }

  async function fetchUsers() {
    const [users, err] = await userService.findMany();

    if (err) {
      Alert.alert(err.error, err.message);
    } else {
      setUsers(users);
    }
  }

  useEffect(() => {
    fetchUsersOnLoad();
  }, []);

  return (
    <LoadingView loading={loading}>
      <WorkerList workers={users} onRefresh={fetchUsers}>
        <Text style={{ fontSize: 20, fontWeight: 700 }}>Ваши сотрудники</Text>
      </WorkerList>
    </LoadingView>
  );
};

export default WorkersScreen;

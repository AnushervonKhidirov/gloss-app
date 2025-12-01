import LoadingView from '@commonComponent/loading-view';
import WorkerList from '@component/worker/worker-list';
import useUsersStore from '@store/users.store';
import { useEffect, useState } from 'react';

import { alertError } from '@helper/error-handler';
import userService from '@service/user.service';

const WorkersScreen = () => {
  const { users, setUsers } = useUsersStore(state => state);
  const [loading, setLoading] = useState(false);

  async function fetchOnLoad() {
    setLoading(true);
    await fetch();
    setLoading(false);
  }

  async function fetch() {
    const [users, err] = await userService.findMany();

    if (err) {
      alertError(err);
    } else {
      setUsers(users);
    }
  }

  useEffect(() => {
    fetchOnLoad();
  }, []);

  return (
    <LoadingView loading={loading}>
      <WorkerList workers={users} refresh={fetch} />
    </LoadingView>
  );
};

export default WorkersScreen;

import useQueueStore from '@store/queue.store';
import useUserStore from '@store/user.store';
import { useEffect, useState } from 'react';

import { Tabs } from '@ant-design/react-native';
import LoadingView from '@commonComponent/loading-view';
import MyQueueSection from '@component/queue/section/my-queue-section';
import QueueSection from '@component/queue/section/queue-section';

import queueService from '@service/queue.service';

const tabs = [{ title: 'Мои' }, { title: 'Остальные' }];

const HomeScreen = () => {
  const user = useUserStore(state => state.user);
  const { setQueue, setMyQueue } = useQueueStore(state => state);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  async function fetchQueue() {
    setLoading(true);

    const [myQueue, myQueueErr] = await queueService.findMy();
    const [queue, queueErr] = await queueService.findMany({ exceptUserId: user?.id.toString() });

    if (myQueueErr || queueErr) {
      setIsError(true);
    } else {
      setMyQueue(myQueue);
      setQueue(queue);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchQueue();
  }, []);

  return (
    <LoadingView
      loading={loading}
      isError={isError}
      errorMessage="Невозможно получить данные, пожалуйста повторите позже"
    >
      <Tabs tabs={tabs}>
        <MyQueueSection />
        <QueueSection />
      </Tabs>
    </LoadingView>
  );
};

export default HomeScreen;

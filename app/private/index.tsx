import { Tabs } from '@ant-design/react-native';
import { useEffect, useState } from 'react';

import useQueueStore from '@store/queue.store';

import LoadingView from '@commonComponent/loading-view';
import MyQueueSection from '@component/queue/section/my-queue-section';
import QueueSection from '@component/queue/section/queue-section';

import queueService from '@services/queue.service';

const tabs = [{ title: 'Мои' }, { title: 'Все' }];

const HomeScreen = () => {
  const { setQueue, setMyQueue } = useQueueStore(state => state);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  async function fetchQueue() {
    setLoading(true);

    const nowString = new Date().toISOString();

    const [myQueue, myQueueErr] = await queueService.findMy({ fromDate: nowString });
    const [queue, queueErr] = await queueService.findMany({ fromDate: nowString });

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

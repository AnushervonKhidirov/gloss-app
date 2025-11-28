import useQueueStore from '@store/queue.store';
import useUserStore from '@store/user.store';
import { useEffect, useState } from 'react';

import { Tabs } from '@ant-design/react-native';
import LoadingView from '@commonComponent/loading-view';
import CompletedQueueSection from '@component/queue/section/completed-queue-section';
import MyQueueSection from '@component/queue/section/my-queue-section';
import QueueSection from '@component/queue/section/queue-section';

import queueService from '@service/queue.service';
import { Role, User } from '@type/user.type';

const tabs = [{ title: 'Мои' }, { title: 'Остальные' }];

const HomeScreen = () => {
  const user = useUserStore(state => state.user);
  const { setQueue, setMyQueue } = useQueueStore(state => state);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  async function fetchQueue(user: User) {
    setLoading(true);

    const nowString = new Date().toISOString();

    const [myQueue, myQueueErr] = await queueService.findMy({ dateFrom: nowString });
    const [queue, queueErr] = await queueService.findMany({
      exceptUserId: user.id.toString(),
      dateFrom: nowString,
    });

    if (myQueueErr || queueErr) {
      setIsError(true);
    } else {
      setMyQueue(myQueue);
      setQueue(queue);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (user) fetchQueue(user);
  }, [user]);

  return (
    user && (
      <LoadingView
        loading={loading}
        isError={isError}
        errorMessage="Невозможно получить данные, пожалуйста повторите позже"
      >
        <Tabs tabs={user.role === Role.ADMIN ? [...tabs, { title: 'Оконченные' }] : tabs}>
          <MyQueueSection />
          <QueueSection />
          {user.role === Role.ADMIN && <CompletedQueueSection />}
        </Tabs>
      </LoadingView>
    )
  );
};

export default HomeScreen;

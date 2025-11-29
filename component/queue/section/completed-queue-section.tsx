import { useEffect } from 'react';
import { Alert } from 'react-native';
import QueueList from '../queue-list';

import queueService from '@service/queue.service';
import useQueueStore from '@store/queue.store';

const CompletedQueueSection = () => {
  const { completedQueue, setCompletedQueue } = useQueueStore(state => state);

  async function fetchQueue() {
    const [queue, err] = await queueService.findMany({ dateTo: new Date().toISOString() });

    if (err) {
      Alert.alert(err.error, err.message);
    } else {
      setCompletedQueue(queue);
    }
  }

  useEffect(() => {
    fetchQueue();
  }, []);

  return <QueueList queue={completedQueue} refresh={fetchQueue} emptyMessage="Список пуст" />;
};

export default CompletedQueueSection;

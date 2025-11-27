import useQueueStore from '@store/queue.store';
import { useState } from 'react';
import { Alert } from 'react-native';
import QueueList from '../queue-list';

import queueService from '@services/queue.service';

const QueueSection = () => {
  const { queue, setQueue } = useQueueStore(state => state);
  const [refreshing, setRefreshing] = useState(false);

  async function refreshQueue() {
    setRefreshing(true);
    const [queue, err] = await queueService.findMany();

    if (err) {
      Alert.alert('Ошибка', 'Что-то пошло не так');
    } else {
      setQueue(queue);
    }

    setRefreshing(false);
  }

  return <QueueList queue={queue} refreshing={refreshing} onRefresh={refreshQueue}></QueueList>;
};

export default QueueSection;

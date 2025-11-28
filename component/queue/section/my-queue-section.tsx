import useQueueStore from '@store/queue.store';

import { useState } from 'react';
import { Alert } from 'react-native';
import QueueList from '../queue-list';

import queueService from '@services/queue.service';

const MyQueueSection = () => {
  const { myQueue, setMyQueue } = useQueueStore(state => state);
  const [refreshing, setRefreshing] = useState(false);

  async function refreshQueue() {
    setRefreshing(true);
    const [queue, err] = await queueService.findMy({ fromDate: new Date().toISOString() });

    if (err) {
      Alert.alert('Ошибка', 'Что-то пошло не так');
    } else {
      setMyQueue(queue);
    }

    setRefreshing(false);
  }

  return <QueueList queue={myQueue} refreshing={refreshing} onRefresh={refreshQueue}></QueueList>;
};

export default MyQueueSection;

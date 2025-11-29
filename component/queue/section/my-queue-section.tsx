import { Alert } from 'react-native';
import QueueList from '../queue-list';

import queueService from '@service/queue.service';
import useQueueStore from '@store/queue.store';

const MyQueueSection = () => {
  const { myQueue, setMyQueue } = useQueueStore(state => state);

  async function refreshQueue() {
    const [queue, err] = await queueService.findMy({ dateFrom: new Date().toISOString() });

    if (err) {
      Alert.alert(err.error, err.message);
    } else {
      setMyQueue(queue);
    }
  }

  return <QueueList queue={myQueue} refresh={refreshQueue} emptyMessage='У вас пока нет очереди' />;
};

export default MyQueueSection;

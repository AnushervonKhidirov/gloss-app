import { Alert } from 'react-native';
import QueueList from '../queue-list';

import queueService from '@service/queue.service';
import useQueueStore from '@store/queue.store';

const QueueSection = () => {
  const { queue, setQueue } = useQueueStore(state => state);

  async function refreshQueue() {
    const [queue, err] = await queueService.findMany();

    if (err) {
      Alert.alert('Ошибка', 'Что-то пошло не так');
    } else {
      setQueue(queue);
    }
  }

  return <QueueList queue={queue} refresh={refreshQueue} />;
};

export default QueueSection;

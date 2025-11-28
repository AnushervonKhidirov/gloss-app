import { Alert } from 'react-native';
import QueueList from '../queue-list';

import queueService from '@service/queue.service';
import useQueueStore from '@store/queue.store';

const MyQueueSection = () => {
  const { myQueue, setMyQueue } = useQueueStore(state => state);

  async function refreshQueue() {
    const [queue, err] = await queueService.findMy();

    if (err) {
      Alert.alert('Ошибка', 'Что-то пошло не так');
    } else {
      setMyQueue(queue);
    }
  }

  return <QueueList queue={myQueue} refresh={refreshQueue} />;
};

export default MyQueueSection;

import { Alert } from 'react-native';
import QueueList from '../queue-list';

import queueService from '@service/queue.service';
import useQueueStore from '@store/queue.store';
import useUserStore from '@store/user.store';

const QueueSection = () => {
  const user = useUserStore(state => state.user);
  const { queue, setQueue } = useQueueStore(state => state);

  async function refreshQueue() {
    const [queue, err] = await queueService.findMany({
      exceptUserId: user?.id.toString(),
      dateFrom: new Date().toISOString(),
    });

    if (err) {
      Alert.alert('Ошибка', err.error);
    } else {
      setQueue(queue);
    }
  }

  return <QueueList queue={queue} refresh={refreshQueue} />;
};

export default QueueSection;

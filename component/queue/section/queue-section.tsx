import { Alert } from 'react-native';
import QueueList from '../queue-list';

import queueService from '@service/queue.service';
import useQueueStore from '@store/queue.store';
import useUserStore from '@store/user.store';

const QueueSection = () => {
  const user = useUserStore(state => state.user);
  const { queue, setQueue } = useQueueStore(state => state);

  async function refreshQueue() {
    const [queue, err] = await queueService.findMany({ exceptUserId: user?.id.toString() });

    if (err) {
      Alert.alert('Ошибка', 'Что-то пошло не так');
    } else {
      setQueue(queue);
    }
  }

  return <QueueList queue={queue} refresh={refreshQueue} />;
};

export default QueueSection;

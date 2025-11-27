import type { Queue } from '@type/queue.type';

import { create } from 'zustand';

type QueueState = {
  queue: Queue[];
  setQueue: (queue: Queue[]) => void;
  pushQueue: (queue: Queue[]) => void;
  editQueue: (queue: Queue) => void;
  deleteQueue: (queue: Queue) => void;
};

type MyQueueState = {
  myQueue: Queue[];
  setMyQueue: (queue: Queue[]) => void;
  pushMyQueue: (queue: Queue[]) => void;
  editMyQueue: (queue: Queue) => void;
  deleteMyQueue: (queue: Queue) => void;
};

type QueueStore = QueueState & MyQueueState;

const useQueueStore = create<QueueStore>(set => ({
  queue: [],
  myQueue: [],

  setQueue: queue => set(() => ({ queue })),
  pushQueue: newQueue => set(state => ({ queue: [...state.queue, ...newQueue] })),
  editQueue: editedQueue =>
    set(state => {
      const newServiceList = state.queue.map(queue => {
        return queue.id === editedQueue.id ? editedQueue : queue;
      });
      return { queue: newServiceList };
    }),
  deleteQueue: deletedQueue =>
    set(state => {
      const newServiceList = state.queue.filter(queue => queue.id !== deletedQueue.id);
      return { queue: newServiceList };
    }),

  setMyQueue: myQueue => set(() => ({ myQueue })),
  pushMyQueue: newQueue => set(state => ({ myQueue: [...state.myQueue, ...newQueue] })),
  editMyQueue: editedQueue =>
    set(state => {
      const newServiceList = state.myQueue.map(queue => {
        return queue.id === editedQueue.id ? editedQueue : queue;
      });
      return { myQueue: newServiceList };
    }),
  deleteMyQueue: deletedQueue =>
    set(state => {
      const newServiceList = state.myQueue.filter(queue => queue.id !== deletedQueue.id);
      return { myQueue: newServiceList };
    }),
}));

export default useQueueStore;

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

type QueueStore = QueueState &
  MyQueueState & {
    deleteFromAll: (queue: Queue) => void;
  };

const useQueueStore = create<QueueStore>(set => ({
  queue: [],
  myQueue: [],

  setQueue: queue => set(() => ({ queue })),
  pushQueue: newQueue => set(state => ({ queue: [...state.queue, ...newQueue] })),
  editQueue: editedQueue =>
    set(state => {
      const queue = state.queue.map(queue => {
        return queue.id === editedQueue.id ? editedQueue : queue;
      });
      return { queue };
    }),
  deleteQueue: deletedQueue =>
    set(state => {
      const queue = state.queue.filter(queue => queue.id !== deletedQueue.id);
      return { queue };
    }),

  setMyQueue: myQueue => set(() => ({ myQueue })),
  pushMyQueue: newQueue => set(state => ({ myQueue: [...state.myQueue, ...newQueue] })),
  editMyQueue: editedQueue =>
    set(state => {
      const myQueue = state.myQueue.map(queue => {
        return queue.id === editedQueue.id ? editedQueue : queue;
      });
      return { myQueue };
    }),
  deleteMyQueue: deletedQueue =>
    set(state => {
      const myQueue = state.myQueue.filter(queue => queue.id !== deletedQueue.id);
      return { myQueue };
    }),

  deleteFromAll: deletedQueue =>
    set(state => {
      const queue = state.queue.filter(queue => queue.id !== deletedQueue.id);
      const myQueue = state.myQueue.filter(queue => queue.id !== deletedQueue.id);
      return { queue, myQueue };
    }),
}));

export default useQueueStore;

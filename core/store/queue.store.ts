import type { Queue } from '@type/queue.type';

import { create } from 'zustand';

type MyQueueState = {
  myQueue: Queue[];
  setMyQueue: (queue: Queue[]) => void;
  pushMyQueue: (queue: Queue[]) => void;
  deleteMyQueue: (queue: Queue) => void;
};

type QueueState = {
  queue: Queue[];
  setQueue: (queue: Queue[]) => void;
  pushQueue: (queue: Queue[]) => void;
  deleteQueue: (queue: Queue) => void;
};

type CompletedQueueState = {
  completedQueue: Queue[];
  setCompletedQueue: (queue: Queue[]) => void;
  pushCompletedQueue: (queue: Queue[]) => void;
  deleteCompletedQueue: (queue: Queue) => void;
};

type QueueStore = MyQueueState &
  QueueState &
  CompletedQueueState & {
    deleteFromAll: (queue: Queue) => void;
  };

const useQueueStore = create<QueueStore>(set => ({
  myQueue: [],
  queue: [],
  completedQueue: [],

  setMyQueue: myQueue => set(() => ({ myQueue })),
  pushMyQueue: newQueue => set(state => ({ myQueue: [...state.myQueue, ...newQueue] })),
  deleteMyQueue: deletedQueue =>
    set(state => {
      const myQueue = state.myQueue.filter(queue => queue.id !== deletedQueue.id);
      return { myQueue };
    }),

  setQueue: queue => set(() => ({ queue })),
  pushQueue: newQueue => set(state => ({ queue: [...state.queue, ...newQueue] })),
  deleteQueue: deletedQueue =>
    set(state => {
      const queue = state.queue.filter(queue => queue.id !== deletedQueue.id);
      return { queue };
    }),

  setCompletedQueue: completedQueue => set(() => ({ completedQueue })),
  pushCompletedQueue: newQueue =>
    set(state => ({ completedQueue: [...state.completedQueue, ...newQueue] })),

  deleteCompletedQueue: deletedQueue =>
    set(state => {
      const queue = state.completedQueue.filter(queue => queue.id !== deletedQueue.id);
      return { queue };
    }),

  deleteFromAll: deletedQueue =>
    set(state => {
      const queue = state.queue.filter(queue => queue.id !== deletedQueue.id);
      const myQueue = state.myQueue.filter(queue => queue.id !== deletedQueue.id);
      const completedQueue = state.completedQueue.filter(queue => queue.id !== deletedQueue.id);
      return { queue, myQueue, completedQueue };
    }),
}));

export default useQueueStore;

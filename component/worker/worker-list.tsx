import type { User } from '@type/user.type';
import { type FC, type PropsWithChildren } from 'react';

import ScrollView from '@commonComponent/scroll-view';
import WorkerCard from './worker-card';

type WorkerListProps = PropsWithChildren<{
  workers: User[];
  refresh: () => Promise<void>;
}>;

const WorkerList: FC<WorkerListProps> = ({ workers, refresh }) => {
  return (
    <ScrollView
      searchable
      onRefresh={refresh}
      items={workers}
      renderItem={worker => <WorkerCard key={worker.id} worker={worker} />}
    />
  );
};

export default WorkerList;

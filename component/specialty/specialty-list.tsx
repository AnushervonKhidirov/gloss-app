import type { Specialty } from '@type/specialty.type';
import type { FC, PropsWithChildren } from 'react';

import ScrollView from '@commonComponent/scroll-view';
import SpecialtyCard from './specialty-card';

type SpecialtyListProps = PropsWithChildren<{
  specialties: Specialty[];
  onEdit?: (specialty: Specialty) => void;
  onRemove?: (specialty: Specialty) => void;
  refresh: () => Promise<void>;
}>;

const SpecialtyList: FC<SpecialtyListProps> = ({
  specialties,
  onEdit,
  onRemove,
  refresh,
  children,
}) => {
  return (
    <ScrollView
      searchable
      onRefresh={refresh}
      items={specialties}
      renderItem={specialty => (
        <SpecialtyCard
          key={specialty.id}
          specialty={specialty}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      )}
    >
      {children}
    </ScrollView>
  );
};

export default SpecialtyList;

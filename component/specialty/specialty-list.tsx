import type { Specialty } from '@type/specialty.type';
import type { FC, PropsWithChildren } from 'react';

import { ScrollView } from '@component/common';
import SpecialtyCard from './specialty-card';

type SpecialtyListProps = PropsWithChildren<{
  specialties: Specialty[];
  edit: (specialty: Specialty) => void;
  remove: (specialty: Specialty) => void;
  refresh: () => Promise<void>;
}>;

const SpecialtyList: FC<SpecialtyListProps> = ({
  specialties,
  edit,
  remove,
  refresh,
  children,
}) => {
  return (
    <ScrollView
      searchable
      onRefresh={refresh}
      items={specialties}
      renderItem={specialty => (
        <SpecialtyCard key={specialty.id} specialty={specialty} edit={edit} remove={remove} />
      )}
    >
      {children}
    </ScrollView>
  );
};

export default SpecialtyList;

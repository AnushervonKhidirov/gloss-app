import type { Specialty } from '@type/specialty.type';
import type { FC, PropsWithChildren } from 'react';

import ScrollView from '@commonComponent/scroll-view';
import { Text, View } from 'react-native';
import SpecialtyCard from './specialty-card';

type SpecialtyListProps = PropsWithChildren<{
  specialties: Specialty[];
  emptyMessage?: string;
  onEdit?: (specialty: Specialty) => void;
  onRemove?: (specialty: Specialty) => void;
  refresh: () => Promise<void>;
}>;

const SpecialtyList: FC<SpecialtyListProps> = ({
  specialties,
  onEdit,
  onRemove,
  refresh,
  emptyMessage,
  children,
}) => {
  const message = emptyMessage ?? 'Список специальностей пуст';

  return (
    <View style={{ flex: 1, gap: 16 }}>
      <ScrollView onRefresh={refresh}>
        <View style={{ gap: 10, flex: 1 }}>
          {specialties.length > 0 ? (
            specialties.map(specialty => (
              <SpecialtyCard
                key={specialty.id}
                specialty={specialty}
                onEdit={onEdit}
                onRemove={onRemove}
              />
            ))
          ) : (
            <Text>{message}</Text>
          )}
        </View>
      </ScrollView>

      {children}
    </View>
  );
};

export default SpecialtyList;

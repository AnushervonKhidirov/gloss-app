import type { FC } from 'react';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View } from 'react-native';

import { blue, red } from '@ant-design/colors';

type ActionButtonsProps = {
  onEdit?: () => void;
  onRemove?: () => void;
};

const ActionButtons: FC<ActionButtonsProps> = ({ onEdit, onRemove }) => {
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {typeof onRemove === 'function' && (
        <MaterialCommunityIcons
          name="delete-outline"
          size={24}
          color={red.primary}
          onPress={onRemove}
        />
      )}
      {typeof onEdit === 'function' && (
        <MaterialCommunityIcons
          name="square-edit-outline"
          size={24}
          color={blue.primary}
          onPress={onEdit}
        />
      )}
    </View>
  );
};

export default ActionButtons;

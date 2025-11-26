import type { FC } from 'react';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleProp, View, ViewStyle } from 'react-native';

import { blue } from '@ant-design/colors';

type ActionButtonsProps = {
  styles?: StyleProp<ViewStyle>;
  onEdit?: () => void;
  onRemove?: () => void;
};

const ActionButtons: FC<ActionButtonsProps> = ({ styles = {}, onEdit, onRemove }) => {
  return (
    <View style={{ flexDirection: 'row', gap: 5, ...(styles as {}) }}>
      {typeof onRemove === 'function' && (
        <MaterialCommunityIcons
          name="delete-outline"
          size={24}
          color={blue.primary}
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

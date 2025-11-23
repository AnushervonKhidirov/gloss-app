import type { FC } from 'react';

import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleProp, View, ViewStyle } from 'react-native';

import { blue } from '@ant-design/colors';

type ActionButtonsProps = {
  editable?: boolean;
  removable?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
  styles?: StyleProp<ViewStyle>;
};

const ActionButtons: FC<ActionButtonsProps> = ({
  editable = true,
  removable = true,
  styles = {},
  onEdit,
  onRemove,
}) => {
  return (
    <View style={{ flexDirection: 'row', gap: 15, ...(styles as {}) }}>
      {removable && (
        <MaterialIcons name="delete-outline" size={24} color={blue.primary} onPress={onRemove} />
      )}
      {editable && <Feather name="edit" size={24} color={blue.primary} onPress={onEdit} />}
    </View>
  );
};

export default ActionButtons;

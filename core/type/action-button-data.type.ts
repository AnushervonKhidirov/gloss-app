import type { ComponentProps } from 'react';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export type ActionButtonData = {
  iconName: ComponentProps<typeof MaterialCommunityIcons>['name'];
  text: string;
  action: () => void;
};

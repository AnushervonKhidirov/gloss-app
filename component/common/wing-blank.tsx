import type { FC, PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

const WingBlank: FC<PropsWithChildren & { style?: StyleProp<ViewStyle> }> = ({
  style = {} as {},
  children,
}) => {
  return <View style={{ paddingInline: 16, ...style }}>{children}</View>;
};

export default WingBlank;

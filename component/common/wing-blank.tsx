import type { FC, PropsWithChildren } from 'react';
import { View } from 'react-native';

const WingBlank: FC<PropsWithChildren> = ({ children }) => {
  return <View style={{ paddingInline: 16 }}>{children}</View>;
};

export default WingBlank;

import type { FC, PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { Text, View } from 'react-native';
import Loader from './loader';

type LoadingViewProps = PropsWithChildren<{
  loading: boolean;
  isError?: boolean;
  errorMessage?: string;
  style?: StyleProp<ViewStyle>;
}>;

const LoadingView: FC<LoadingViewProps> = ({
  loading,
  isError,
  errorMessage,
  style = {},
  children,
}) => {
  const content =
    errorMessage && isError ? (
      <View style={{ justifyContent: 'center', flex: 1 }}>
        <Text style={{ textAlign: 'center' }}>{errorMessage}</Text>
      </View>
    ) : (
      children
    );
  return (
    <View style={{ flex: 1, ...(style as {}) }}>
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Loader />
        </View>
      ) : (
        content
      )}
    </View>
  );
};

export default LoadingView;

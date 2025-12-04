import type { FC, PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import AntDesign from '@expo/vector-icons/AntDesign';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';

import { blue } from '@constant/theme';

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
  return <View style={{ flex: 1, ...(style as {}) }}>{loading ? <Loader /> : content}</View>;
};

const Loader: FC = () => {
  const size = 50;
  const rotateValue = useRef(new Animated.Value(0)).current;

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        easing: Easing.linear,
        duration: 2000,
        useNativeDriver: true,
      }),
    ).start();

    return () => {
      rotateValue.stopAnimation();
    };
  }, [rotateValue]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ transform: [{ rotate }], width: size, height: size }}>
        <AntDesign name="loading" size={size} color={blue[5]} />
      </Animated.View>
    </View>
  );
};

export default LoadingView;

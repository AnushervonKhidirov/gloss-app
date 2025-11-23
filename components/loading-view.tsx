import type { FC, PropsWithChildren } from 'react';

import { blue } from '@ant-design/colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';

type LoadingViewProps = PropsWithChildren<{
  loading: boolean;
  isError?: boolean;
  errorMessage?: string;
}>;

const LoadingView: FC<LoadingViewProps> = ({ loading, isError, errorMessage, children }) => {
  const content = errorMessage && isError ? <Text>{errorMessage}</Text> : children;
  return <View style={{ flex: 1 }}>{loading ? <Loader /> : content}</View>;
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
        <AntDesign name="loading" size={size} color={blue.primary} />
      </Animated.View>
    </View>
  );
};

export default LoadingView;

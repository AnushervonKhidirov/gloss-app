import type { FC } from 'react';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

import { grey } from '@constant/theme';

const Loader: FC<{ size?: number; color?: string }> = ({ size = 50, color = grey[9] }) => {
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
        duration: 1500,
        useNativeDriver: true,
      }),
    ).start();

    return () => {
      rotateValue.stopAnimation();
    };
  }, [rotateValue]);

  return (
    <Animated.View style={{ transform: [{ rotate }], width: size, height: size }}>
      <MaterialCommunityIcons name="loading" size={size} color={color} />
    </Animated.View>
  );
};

export default Loader;

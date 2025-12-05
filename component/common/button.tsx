import type { FC } from 'react';
import type { GestureResponderEvent, PressableProps, StyleProp, ViewStyle } from 'react-native';

import { grey } from '@constant/theme';
import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Loader from './loader';

type ButtonProps = PressableProps & {
  title: string;
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  styles?: {
    button?: StyleProp<ViewStyle>;
    text?: StyleProp<ViewStyle>;
  };
};

const Button: FC<ButtonProps> = ({
  title,
  loading = false,
  disabled = false,
  size = 'large',
  style = {} as any,
  styles = { button: {} as any, text: {} as any },
  ...props
}) => {
  const [pressedStyles, setPressedStyles] = useState<StyleProp<ViewStyle>>({});

  const wrapStyle = { ...wrapStyles.common, ...wrapStyles[size], ...style, ...styles.button };
  const textStyle = { ...textStyles.common, ...textStyles[size], ...styles.text };

  const opacity = disabled ? 0.5 : 1;
  const pointerEvents = loading || disabled ? 'none' : 'auto';

  function onPressInHandler(e: GestureResponderEvent) {
    if (props.onPressIn) props.onPressIn(e);
    setPressedStyles(wrapStyles.commonPressed);
  }

  function onPressOutHandler(e: GestureResponderEvent) {
    if (props.onPressOut) props.onPressOut(e);
    setPressedStyles({});
  }

  return (
    <Pressable
      {...props}
      style={{ ...wrapStyle, ...(pressedStyles as {}), opacity, pointerEvents }}
      onPressIn={onPressInHandler}
      onPressOut={onPressOutHandler}
    >
      {loading && <Loader size={textStyle.fontSize * 1.2} color="#fff" />}
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  );
};

const wrapStyles = StyleSheet.create({
  common: {
    backgroundColor: grey[9],
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    alignItems: 'center',
  },

  commonPressed: {
    backgroundColor: grey[8],
  },

  commonDisabled: {
    opacity: 0.5,
  },

  small: { padding: 8 },
  medium: { padding: 10 },
  large: { padding: 12 },
});

const textStyles = StyleSheet.create({
  common: {
    color: grey[1],
    textAlign: 'center',
  },

  small: { fontSize: 12 },
  medium: { fontSize: 15 },
  large: { fontSize: 18 },
});

export default Button;

import type { ButtonProps } from '@ant-design/react-native';
import type { FC } from 'react';

import { Button, Provider } from '@ant-design/react-native';

import { grey } from '@constant/theme';

const ButtonPrimary: FC<Omit<ButtonProps, 'type'>> = props => {
  return (
    <Provider theme={{ primary_button_fill: grey[9], primary_button_fill_tap: grey[7] }}>
      <Button type="primary" {...props}></Button>
    </Provider>
  );
};

export default ButtonPrimary;

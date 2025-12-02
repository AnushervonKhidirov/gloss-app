import { Provider } from '@ant-design/react-native';
import { Stack } from 'expo-router';

import { antTheme } from '@constant/theme';

const AuthLayout = () => {
  return (
    <Provider theme={antTheme}>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}></Stack>
    </Provider>
  );
};

export default AuthLayout;

import { Button } from '@ant-design/react-native';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

import authService from '@service/auth.service';
import TokenService from '@service/token.service';
import { useState } from 'react';

const ProfileScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    const token = await TokenService.getToken();
    if (token) await authService.signOut(token);

    await TokenService.removeToken();
    setLoading(false);
    router.navigate('/(auth)');
  }

  return (
    <View>
      <Button type="primary" loading={loading} onPress={signOut}>
        Выйти
      </Button>
    </View>
  );
};

export default ProfileScreen;

import { Button } from '@ant-design/react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import authService from '@service/auth.service';
import TokenService from '@service/token.service';

const ProfileScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);

    const token = await TokenService.getToken();
    if (token) await authService.signOut(token);
    TokenService.removeToken();

    setLoading(false);

    router.navigate('/');
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

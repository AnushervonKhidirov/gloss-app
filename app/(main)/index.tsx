import TokenService from '@service/token.service';
import userService from '@service/user.service';
import useUserStore from '@store/user.store';
import { router } from 'expo-router';
import { useLayoutEffect } from 'react';

export default function MainScreen() {
  const { setUser } = useUserStore(state => state);

  async function fetchUser() {
    const token = TokenService.getToken();

    if (!token) {
      router.navigate('/(auth)');
      return;
    }

    const [user, err] = await userService.findMe();

    if (err) {
      router.navigate('/(auth)');
    } else {
      setUser(user);
      router.navigate('/(main)/appointment');
    }
  }

  useLayoutEffect(() => {
    fetchUser();
  }, []);

  return <></>;
}

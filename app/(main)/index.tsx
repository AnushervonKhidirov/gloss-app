import TokenService from '@service/token.service';
import userService from '@service/user.service';
import useUserStore from '@store/user.store';
import { router, useFocusEffect } from 'expo-router';

export default function MainScreen() {
  const { user, setUser } = useUserStore(state => state);

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

  useFocusEffect(() => {
    if (user) {
      router.navigate('/(main)/appointment');
    } else {
      fetchUser();
    }
  });

  return <></>;
}

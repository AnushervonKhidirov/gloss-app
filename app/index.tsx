import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Image } from 'react-native';

import useUserStore from '@store/user.store';

import TokenService from '@services/token.service';
import userService from '@services/user.service';

const HomeScreen = () => {
  const router = useRouter();
  const { setUser, removeUser } = useUserStore(state => state);

  const loadingAnim = useRef(new Animated.Value(1)).current;

  async function getUserData() {
    const token = await TokenService.getToken();
    if (!token) router.replace('/sign-in');

    const [user, err] = await userService.findMe();

    if (err) {
      removeUser();
      router.replace('/sign-in');
    } else {
      setUser(user);
      router.replace('/private');
    }
  }

  useEffect(() => {
    const fadeIn = Animated.timing(loadingAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });

    const fadeOut = Animated.timing(loadingAnim, {
      toValue: 0.5,
      duration: 1000,
      useNativeDriver: true,
    });

    const loopAnimation = Animated.loop(Animated.sequence([fadeOut, fadeIn]));

    loopAnimation.start();

    return () => loopAnimation.stop();
  }, [loadingAnim]);

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Animated.View style={{ opacity: loadingAnim }}>
      <Image
        style={{ width: '50%', objectFit: 'contain', alignSelf: 'center' }}
        source={require('@images/logo.png')}
      />
    </Animated.View>
  );
};

export default HomeScreen;

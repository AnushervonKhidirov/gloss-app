import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Image } from 'react-native';

import { AuthService } from '@services/auth.service';
import { UserService } from '@services/user.service';

const authService = new AuthService();
const userService = new UserService();

const HomeScreen = () => {
  const router = useRouter();
  const loadingAnim = useRef(new Animated.Value(1)).current;

  async function getUserData() {
    const token = await AuthService.getToken();

    if (!token) router.navigate('/sign-in');

    const [user, err] = await userService.findMe();
    if (err) {
      console.log('user err', err);
      router.navigate('/sign-in');
    } else {
      console.log('user', user);
      router.navigate('/(tabs)');
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

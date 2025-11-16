import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

const HomeScreen = () => {
  const router = useRouter();

  return (
    <View>
      <Text>Home Screen (Tabs)</Text>
      <Button title="sign up" onPress={() => router.navigate('/sign-up')} />
    </View>
  );
};

export default HomeScreen;

import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: true, animation: 'fade' }}></Stack>;
}

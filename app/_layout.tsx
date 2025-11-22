import { Stack } from 'expo-router';

import dayjs from 'dayjs';
import ru from 'dayjs/locale/ru';
import duration from 'dayjs/plugin/duration';
import localeData from 'dayjs/plugin/localeData';

dayjs.locale(ru);
dayjs.extend(localeData);
dayjs.extend(duration);

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false, animation: 'fade' }}></Stack>;
}

import type { FC } from 'react';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Linking, Pressable, View } from 'react-native';

import { blue, green } from '@ant-design/colors';

const ConnectActionButtons: FC<{ phone: string }> = ({ phone }) => {
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <Pressable onPress={() => Linking.openURL(`sms:${phone}`)}>
        <MaterialCommunityIcons name="email-outline" size={24} color={blue.primary} />
      </Pressable>

      <Pressable onPress={() => Linking.openURL(`tel:${phone}`)}>
        <MaterialCommunityIcons name="phone" size={24} color={green.primary} />
      </Pressable>
    </View>
  );
};

export default ConnectActionButtons;

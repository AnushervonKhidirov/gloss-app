import type { BlackList } from '@type/client.type';
import type { FC } from 'react';

import Card from '@commonComponent/card';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { Text } from 'react-native';

import { grey } from '@constant/theme';

type BlackListCardProps = {
  blackList: BlackList;
  restore: (phone: string) => void;
};

const BlackListCard: FC<BlackListCardProps> = ({ blackList, restore }) => {
  return (
    <Card style={{ paddingTop: 5, paddingRight: 0, paddingBottom: 5, paddingLeft: 0 }}>
      <Card.Header
        content={
          <Text style={{ fontSize: 18 }}>
            {parsePhoneNumberFromString(blackList.phone, 'TJ')?.formatNational()}
          </Text>
        }
        extra={
          <MaterialCommunityIcons
            name="restore"
            size={24}
            color={grey[9]}
            onPress={() => restore(blackList.phone)}
          />
        }
      />
    </Card>
  );
};

export default BlackListCard;

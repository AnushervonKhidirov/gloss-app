import type { Specialty } from '@type/specialty.type';
import type { FC } from 'react';

import { Card, WingBlank } from '@ant-design/react-native';
import ActionButtons from '@commonComponent/action-buttons';
import { Text, View } from 'react-native';

import { gray } from '@ant-design/colors';
import { cardStyle } from '@constant/card-style';

type SpecialtyItemProps = {
  specialty: Specialty;
  onEdit?: (specialty: Specialty) => void;
  onRemove?: (specialty: Specialty) => void;
};

const SpecialtyCard: FC<SpecialtyItemProps> = ({ specialty, onEdit, onRemove }) => {
  return (
    <Card>
      <Card.Header
        styles={cardStyle.header}
        title={<Text>{specialty.name}</Text>}
        extra={
          <ActionButtons
            onEdit={onEdit?.bind(null, specialty)}
            onRemove={onRemove?.bind(null, specialty)}
          />
        }
      />

      {specialty.desc ? (
        <Card.Body>
          <WingBlank>
            <Text style={{ color: gray.primary }}>{specialty.desc}</Text>
          </WingBlank>
        </Card.Body>
      ) : (
        <View />
      )}
    </Card>
  );
};

export default SpecialtyCard;

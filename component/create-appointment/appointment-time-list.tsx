import type { SelectableTime } from '@type/time.type';
import type { FC } from 'react';

import { grey } from '@constant/theme';
import { separateByDayTime } from '@helper/time-converter.helper';
import { Pressable, Text, View } from 'react-native';

export type TimeListProps = {
  relatedToId: number;
  times: SelectableTime[];
  selectedTime: SelectableTime | null;
  onSelect?: (selectedTime: SelectableTime | null) => void;
};

const AppointmentTimeList: FC<TimeListProps> = ({ relatedToId, times, selectedTime, onSelect }) => {
  const dayTimes = separateByDayTime(times);
  const dayTimeNames = Object.keys(dayTimes) as (keyof typeof dayTimes)[];

  function onSelectTime(time: SelectableTime) {
    const { value, disabled } = time;
    if (disabled || typeof onSelect !== 'function') return;

    const isSameTime = value.isSame(selectedTime?.value);
    const isSameRelation = selectedTime?.relatedToId === relatedToId;
    const selected = isSameTime && isSameRelation ? null : time;

    onSelect(selected);
  }

  return (
    <View>
      {dayTimeNames.map(dayTimeName => {
        const dayTime = dayTimes[dayTimeName];

        return (
          <View key={relatedToId + dayTimeName} style={{ marginBottom: 10, gap: 10 }}>
            <Text style={{ fontWeight: 700 }}>{dayTime.title}</Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {dayTime.values.map(time => {
                const isSelected =
                  time.value.isSame(selectedTime?.value, 'minute') &&
                  time.relatedToId === selectedTime?.relatedToId;

                const disabledStyles = time.disabled ? { opacity: 0.5 } : {};

                const checkedStyles = {
                  button: isSelected ? { backgroundColor: grey[9] } : { backgroundColor: grey[2] },
                  text: isSelected ? { color: grey[1] } : { color: grey[9] },
                };

                return (
                  <Pressable
                    key={relatedToId + time.value.toString()}
                    onPress={time.disabled ? undefined : () => onSelectTime(time)}
                    style={{
                      borderRadius: 50,
                      paddingBlock: 3,
                      paddingInline: 7,
                      ...disabledStyles,
                      ...checkedStyles.button,
                    }}
                  >
                    <Text style={checkedStyles.text}>{time.value.format('HH:mm')}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default AppointmentTimeList;

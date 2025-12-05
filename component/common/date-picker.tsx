import type { Dayjs } from 'dayjs';
import type { FC } from 'react';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Button from './button';

import { grey } from '@constant/theme';
import dayjs from 'dayjs';

type DatePickerProps = {
  initialDate?: Dayjs;
  onSelect: (date: Dayjs) => void;
};

const DatePicker: FC<DatePickerProps> = ({ initialDate, onSelect }) => {
  const [date, setDate] = useState(initialDate ?? dayjs());
  const [visible, setVisible] = useState(false);

  function selectDate(date: Dayjs) {
    setDate(date);
    setVisible(false);
    onSelect(date);
  }

  return (
    <>
      <CalendarButton date={date} onPress={() => setVisible(true)} />

      <Modal
        transparent
        visible={visible}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.modalWrapper} onPress={() => setVisible(false)}>
          <Calendar date={date} setDate={selectDate} />
        </Pressable>
      </Modal>
    </>
  );
};

const CalendarButton: FC<{ date: Dayjs; onPress: () => void }> = ({ date, onPress }) => {
  const dateText = date.startOf('date').format('DD/MM/YYYY');

  return (
    <Pressable style={styles.datePickerWrapper} onPress={onPress}>
      <Text style={styles.datePickerText}>{dateText}</Text>
      <MaterialCommunityIcons name="calendar-search-outline" size={24} color={grey[4]} />
    </Pressable>
  );
};

const Calendar: FC<{ date: Dayjs; setDate: (date: Dayjs) => void }> = ({ date, setDate }) => {
  const [selectedDate, setSelectedDate] = useState(date.startOf('date'));
  const [selectedMonth, setSelectedMonth] = useState(date.startOf('month'));

  return (
    <Pressable style={styles.calendarWrap}>
      <CalendarHeader selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />

      <CalendarBody
        selectedMonth={selectedMonth}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <View style={styles.buttonWrapper}>
        <Button
          title="Сегодня"
          style={styles.button}
          onPress={() => setSelectedDate(dayjs().startOf('date'))}
        />

        <Button
          title="Выбрать"
          disabled={selectedDate.isSame(date, 'date')}
          style={styles.button}
          onPress={() => setDate(selectedDate)}
        />
      </View>
    </Pressable>
  );
};

const CalendarHeader: FC<{ selectedMonth: Dayjs; setSelectedMonth: (date: Dayjs) => void }> = ({
  selectedMonth,
  setSelectedMonth,
}) => {
  function prevMonth() {
    setSelectedMonth(selectedMonth.set('month', selectedMonth.month() - 1).startOf('date'));
  }

  function nextMonth() {
    setSelectedMonth(selectedMonth.set('month', selectedMonth.month() + 1).startOf('date'));
  }

  return (
    <View style={styles.calendarHeader}>
      <MaterialCommunityIcons
        name="chevron-left-circle"
        size={24}
        style={{ padding: 5 }}
        color={grey[9]}
        onPress={prevMonth}
      />

      <Text style={styles.calendarHeaderText}>{selectedMonth.format('MMMM')}</Text>

      <MaterialCommunityIcons
        name="chevron-right-circle"
        size={24}
        style={{ padding: 5 }}
        color={grey[9]}
        onPress={nextMonth}
      />
    </View>
  );
};

const CalendarBody: FC<{
  selectedMonth: Dayjs;
  selectedDate: Dayjs;
  setSelectedDate: (date: Dayjs) => void;
}> = ({ selectedMonth, selectedDate, setSelectedDate }) => {
  const dates = getDateArray(selectedMonth);
  const weekdays = dayjs.weekdaysMin(true);

  function isActive(date: Dayjs) {
    return date.isSame(selectedDate, 'date') ? styles.calendarDayNumberActive : {};
  }

  function blurDate(date: Dayjs) {
    const shouldBlur = date.isSame(selectedMonth, 'month') || date.isSame(selectedDate, 'date');
    return shouldBlur ? {} : { opacity: 0.25 };
  }

  return (
    <View style={styles.calendarBody}>
      <View style={styles.calendarWeekDays}>
        {weekdays.map(weekday => {
          return (
            <Text key={weekday} style={styles.calendarWeekDayItem}>
              {weekday}
            </Text>
          );
        })}
      </View>

      <View style={styles.calendarDayWrap}>
        {dates.map(date => (
          <Pressable
            key={date.toISOString()}
            onPress={() => setSelectedDate(date)}
            style={{ ...styles.calendarDay, ...blurDate(date) }}
          >
            <Text style={{ ...styles.calendarDayNumber, ...isActive(date) }}>
              {date.format('DD')}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

function getDateArray(month: Dayjs) {
  const totalDates = 7 * 6;
  const days: Dayjs[] = [];

  const startOfMonth = month.startOf('month').set('date', month.startOf('month').date() - 1);

  for (let day = 1 - startOfMonth.day(); day <= totalDates - startOfMonth.day(); day++) {
    days.push(month.set('date', day).startOf('date'));
  }

  return days;
}

const dayItemWidth = 40;

const styles = StyleSheet.create({
  // date picker
  datePickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    width: 140,
    borderWidth: 1,
    borderColor: grey[2],
    paddingBlock: 5,
    paddingInline: 10,
    borderRadius: 5,
    backgroundColor: grey[0],
  },

  datePickerText: {
    flex: 1,
    fontSize: 16,
    color: grey[6],
  },

  // modal
  modalWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },

  calendarWrap: {
    backgroundColor: grey[1],
    paddingInline: 20,
    paddingBlock: 30,
    borderRadius: 20,
    margin: 20,
    gap: 10,
    alignItems: 'center',
  },

  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: dayItemWidth * 7,
  },

  calendarHeaderText: {
    flex: 1,
    textAlign: 'center',
    textTransform: 'capitalize',
    color: grey[9],
    fontSize: 20,
  },

  calendarBody: {
    width: dayItemWidth * 7,
  },

  calendarWeekDays: {
    flexDirection: 'row',
  },

  calendarWeekDayItem: {
    width: dayItemWidth,
    textAlign: 'center',
    lineHeight: 30,
    fontSize: 16,
    fontWeight: 700,
  },

  calendarDayWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  calendarDay: {
    width: dayItemWidth,
    height: dayItemWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },

  calendarDayNumber: {
    width: dayItemWidth - 10,
    height: dayItemWidth - 10,
    borderRadius: dayItemWidth - 10,
    lineHeight: dayItemWidth - 10,
    color: grey[9],
    textAlign: 'center',
  },

  calendarDayNumberActive: {
    backgroundColor: grey[9],
    color: grey[1],
  },

  // button wrapper
  buttonWrapper: {
    flexDirection: 'row',
    gap: 10,
  },

  button: {
    flex: 1,
  },
});

export default DatePicker;

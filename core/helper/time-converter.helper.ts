import type { DayTimes, SelectableTime } from '@type/time.type';
import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';

export function minutesToTime(duration: number): string {
  const dur = dayjs.duration(duration, 'minute');
  const hours = dur.hours() ? `${dur.hours()} ч` : '';
  const mins = dur.minutes() ? `${dur.minutes()} мин` : '';

  return `${hours} ${mins}`.trim();
}

export function getDateString(date: Dayjs): string {
  const today = dayjs().startOf('day');
  const dayText = ['Сегодня', 'Завтра'];
  const diff = date.startOf('day').diff(today, 'day');

  if (dayText[diff]) return `${dayText[diff]} в ${date.format('H:mm')}`;
  return date.format('DD MMM в H:mm (dd)');
}

export function separateByDayTime(times: SelectableTime[]) {
  const dayTimes: DayTimes = {
    morning: { title: 'Утро', values: [] },
    afternoon: { title: 'День', values: [] },
    evening: { title: 'Вечер', values: [] },
  };

  for (const time of times) {
    const h = time.value.get('hour');

    if (h < 12) dayTimes.morning.values.push(time);
    if (h >= 12 && h < 18) dayTimes.afternoon.values.push(time);
    if (h >= 18) dayTimes.evening.values.push(time);
  }

  return dayTimes;
}

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

  if (dayText[diff]) return `${dayText[diff]} в ${date.format('h:mm a')}`;
  return date.format('DD MMM в h:mm a (dd)');
}

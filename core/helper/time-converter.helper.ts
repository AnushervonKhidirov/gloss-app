import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import { getNumberWithZero } from './common.helper';

export function minutesToTime(duration: number): string {
  const dur = dayjs.duration(duration, 'minute');
  const hours = dur.hours() ? `${dur.hours()} ч` : '';
  const mins = dur.minutes() ? `${dur.minutes()} мин` : '';

  return `${hours} ${mins}`.trim();
}

export function getTimeString(date: Dayjs) {
  const h = getNumberWithZero(date.hour());
  const m = getNumberWithZero(date.minute());
  return `${h}:${m}`;
}

export function getDateString(date: Dayjs): string {
  const today = dayjs().startOf('day');
  const dayText = ['Сегодня', 'Завтра'];
  const diff = date.startOf('day').diff(today, 'day');

  if (dayText[diff]) return `${dayText[diff]} в ${date.format('hh:mm')}`;
  return date.format('DD MMMM h:mm (dddd)');
}

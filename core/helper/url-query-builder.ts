import dayjs from 'dayjs';

export function urlQueryBuilder(queryObj: { [key: string]: unknown } = {}) {
  const converted: { [key: string]: string } = {};

  for (const param in queryObj) {
    if (typeof queryObj[param] === 'number') {
      converted[param] = queryObj[param].toString();
      continue;
    }

    if (typeof queryObj[param] === 'string') {
      converted[param] = queryObj[param];
      continue;
    }

    if (Array.isArray(queryObj[param])) {
      converted[param] = queryObj[param].join(',');
      continue;
    }

    if (dayjs.isDayjs(queryObj[param]) || queryObj[param] instanceof Date) {
      converted[param] = dayjs(queryObj[param]).toISOString();
    }
  }

  if (!Object.keys(converted).length) return '';
  return `?${new URLSearchParams(converted)}`;
}

import type { Dayjs } from 'dayjs';

export type SelectableTime = {
  disabled: boolean;
  value: Dayjs;
  relatedToId: number;
};

export type DayTimes = {
  morning: {
    title: string;
    values: SelectableTime[];
  };
  afternoon: {
    title: string;
    values: SelectableTime[];
  };
  evening: {
    title: string;
    values: SelectableTime[];
  };
};

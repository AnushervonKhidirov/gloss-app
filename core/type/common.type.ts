import { HttpException } from '@helper/error-handler';
import type { ReactNode } from 'react';

export type ExtraProps<T = object> = T & {
  children?: ReactNode;
  className?: string;
};

export type WithClassName<T = object> = T & {
  className?: string;
};

export type ReturnWithErr<T> = [T, null] | [null, HttpException];
export type ReturnWithErrPromise<T> = Promise<ReturnWithErr<T>>;

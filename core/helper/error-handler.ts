import { Alert } from 'react-native';

type HttpExceptionProps = { error: string; statusCode: number; message?: string };

export class HttpException {
  statusCode: number;
  error: string;
  message?: string | string[];

  constructor({ statusCode, error, message }: HttpExceptionProps) {
    this.statusCode = statusCode;
    this.error = error;
    this.message = message;
  }
}

export function isHttpException(err: unknown): err is HttpExceptionProps {
  const isErrorObj = err && typeof err === 'object';
  const isHttpError = isErrorObj && 'statusCode' in err && 'error' in err;

  if (isErrorObj && isHttpError && typeof err.statusCode === 'number' && err.statusCode >= 300) {
    return true;
  }
  return false;
}

export function errorHandler(err: unknown): [null, HttpException] {
  if (err instanceof HttpException) return [null, err];
  return [
    null,
    new HttpException({ error: 'Ошибка', message: 'Причина неизвестна', statusCode: 0 }),
  ];
}

export function alertError(err: HttpException) {
  const message = Array.isArray(err.message) ? err.message.join(';\n\n') : err.message;
  Alert.alert(`${err.error} (${err.statusCode})`, message);
}

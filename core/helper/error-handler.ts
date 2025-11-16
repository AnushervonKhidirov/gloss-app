type HttpExceptionProps = { statusCode: number; message: string };

export class HttpException {
  statusCode: number;
  error: string;

  constructor({ statusCode, message }: HttpExceptionProps) {
    this.statusCode = statusCode;
    this.error = message;
  }
}

export function isHttpException(err: unknown): err is HttpExceptionProps {
  const isErrorObj = err && typeof err === 'object';
  const isHttpError = isErrorObj && 'statusCode' in err && 'message' in err;

  if (isErrorObj && isHttpError && typeof err.statusCode === 'number' && err.statusCode >= 300) {
    return true;
  }
  return false;
}

export function errorHandler(err: unknown): [null, HttpException] {
  if (err instanceof HttpException) return [null, err];
  return [
    null,
    new HttpException({ statusCode: 500, message: 'Something went wrong, please try again later' }),
  ];
}

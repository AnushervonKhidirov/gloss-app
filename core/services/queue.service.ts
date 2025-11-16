import type { ReturnWithErrPromise } from '@type/common.type';
import type { CreateQueue, Queue } from '@type/queue.type';

import { errorHandler, HttpException, isHttpException } from '@helper/error-handler';

export class QueueService {
  private readonly endpoint = '/queue';

  async create(queue: CreateQueue): ReturnWithErrPromise<Queue> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        body: JSON.stringify(queue),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const service = (await response.json()) as Queue;

      if (isHttpException(service)) throw new HttpException(service);
      return [service, null];
    } catch (err) {
      return errorHandler(err);
    }
  }
}

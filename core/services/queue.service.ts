import type { ReturnWithErrPromise } from '@type/common.type';
import type { CreateQueue, Queue } from '@type/queue.type';

import apiClient from '@api/apiClient';
import { errorHandler, HttpException, isHttpException } from '@helper/error-handler';
import dayjs from 'dayjs';

class QueueService {
  private readonly endpoint = '/queue';

  async findOne(id: number): ReturnWithErrPromise<Queue> {
    try {
      const response = await apiClient.get<Queue>(`${this.endpoint}/${id}`);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [this.convertData(response.data), null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async create(queue: CreateQueue): ReturnWithErrPromise<Queue> {
    try {
      const response = await apiClient.post<Queue>(this.endpoint, queue);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [this.convertData(response.data), null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  private convertData(queue: Queue) {
    queue.startAt = dayjs(queue.startAt);
    queue.endAt = dayjs(queue.endAt);
    return queue;
  }
}

export default new QueueService();

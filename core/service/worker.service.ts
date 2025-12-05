import type { ReturnWithErrPromise } from '@type/common.type';
import type { FindQueryWorkerAppointment, Worker } from '@type/worker.type';

import apiClient from '@api/apiClient';
import { errorHandler, HttpException, isHttpException } from '@helper/error-handler';
import { urlQueryBuilder } from '@helper/url-query-builder';

class WorkerService {
  private readonly endpoint = '/worker';

  async findOne(workerId: number): ReturnWithErrPromise<Worker> {
    try {
      const response = await apiClient.get<Worker>(`${this.endpoint}/${workerId}`);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async findMany(query?: FindQueryWorkerAppointment): ReturnWithErrPromise<Worker[]> {
    try {
      const queryString = urlQueryBuilder(query);
      const response = await apiClient.get<Worker[]>(this.endpoint + queryString);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }
}

export default new WorkerService();

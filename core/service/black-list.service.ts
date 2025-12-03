import type { BlackList } from '@type/client.type';
import type { ReturnWithErrPromise } from '@type/common.type';

import apiClient from '@api/apiClient';
import { errorHandler, HttpException, isHttpException } from '@helper/error-handler';

class BlackListService {
  private readonly endpoint = '/black-list';

  async findAll(): ReturnWithErrPromise<BlackList[]> {
    try {
      const response = await apiClient.get(this.endpoint);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async add({ phone }: { phone: string }): ReturnWithErrPromise<BlackList> {
    try {
      const response = await apiClient.post(this.endpoint, { phone });

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async remove({ phone }: { phone: string }): ReturnWithErrPromise<BlackList> {
    try {
      const response = await apiClient.delete(`${this.endpoint}/${phone}`);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }
}

export default new BlackListService();

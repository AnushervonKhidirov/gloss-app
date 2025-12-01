import type { ReturnWithErrPromise } from '@type/common.type';
import type { CreateSpecialty, Specialty, UpdateSpecialty } from '@type/specialty.type';

import apiClient from '@api/apiClient';
import { errorHandler, HttpException, isHttpException } from '@helper/error-handler';

class SpecialtyService {
  private readonly endpoint = '/specialty';

  async findOne(id: number): ReturnWithErrPromise<Specialty> {
    try {
      const response = await apiClient.get<Specialty>(`${this.endpoint}/${id}`);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async findMany(): ReturnWithErrPromise<Specialty[]> {
    try {
      const response = await apiClient.get<Specialty[]>(this.endpoint);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async create(data: CreateSpecialty): ReturnWithErrPromise<Specialty> {
    try {
      const response = await apiClient.post<Specialty>(this.endpoint, data);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async update(id: number, data: UpdateSpecialty): ReturnWithErrPromise<Specialty> {
    try {
      const response = await apiClient.patch<Specialty>(`${this.endpoint}/${id}`, data);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async delete(id: number): ReturnWithErrPromise<Specialty> {
    try {
      const response = await apiClient.delete<Specialty>(`${this.endpoint}/${id}`);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }
}

export default new SpecialtyService();

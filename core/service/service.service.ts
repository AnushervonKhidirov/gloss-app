import type { ReturnWithErrPromise } from '@type/common.type';
import type {
  CreateService,
  CreateUpdateWorkerService,
  QueryService,
  SelectedService,
  Service,
  ServicesByCategory,
  UpdateService,
} from '@type/service.type';

import apiClient from '@api/apiClient';
import { errorHandler, HttpException, isHttpException } from '@helper/error-handler';
import { urlQueryBuilder } from '@helper/url-query-builder';

class ServiceService {
  private readonly endpoint = '/service';

  async findOne(id: number): ReturnWithErrPromise<Service> {
    try {
      const response = await apiClient.get<Service>(`${this.endpoint}/${id}`);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async findMany(): ReturnWithErrPromise<Service[]> {
    try {
      const response = await apiClient.get<Service[]>(this.endpoint);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async create(data: CreateService): ReturnWithErrPromise<Service> {
    try {
      const response = await apiClient.post<Service>(this.endpoint, data);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async update(id: number, data: UpdateService): ReturnWithErrPromise<Service> {
    try {
      const response = await apiClient.patch<Service>(`${this.endpoint}/${id}`, data);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async delete(id: number): ReturnWithErrPromise<Service> {
    try {
      const response = await apiClient.delete<Service>(`${this.endpoint}/${id}`);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async findManySelected(query: QueryService = {}): ReturnWithErrPromise<SelectedService[]> {
    try {
      const queryString = urlQueryBuilder(query);
      const response = await apiClient.get<SelectedService[]>(
        `${this.endpoint}/worker?${queryString}`,
      );

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async selectedHandler(
    data: CreateUpdateWorkerService[],
  ): ReturnWithErrPromise<SelectedService[]> {
    try {
      const response = await apiClient.post<SelectedService[]>(`${this.endpoint}/worker`, data);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  separateByCategory(services: Service[]): ServicesByCategory {
    const categories: ServicesByCategory = {};

    for (const service of services) {
      const category = service.category.value;

      if (!(category in categories)) categories[category] = [];
      categories[category].push(service);
    }

    return categories;
  }
}

export default new ServiceService();

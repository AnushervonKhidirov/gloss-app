import type { ReturnWithErrPromise } from '@type/common.type';
import type { Service, ServicesByCategory } from '@type/service.type';

import { errorHandler, HttpException, isHttpException } from '@helper/error-handler';

export class ServiceService {
  private readonly endpoint = '/service';

  async findOne(serviceId: number): ReturnWithErrPromise<Service> {
    try {
      const response = await fetch(`${this.endpoint}/${serviceId}`);
      const service = (await response.json()) as Service;

      if (isHttpException(service)) throw new HttpException(service);
      return [service, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async findMany(): ReturnWithErrPromise<Service[]> {
    try {
      const response = await fetch(this.endpoint);
      const services = (await response.json()) as Service[];

      if (isHttpException(services)) throw new HttpException(services);
      return [services, null];
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

import type { Client, CreateClient, UpdateClient } from '@type/client.type';
import type { ReturnWithErrPromise } from '@type/common.type';

import { errorHandler, HttpException, isHttpException } from '@helper/error-handler';

export class ClientService {
  private readonly endpoint = '/client';

  async findOrCreate(clientData: CreateClient): ReturnWithErrPromise<Client> {
    try {
      const [foundClient, foundErr] = await this.findOne(clientData.phone);

      if (foundErr) {
        if (foundErr.statusCode !== 404) throw foundErr;

        const [createdClient, createErr] = await this.create(clientData);
        if (createErr) throw createErr;

        return [createdClient, null];
      }

      return [foundClient, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async findOne(phone: string): ReturnWithErrPromise<Client> {
    try {
      const response = await fetch(`${this.endpoint}?phone=${phone}`);

      const client = (await response.json()) as Client[];

      if (isHttpException(client)) throw new HttpException(client);
      if (!client[0]) throw new HttpException({ statusCode: 404, message: 'Client not found' });
      return [client[0], null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async create(createClient: CreateClient): ReturnWithErrPromise<Client> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        body: JSON.stringify(createClient),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const client = (await response.json()) as Client;

      if (isHttpException(client)) throw new HttpException(client);
      return [client, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async update(updateClient: UpdateClient): ReturnWithErrPromise<Client> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'PATCH',
        body: JSON.stringify(updateClient),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const client = (await response.json()) as Client;

      if (isHttpException(client)) throw new HttpException(client);
      return [client, null];
    } catch (err) {
      return errorHandler(err);
    }
  }
}

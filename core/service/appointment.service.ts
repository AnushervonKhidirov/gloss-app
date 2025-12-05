import type {
  Appointment,
  CreateAppointment,
  CreatedAppointment,
  QueryAppointment,
} from '@type/appointment.type';
import type { ReturnWithErrPromise } from '@type/common.type';

import apiClient from '@api/apiClient';
import { errorHandler, HttpException, isHttpException } from '@helper/error-handler';
import { urlQueryBuilder } from '@helper/url-query-builder';
import dayjs, { Dayjs } from 'dayjs';

class AppointmentService {
  private readonly endpoint = '/appointment';

  async findOne(id: number): ReturnWithErrPromise<Appointment> {
    try {
      const response = await apiClient.get<Appointment>(`${this.endpoint}/${id}`);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [this.convertData(response.data), null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async findMany(query: QueryAppointment = {}): ReturnWithErrPromise<Appointment[]> {
    try {
      const queryString = urlQueryBuilder(query);
      const response = await apiClient.get<Appointment[]>(this.endpoint + queryString);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      const appointmentList = response.data.map(appointment => this.convertData(appointment));
      return [appointmentList, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async create(appointment: CreateAppointment): ReturnWithErrPromise<CreatedAppointment> {
    try {
      const response = await apiClient.post<CreatedAppointment>(
        this.endpoint + '/with_client',
        appointment,
      );

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [this.convertData(response.data), null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async delete(id: number): ReturnWithErrPromise<Appointment> {
    try {
      const response = await apiClient.delete<Appointment>(`${this.endpoint}/${id}`);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [this.convertData(response.data), null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  private convertData<T extends { startAt: Dayjs; endAt: Dayjs }>(appointment: T) {
    appointment.startAt = dayjs(appointment.startAt);
    appointment.endAt = dayjs(appointment.endAt);
    return appointment;
  }
}

export default new AppointmentService();

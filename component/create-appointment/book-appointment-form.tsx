import type { CreateClient } from '@type/client.type';

import useCreateAppointmentStore from '@store/create-appointment.store';
import { useState } from 'react';

import { Button, Form, Input } from '@ant-design/react-native';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';

import { formStyles } from '@constant/styles';
import { alertError } from '@helper/error-handler';
import { getDateString } from '@helper/time-converter.helper';
import appointmentService from '@service/appointment.service';
import { isValidPhoneNumber } from 'libphonenumber-js';

const BookAppointmentForm = () => {
  const { selectedService, selectedWorker, selectedTime, reset } = useCreateAppointmentStore(
    state => state,
  );

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  async function onFinish(value: CreateClient) {
    if (!selectedService || !selectedWorker || !selectedTime) return;

    setLoading(true);

    const [appointment, err] = await appointmentService.create({
      serviceId: selectedService.id,
      userId: selectedWorker.id,
      startAt: selectedTime,
      name: value.name,
      phone: value.phone,
    });

    console.log(appointment);

    if (err) {
      alertError(err);
    } else {
      Alert.alert(
        'Запись добавлена',
        `${value.name} записан на ${getDateString(appointment.startAt)}`,
      );
    }

    setLoading(false);
    reset();
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Form form={form} onFinish={onFinish} styles={formStyles(true)}>
        <Form.Item name="name" rules={[{ required: true, message: 'Введите имя клиента' }]}>
          <Input placeholder="Имя клиента"></Input>
        </Form.Item>

        <Form.Item
          name="phone"
          rules={[
            {
              required: true,
              message: 'Введите номер клиента',
            },
            {
              validator(_, value) {
                if (
                  typeof value === 'string' &&
                  value.trim() !== '' &&
                  !isValidPhoneNumber(value, 'TJ')
                ) {
                  return Promise.reject(new Error('Неправильный формат номера'));
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="Номер клиента"></Input>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onPress={form.submit} loading={loading}>
            Сохранить
          </Button>
        </Form.Item>
      </Form>
    </KeyboardAvoidingView>
  );
};

export default BookAppointmentForm;

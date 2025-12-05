import type { Client, UpdateClient } from '@type/client.type';
import type { FC } from 'react';

import { Form, Input } from '@ant-design/react-native';
import { Button } from '@component/common';
import clientService from '@service/client.service';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { alertError } from '@helper/error-handler';
import { isValidPhoneNumber } from 'libphonenumber-js';

type EditClientFormProps = {
  clientToEdit: Client | null;
  onSuccess: (client: Client) => void;
};

const EditClientForm: FC<EditClientFormProps> = ({ clientToEdit, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  async function onFinish(value: UpdateClient) {
    if (!clientToEdit) return;

    setLoading(true);

    const [client, err] = await clientService.update(clientToEdit.id, value);

    if (err) {
      alertError(err);
    } else {
      onSuccess(client);
    }

    setLoading(false);
  }

  return (
    clientToEdit && (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.form_wrapper}>
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              initialValue={clientToEdit.name}
              name="name"
              rules={[{ required: true, message: 'Введите имя клиента' }]}
            >
              <Input placeholder="Имя клиента"></Input>
            </Form.Item>

            <Form.Item
              initialValue={clientToEdit.phone}
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
              <Button title="Сохранить" onPress={form.submit} loading={loading} />
            </Form.Item>
          </Form>
        </View>
      </KeyboardAvoidingView>
    )
  );
};

const styles = StyleSheet.create({
  form_wrapper: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default EditClientForm;

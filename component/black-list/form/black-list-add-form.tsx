import type { BlackList } from '@type/client.type';
import type { FC } from 'react';

import { Form, Input } from '@ant-design/react-native';
import ButtonPrimary from '@commonComponent/button-primary';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { alertError } from '@helper/error-handler';
import blackListService from '@service/black-list.service';
import clientService from '@service/client.service';
import { isValidPhoneNumber, parsePhoneNumberFromString } from 'libphonenumber-js';

const BlackListAddForm: FC<{ onSuccess: (blackList: BlackList) => void }> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  async function addConfirm({ phone }: { phone: string }) {
    setLoading(true);
    const [client] = await clientService.findMany({ phone });
    let message = `Добавить номер ${parsePhoneNumberFromString(
      phone,
      'TJ',
    )?.formatNational()} в черный список?`;

    if (client?.[0]) {
      message = `Добапить клиента ${client[0].name} в черный список?\nКлиент будет удален!`;
    }

    Alert.alert('Черный список', message, [
      {
        text: 'Да',
        onPress: () => onFinish({ phone }),
      },
      {
        text: 'Нет',
        onPress: () => setLoading(false),
      },
    ]);
  }

  async function onFinish({ phone }: { phone: string }) {
    setLoading(true);

    const [blackListItem, err] = await blackListService.add({ phone });

    if (err) {
      alertError(err);
    } else {
      onSuccess(blackListItem);
    }

    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.form_wrapper}>
        <Form form={form} onFinish={addConfirm}>
          <Form.Item
            name="phone"
            rules={[
              {
                required: true,
                message: 'Введите номер телефона',
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
            <Input placeholder="Номер телефона"></Input>
          </Form.Item>

          <Form.Item>
            <ButtonPrimary onPress={form.submit} loading={loading}>
              Добавить в черный список
            </ButtonPrimary>
          </Form.Item>
        </Form>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  form_wrapper: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default BlackListAddForm;

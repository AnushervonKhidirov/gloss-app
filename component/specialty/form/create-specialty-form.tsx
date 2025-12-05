import type { CreateSpecialty, Specialty } from '@type/specialty.type';
import type { FC } from 'react';

import { Form, Input } from '@ant-design/react-native';
import Button from '@commonComponent/button';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { alertError } from '@helper/error-handler';
import specialtyService from '@service/specialty.service';

const CreateSpecialtyForm: FC<{ onSuccess: (specialty: Specialty) => void }> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  async function onFinish(value: CreateSpecialty) {
    setLoading(true);

    if (!value.desc) delete value.desc;

    const [specialty, err] = await specialtyService.create(value);

    if (err) {
      alertError(err);
    } else {
      onSuccess(specialty);
    }

    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.form_wrapper}>
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Введите название специальности' }]}
          >
            <Input placeholder="Название специальности" />
          </Form.Item>

          <Form.Item name="desc">
            <Input.TextArea
              autoSize={{ minRows: 3, maxRows: 5 }}
              placeholder="Описание специальности"
            />
          </Form.Item>

          <Form.Item>
            <Button title="Создать" onPress={form.submit} loading={loading} />
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

export default CreateSpecialtyForm;

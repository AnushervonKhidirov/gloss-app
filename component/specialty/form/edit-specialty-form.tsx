import type { Specialty, UpdateSpecialty } from '@type/specialty.type';
import type { FC } from 'react';

import { Form, Input } from '@ant-design/react-native';
import { Button } from '@component/common';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { alertError } from '@helper/error-handler';
import specialtyService from '@service/specialty.service';

type EditSpecialtyFormProps = {
  specialtyToEdit: Specialty | null;
  onSuccess: (specialty: Specialty) => void;
};

const EditSpecialtyForm: FC<EditSpecialtyFormProps> = ({ specialtyToEdit, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  async function onFinish(value: UpdateSpecialty) {
    if (!specialtyToEdit) return;
    if (!value.desc) delete value.desc;

    setLoading(true);

    const [specialty, err] = await specialtyService.update(specialtyToEdit.id, value);

    if (err) {
      alertError(err);
    } else {
      onSuccess(specialty);
    }

    setLoading(false);
  }

  return (
    specialtyToEdit && (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.form_wrapper}>
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              initialValue={specialtyToEdit.name}
              name="name"
              rules={[{ required: true, message: 'ведите название специальности' }]}
            >
              <Input placeholder="Название специальности" />
            </Form.Item>

            <Form.Item name="desc" initialValue={specialtyToEdit.desc}>
              <Input.TextArea
                autoSize={{ minRows: 3, maxRows: 5 }}
                placeholder="Описание специальности"
              />
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

export default EditSpecialtyForm;

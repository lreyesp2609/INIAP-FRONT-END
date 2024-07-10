import React, { useState } from 'react';
import { Modal, Input, Form, notification } from 'antd';

const ChangePasswordModal = ({ visible, onChangePassword, onCancel }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        onChangePassword(values.nueva_contrasenia);
      })
      .catch((info) => {
        console.log('Validación fallida:', info);
      });
  };

  return (
    <Modal
      visible={visible}
      title="Cambiar Contraseña"
      okText="Cambiar"
      cancelText="Cancelar"
      onOk={handleOk}
      onCancel={onCancel}
      forceRender
      maskClosable={false}
      keyboard={false}
    >
      <Form form={form} layout="vertical" name="change_password_form">
        <Form.Item
          name="nueva_contrasenia"
          label="Nueva Contraseña"
          rules={[{ required: true, message: 'Por favor, ingresa la nueva contraseña' }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;

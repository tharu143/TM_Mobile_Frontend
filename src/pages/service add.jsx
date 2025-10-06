import React, { useState, useEffect } from 'react';
import { Button, Form, Input, InputNumber, DatePicker, Select, message, Row, Col } from 'antd';
import dayjs from 'dayjs';
import apiClient from '../config/api';
import { useNavigate, useLocation } from 'react-router-dom';

const { Option } = Select;
const { TextArea } = Input;

const ServiceAdd = ({ theme }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [isEdit, setIsEdit] = useState(false);
  const [serviceId, setServiceId] = useState(null);

  useEffect(() => {
    if (location.state?.service) {
      const service = location.state.service;
      const formattedService = {
        ...service,
        device: {
          ...service.device,
          receivedDate: service.device.receivedDate ? dayjs(service.device.receivedDate) : null,
        },
      };
      form.setFieldsValue(formattedService);
      setIsEdit(true);
      setServiceId(service._id);
    }
  }, [location.state, form]);

  const handleFinish = async (values) => {
    try {
      const productRate = values.problem?.productRate || 0;
      const serviceCharge = values.problem?.serviceCharge || 0;
      const total = productRate + serviceCharge;
      const formattedValues = {
        ...values,
        total,
        status: 'pending',
        device: {
          ...values.device,
          receivedDate: values.device.receivedDate ? dayjs(values.device.receivedDate).format('YYYY-MM-DD') : null,
        },
      };

      if (isEdit) {
        await apiClient.put(`/api/services/${serviceId}`, formattedValues);
        message.success('Service updated successfully');
      } else {
        await apiClient.post('/api/services', formattedValues);
        message.success('Service added successfully');
      }
      navigate('/service');
    } catch (error) {
      console.error('Error saving service:', error);
      message.error('Failed to save service');
    }
  };

  return (
    <div className={`service-add-page ${theme}`}>
      <h1>{isEdit ? 'Edit Service' : 'Add Service'}</h1>
      <Form form={form} onFinish={handleFinish} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <h2>Customer Details</h2>
            <Form.Item name={['customer', 'name']} label="Customer Name" rules={[{ required: true, message: 'Please enter customer name' }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['customer', 'phone']} label="Mobile Number" rules={[{ required: true, message: 'Please enter mobile number' }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['customer', 'address']} label="Address">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <h2>Device Details</h2>
            <Form.Item name={['device', 'brand']} label="Brand" rules={[{ required: true, message: 'Please enter brand' }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['device', 'model']} label="Model" rules={[{ required: true, message: 'Please enter model' }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['device', 'imei']} label="IMEI Number">
              <Input />
            </Form.Item>
            <Form.Item name={['device', 'color']} label="Color">
              <Input />
            </Form.Item>
            <Form.Item name={['device', 'ram']} label="RAM">
              <Input />
            </Form.Item>
            <Form.Item name={['device', 'rom']} label="ROM">
              <Input />
            </Form.Item>
            <Form.Item name={['device', 'password']} label="Password/Pattern">
              <Input />
            </Form.Item>
            <Form.Item name={['device', 'receivedBy']} label="Received By">
              <Input />
            </Form.Item>
            <Form.Item
              name={['device', 'receivedDate']}
              label="Received Date"
              rules={[
                { required: true, message: 'Please select received date' },
                {
                  validator: (_, value) =>
                    value && dayjs.isDayjs(value) && value.isValid()
                      ? Promise.resolve()
                      : Promise.reject('Invalid date'),
                },
              ]}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
        </Row>
        <h2>Problem Details</h2>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name={['problem', 'complaintType']} label="Complaint Type" rules={[{ required: true, message: 'Please select complaint type' }]}>
              <Select>
                <Option value="hardware">Hardware</Option>
                <Option value="software">Software</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
            <Form.Item name={['problem', 'description']} label="Problem Description" rules={[{ required: true, message: 'Please enter problem description' }]}>
              <TextArea />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={['problem', 'productRate']} label="Product Rate">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name={['problem', 'serviceCharge']} label="Service Charge">
              <InputNumber min={0} />
            </Form.Item>
          </Col>
        </Row>
        <Button type="primary" htmlType="submit">{isEdit ? 'Update' : 'Save'}</Button>
        <Button onClick={() => navigate('/service')} style={{ marginLeft: 8 }}>Back</Button>
      </Form>
    </div>
  );
};

export default ServiceAdd;
import React, { useState, useEffect } from 'react';
import { Button, Form, Input, InputNumber, DatePicker, Select, message, Row, Col, Typography } from 'antd';
import dayjs from 'dayjs';
import apiClient from '../config/api';
import { useParams, useNavigate } from 'react-router-dom';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const ServiceDetails = ({ theme }) => {
  const [form] = Form.useForm();
  const [service, setService] = useState(null);
  const [total, setTotal] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const response = await apiClient.get(`/api/services`);
      const foundService = response.data.find(s => s._id === id);
      if (foundService) {
        const formattedService = {
          ...foundService,
          device: {
            ...foundService.device,
            receivedDate: foundService.device.receivedDate ? dayjs(foundService.device.receivedDate) : null,
          },
        };
        setService(formattedService);
        form.setFieldsValue(formattedService);
        const calcTotal = (foundService.problem?.productRate || 0) + (foundService.problem?.serviceCharge || 0);
        setTotal(formattedService.manualTotal || calcTotal);
      } else {
        message.error('Service not found');
        navigate('/service');
      }
    } catch (error) {
      console.error('Error fetching service:', error);
      message.error('Failed to fetch service');
    }
  };

  const handleFinish = async (values) => {
    try {
      const productRate = values.problem?.productRate || 0;
      const serviceCharge = values.problem?.serviceCharge || 0;
      const calculatedTotal = productRate + serviceCharge;
      const manualTotal = values.manualTotal || calculatedTotal;
      const paymentStatus = values.paymentStatus;

      let newStatus = service.status;
      if (paymentStatus) {
        newStatus = `completed-${paymentStatus}`;
      }

      const formattedValues = {
        ...values,
        total: calculatedTotal,
        manualTotal,
        status: newStatus,
        device: {
          ...values.device,
          receivedDate: values.device.receivedDate ? dayjs(values.device.receivedDate).format('YYYY-MM-DD') : null,
        },
      };

      await apiClient.put(`/api/services/${id}`, formattedValues);
      message.success('Service updated successfully');
      navigate('/service');
    } catch (error) {
      console.error('Error saving service:', error);
      message.error('Failed to save service');
    }
  };

  return (
    <div className={`service-details-page ${theme}`}>
      <h1>Service Details</h1>
      {service && (
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Title level={4}>Customer Details</Title>
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
              <Title level={4}>Device Details</Title>
              <Form.Item name={['device', 'brand']} label="Brand" rules={[{ required: true, message: 'Please enter brand' }]}>
                <Input />
              </Form.Item>
              <Form.Item name={['device', 'model']} label="Model" rules={[{ required: true, message: 'Please enter model' }]}>
                <Input />
              </Form.Item>
              <Form.Item name={['device', 'imei']} label="IMEI Number">
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
          <Row gutter={16}>
            <Col span={12}>
              <Title level={4}>Problem Details</Title>
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
              <Text strong>Amount: {total}</Text>
              <Form.Item name="manualTotal" label="Manual Amount">
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item name="paymentStatus" label="Payment Status">
                <Select placeholder="Select payment status">
                  <Option value="paid">Paid</Option>
                  <Option value="unpaid">Unpaid</Option>
                </Select>
              </Form.Item>
              <Text>Current Status: {service.status}</Text>
            </Col>
          </Row>
          <Button type="primary" htmlType="submit">Save</Button>
          <Button onClick={() => navigate('/service')} style={{ marginLeft: 8 }}>Back</Button>
        </Form>
      )}
    </div>
  );
};

export default ServiceDetails;
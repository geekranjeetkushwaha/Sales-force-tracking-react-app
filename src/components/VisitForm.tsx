import React from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Input, Radio, Button, message } from 'antd';


const VisitForm: React.FC = () => {
  const location = useLocation();
  const visitDetails = location.state?.visitDetails;
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    message.success('Visit details submitted successfully!');
    console.log('Form values:', values);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">Visit Details</h2>
        {visitDetails && (
          <div className="mb-6 text-center">
            <p className="text-gray-700 text-lg"><strong>Counter:</strong> {visitDetails.name}</p>
            <p className="text-gray-500 mt-2"><strong>Code:</strong> {visitDetails.code}</p>
          </div>
        )}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="Purpose of Visit"
            name="purpose"
            rules={[{ required: true, message: 'Please select the purpose of visit!' }]}
          >
            <Radio.Group>
              <Radio value="Site Service">Site Service</Radio>
              <Radio value="New Site">New Site</Radio>
              <Radio value="Site Conversion">Site Conversion</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Remarks"
            name="remarks"
            rules={[{ required: true, message: 'Please enter remarks!' }]}
          >
            <Input.TextArea rows={4} placeholder="Enter remarks" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full bg-orange-500 hover:bg-orange-600">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default VisitForm;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, App } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../auth/useAuth';
import type { LoginCredentials } from '../../auth/types';
import './Login.css';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await login(values);
      console.log(response, 'response--');
      if (response.requiresOTP) {
        // Redirect to OTP page with credentials
        message.success(response.message || 'OTP sent to your email!');
        navigate('/otp', {
          state: {
            email: values.email,
            password: values.password,
          },
          replace: true,
        });
      } else {
        // Direct login success
        message.success('Login successful!');
        navigate('/', { replace: true });
      }
    } catch (error: unknown) {
      // Handle API errors with proper error message
      let errorMessage = 'Login failed. Please try again.';

      if (error && typeof error === 'object') {
        if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        }
      }

      message.error({
        content: errorMessage,
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <Card className="login-card" bordered={false}>
          <div className="login-header">
            <div className="logo-container">
              <div className="logo-icon">🏢</div>
            </div>
            <Title level={2} className="login-title">
              Sales Force Tracking
            </Title>
            <Text className="login-subtitle">Sign in to access your dashboard</Text>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            className="login-form"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your email"
                className="login-input"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                className="login-input"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="login-button"
                block
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Form.Item>
          </Form>

          <div className="login-demo-info">
            <Text type="secondary" className="demo-text">
              Demo Credentials:
            </Text>
            <div className="demo-credentials">
              <Text code>✅ Success: admin@dalmia.com / password</Text>
              <Text code>✅ Success: user@dalmia.com / password</Text>
              <Text code>❌ DM1004: blocked@dalmia.com / password</Text>
              <Text code>❌ DM1006: inactive@dalmia.com / password</Text>
            </div>
            <div style={{ marginTop: '8px', fontSize: '12px' }}>
              <Text type="secondary">
                Test error responses with blocked/inactive accounts to see resp_msg toasts
              </Text>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;

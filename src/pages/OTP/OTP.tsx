import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Space, App } from 'antd';
import { SafetyOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useAuth } from '../../auth/useAuth';
import './OTP.css';

const { Title, Text } = Typography;

interface LocationState {
  email: string;
  password: string;
}

interface OTPFormData {
  otp: string;
}

const OTP: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const { message } = App.useApp();
  const { verifyOTP, resendOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState;

  useEffect(() => {
    // Redirect to login if no credentials in state
    if (!state?.email || !state?.password) {
      navigate('/login', { replace: true });
      return;
    }

    // Start countdown for resend button
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, state]);

  const onFinish = async (values: OTPFormData) => {
    if (!state?.email || !state?.password) {
      message.error('Session expired. Please login again.');
      navigate('/login', { replace: true });
      return;
    }

    setLoading(true);
    try {
      await verifyOTP({
        email: state.email,
        password: state.password,
        otp: values.otp,
      });
      message.success('OTP verified successfully!');
      navigate('/', { replace: true });
    } catch (error: unknown) {
      // Handle API errors with proper error message
      let errorMessage = 'OTP verification failed. Please try again.';

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

  const handleResendOTP = async () => {
    if (!state?.email) {
      message.error('Session expired. Please login again.');
      navigate('/login', { replace: true });
      return;
    }

    try {
      await resendOTP(state.email);
      message.success('OTP resent successfully!');
      setCountdown(30);
      setCanResend(false);

      // Restart countdown
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: unknown) {
      // Handle API errors with proper error message
      let errorMessage = 'Failed to resend OTP. Please try again.';

      if (error && typeof error === 'object') {
        if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        }
      }

      message.error({
        content: errorMessage,
        duration: 5,
      });
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const maskedEmail = state?.email ? state.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : '';

  return (
    <div className="otp-container">
      <div className="otp-wrapper">
        <Card className="otp-card" bordered={false}>
          <div className="otp-header">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleBackToLogin}
              className="back-button"
            >
              Back to Login
            </Button>

            <div className="logo-container">
              <div className="logo-icon">
                <SafetyOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
              </div>
            </div>

            <Title level={2} className="otp-title">
              Verify OTP
            </Title>

            <Text className="otp-subtitle">We've sent a 6-digit verification code to</Text>
            <Text strong className="otp-email">
              {maskedEmail}
            </Text>
          </div>

          <Form
            form={form}
            name="otp"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            className="otp-form"
          >
            <Form.Item
              name="otp"
              label="Enter OTP"
              rules={[
                { required: true, message: 'Please enter the OTP!' },
                { len: 6, message: 'OTP must be 6 digits!' },
                { pattern: /^\d{6}$/, message: 'OTP must contain only numbers!' },
              ]}
            >
              <Input
                placeholder="Enter 6-digit OTP"
                className="otp-input"
                maxLength={6}
                style={{
                  fontSize: '18px',
                  letterSpacing: '4px',
                  textAlign: 'center' as const,
                }}
                onChange={e => {
                  // Only allow numbers
                  const value = e.target.value.replace(/\D/g, '');
                  form.setFieldValue('otp', value);
                }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="otp-button"
                block
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </Form.Item>
          </Form>

          <div className="otp-actions">
            <Space direction="vertical" className="resend-section">
              <Text type="secondary">Didn't receive the code?</Text>

              {canResend ? (
                <Button type="link" onClick={handleResendOTP} className="resend-button">
                  Resend OTP
                </Button>
              ) : (
                <Text type="secondary">Resend available in {countdown}s</Text>
              )}
            </Space>
          </div>

          <div className="otp-demo-info">
            <Text type="secondary" className="demo-text">
              Demo OTP: Use <Text code>123456</Text> for testing
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OTP;

import React from 'react';
import { Modal, Button, Descriptions, Tag, Space, Divider } from 'antd';
import { 
  CloseOutlined, 
  EnvironmentOutlined, 
  PhoneOutlined, 
  UserOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined 
} from '@ant-design/icons';
import './PJPDetails.css';

interface PJPDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  onStartVisit?: (item: any) => void;
  data: any;
  title?: string;
}

const PJPDetails: React.FC<PJPDetailsProps> = ({ 
  isOpen, 
  onClose, 
  onStartVisit, 
  data, 
  title = "Details" 
}) => {
  
  if (!data) return null;

  const handleStartVisit = () => {
    if (onStartVisit) {
      onStartVisit(data);
    }
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'visited':
        return 'success';
      case 'pending':
      case 'not visited':
        return 'warning';
      case 'cancelled':
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'visited':
        return <CheckCircleOutlined />;
      case 'pending':
      case 'not visited':
        return <ClockCircleOutlined />;
      default:
        return null;
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-800">{title}</span>
          <Button 
            type="text" 
            icon={<CloseOutlined />} 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          />
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      closeIcon={null}
      className="pjp-details-modal"
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {data.name || data.counterName || 'N/A'}
              </h3>
              <p className="text-gray-600 text-sm font-medium">
                Code: {data.code || data.counterCode || 'N/A'}
              </p>
              {data.status && (
                <div className="mt-2">
                  <Tag 
                    color={getStatusColor(data.status)} 
                    icon={getStatusIcon(data.status)}
                    className="font-medium"
                  >
                    {data.status}
                  </Tag>
                </div>
              )}
            </div>
            {data.visitCount !== undefined && (
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {data.visitCount}
                </div>
                <div className="text-xs text-gray-500">
                  Visits Today
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Details Section */}
        <Descriptions 
          column={1} 
          size="small"
          labelStyle={{ fontWeight: 'bold', color: '#374151' }}
          contentStyle={{ color: '#6B7280' }}
        >
          {data.address && (
            <Descriptions.Item 
              label={
                <Space>
                  <EnvironmentOutlined className="text-red-500" />
                  Address
                </Space>
              }
            >
              {data.address}
            </Descriptions.Item>
          )}
          
          {data.contactPerson && (
            <Descriptions.Item 
              label={
                <Space>
                  <UserOutlined className="text-blue-500" />
                  Contact Person
                </Space>
              }
            >
              {data.contactPerson}
            </Descriptions.Item>
          )}
          
          {data.phone && (
            <Descriptions.Item 
              label={
                <Space>
                  <PhoneOutlined className="text-green-500" />
                  Phone
                </Space>
              }
            >
              <a href={`tel:${data.phone}`} className="text-blue-600 hover:text-blue-800">
                {data.phone}
              </a>
            </Descriptions.Item>
          )}
          
          {data.lastVisit && (
            <Descriptions.Item 
              label={
                <Space>
                  <CalendarOutlined className="text-purple-500" />
                  Last Visit
                </Space>
              }
            >
              {data.lastVisit}
            </Descriptions.Item>
          )}
          
          {data.category && (
            <Descriptions.Item label="Category">
              <Tag color="blue">{data.category}</Tag>
            </Descriptions.Item>
          )}
          
          {data.territory && (
            <Descriptions.Item label="Territory">
              {data.territory}
            </Descriptions.Item>
          )}
          
          {data.region && (
            <Descriptions.Item label="Region">
              {data.region}
            </Descriptions.Item>
          )}
        </Descriptions>

        {/* Additional Info */}
        {(data.notes || data.remarks) && (
          <>
            <Divider className="my-4" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Notes</h4>
              <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded border">
                {data.notes || data.remarks}
              </p>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button 
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
          {onStartVisit && (
            <Button 
              type="primary" 
              onClick={handleStartVisit}
              className="flex-1 bg-orange-500 hover:bg-orange-600 border-orange-500"
            >
              Start Visit
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PJPDetails;
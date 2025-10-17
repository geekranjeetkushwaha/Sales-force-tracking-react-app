import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Drawer, Button, Dropdown } from 'antd';
import { MenuOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../auth/useAuth';

const Header: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force navigation even if logout fails
      navigate('/login');
    }
  };

  return (
    <header className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Hamburger for mobile */}
        <Button
          type="text"
          icon={<MenuOutlined style={{ fontSize: 24, color: 'white' }} />}
          onClick={showDrawer}
          className="md:hidden mr-2"
        />
        <h3 className="text-[20px] mb-[0px]">My PJP</h3>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-gray-500 bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
          {new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}{' '}
          |{' '}
          {new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}
        </div>

        {/* User Menu */}
        <Dropdown
          menu={{
            items: [
              // {
              //     key: 'profile',
              //     icon: <UserOutlined />,
              //     label: user?.name || 'User',
              // },
              {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Logout',
                onClick: handleLogout,
              },
            ],
          }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button
            type="text"
            icon={<UserOutlined style={{ fontSize: 20, color: 'white' }} />}
            className="flex items-center text-white hover:bg-white hover:bg-opacity-20 rounded-full w-10 h-10"
          />
        </Dropdown>
      </div>
      {/* Antd Drawer for mobile nav */}
      <Drawer
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <UserOutlined className="text-white text-lg" />
            </div>
            <div>
              <div className="text-gray-800 font-semibold">{user?.name || 'User'}</div>
              <div className="text-gray-500 text-sm">Sales Representative</div>
            </div>
          </div>
        }
        placement="left"
        onClose={onClose}
        open={visible}
        bodyStyle={{ padding: 0 }}
        headerStyle={{
          borderBottom: '1px solid #f0f0f0',
          padding: '20px 24px',
        }}
        width={300}
      >
        <div className="h-full bg-gray-50">
          {/* Navigation Menu */}
          <nav className="p-6">
            <div className="space-y-3">
              <Link
                to="/"
                onClick={onClose}
                className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm hover:shadow-md hover:bg-blue-50 transition-all duration-200 group no-underline"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <span className="text-blue-600 text-lg">🏠</span>
                </div>
                <div>
                  <div className="text-gray-800 font-medium">PJP</div>
                  <div className="text-gray-500 text-sm">Vist, Listing & Overview</div>
                </div>
              </Link>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm opacity-50">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-lg">📋</span>
                </div>
                <div>
                  <div className="text-gray-500 font-medium">Reports</div>
                  <div className="text-gray-400 text-sm">Coming Soon</div>
                </div>
              </div>
            </div>
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="w-full h-12 flex items-center justify-center gap-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl border border-red-200 hover:border-red-300 font-medium transition-all duration-200"
            >
              Logout
            </Button>
          </div>
        </div>
      </Drawer>
    </header>
  );
};

export default Header;

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
      <div className="flex items-center">
        {/* Hamburger for mobile */}
        <Button
          type="text"
          icon={<MenuOutlined style={{ fontSize: 24, color: 'white' }} />}
          onClick={showDrawer}
          className="md:hidden mr-2"
        />
        <h3 className="text-[20px] font-semibold">My PJP</h3>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-gray-500 bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
          {new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </div>

        {/* User Menu */}
        <Dropdown
          menu={{
            items: [
              {
                key: 'profile',
                icon: <UserOutlined />,
                label: user?.name || 'User',
              },
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
        title="Menu"
        placement="left"
        onClose={onClose}
        open={visible}
        bodyStyle={{ padding: 0 }}
      >
        <nav className="flex flex-col p-4 gap-4">
          <Link
            to="/"
            onClick={onClose}
            style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 500 }}
          >
            Home
          </Link>
          {/* <Link to="/visit" onClick={onClose} style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 500 }}>Visit</Link>
                    <Link to="/pjp" onClick={onClose} style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 500 }}>PJP</Link> */}
          <div className="border-t pt-4 mt-4">
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-2 text-red-500 hover:bg-red-50"
            >
              Logout
            </Button>
          </div>
        </nav>
      </Drawer>
    </header>
  );
};

export default Header;

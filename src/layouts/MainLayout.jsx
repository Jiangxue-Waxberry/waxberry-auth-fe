import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import {
    DashboardOutlined,
    UserOutlined,
    SettingOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
    const navigate = useNavigate();

    const menuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: '仪表盘',
        },
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: '个人资料',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '设置',
        },
    ];

    const handleMenuClick = ({ key }) => {
        navigate(`/${key}`);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ padding: 0, background: '#fff' }}>
                <div style={{ padding: '0 24px', fontSize: '18px', fontWeight: 'bold' }}>
                    My App
                </div>
            </Header>
            <Layout>
                <Sider width={200} style={{ background: '#fff' }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['dashboard']}
                        style={{ height: '100%', borderRight: 0 }}
                        items={menuItems}
                        onClick={handleMenuClick}
                    />
                </Sider>
                <Layout style={{ padding: '24px' }}>
                    <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default MainLayout;

import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  AppstoreOutlined,
  BellOutlined,
  BorderOuterOutlined,
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PoweroffOutlined,
  SmileOutlined,
  MoonOutlined,
  SafetyCertificateOutlined,
  SunOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Col,
  ConfigProvider,
  Drawer,
  Dropdown,
  Flex,
  Grid,
  Image,
  Layout,
  Menu,
  Popover,
  Row,
  Space,
  Tooltip,
  theme,
} from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './contentLayout.scss';
import GetMenuSideBar from './GetMenuSideBar';

import vtsLogo from 'assets/images/vts-logo.png';
import logo from 'assets/images/vts-logo.png';
import DarkVtsHrImage from 'assets/images/dark-vts-hr.png';
import LightVtsHrImage from 'assets/images/light-vts-hr.png';

import { NotifyContext } from '../contexts/NotifyContext';
import { AuthContext } from 'contexts/AuthContext';
import { useContent } from '../contexts/ContentContext';
import activeSideBar from './activeSidebar';
import { debounce } from 'lodash';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const ContentLayoutBody = ({ isDarkMode, onToggleTheme }) => {
  const { checkPermission, username } = useContext(AuthContext);
  const { content } = useContent();
  const navigate = useNavigate();
  const location = useLocation();
  const { count, setCount } = useContext(NotifyContext);
  const screens = useBreakpoint();

  // responsive: use Drawer on < lg
  const isMobile = !screens.lg;

  const {
    token: { colorBgContainer, borderRadiusLG, colorText },
  } = theme.useToken();

  // desktop collapsed state
  const [collapsed, setCollapsed] = useState(false);

  // mobile drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [openKeys, setOpenKeys] = useState(localStorage.getItem('open-key-active') || '');
  const onOpenChange = (keys) => {
    if (keys.length) setOpenKeys(keys[keys.length - 1]);
    else setOpenKeys('');
  };

  const [defaultSelectedKey, setDefaultSelectedKey] = useState(location.pathname);

  // keep html attribute (optional, helpful for custom css)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // attendance special case
  useEffect(() => {
    if (location?.pathname === '/attendance/list' || location?.pathname === '/attendance/detail') {
      setDefaultSelectedKey('/attendance');
      localStorage.setItem('open-key-active', 'attendance');
    }
  }, [location.pathname]);

  // active sidebar on route change
  useEffect(() => {
    setDefaultSelectedKey(activeSideBar(location.pathname));
  }, [location.pathname]);

  // admin protection (if path has /admin but no permissions)
  useEffect(() => {
    const isAdminRoute = location.pathname === '/admin' || location.pathname.startsWith('/admin/');

    if (
      isAdminRoute &&
      (!checkPermission('user_list') || !checkPermission('role_list') || !checkPermission('module_list'))
    ) {
      navigate('/');
    }
  }, [checkPermission, location.pathname, navigate]);

  // when switching to desktop, close drawer
  useEffect(() => {
    if (!isMobile) setDrawerOpen(false);
  }, [isMobile]);

  const itemsProfile = useMemo(
    () => [
      { key: 'username', label: username, disabled: true },
      { type: 'divider' },
      { key: 'version', label: 'Version 1.0.0.5(1)', disabled: true },
      { type: 'divider' },
      {
        key: 'administrator',
        label: (
          <Button style={{ color: 'black' }} size="small" type="link" icon={<SafetyCertificateOutlined />}>
            Administrator
          </Button>
        ),
      },
      {
        key: 'logout',
        label: (
          <Button
            style={{ color: 'black' }}
            size="small"
            type="link"
            icon={<PoweroffOutlined style={{ color: 'red' }} />}>
            Logout
          </Button>
        ),
      },
    ],
    [username]
  );

  function getItem(label, key, icon, children, type) {
    return { key, icon, children, label, type };
  }

  // remove these 2 icons from UI (Bell + Appstore)
  const showHeaderShortcuts = false;

  const handleMouseLeave = debounce(() => {}, 200);
  const handleMouseEnter = debounce(() => {}, 200);

  // one handler for menu click (works in both desktop + drawer)
  const handleMenuSelect = ({ key, keyPath }) => {
    navigate(key);
    setDefaultSelectedKey(key);

    if (keyPath.length > 1) localStorage.setItem('open-key-active', keyPath[1]);
    else localStorage.setItem('open-key-active', '');

    // close drawer after selecting
    if (isMobile) setDrawerOpen(false);
  };

  const SidebarLogo = ({ small }) =>
    small ? (
      <div style={{ width: 64 }}>
        <img
          src={isDarkMode ? DarkVtsHrImage : LightVtsHrImage}
          alt="logo"
          width="50"
          height="50"
          style={{ marginLeft: 10, marginTop: 7 }}
        />
      </div>
    ) : (
      <div style={{ width: 200 }} className="flex justify-center item-center mt-3 font-thin">
        <div>
          <Image src={isDarkMode ? DarkVtsHrImage : LightVtsHrImage} alt="logo" height="33.50px" preview={false} />
        </div>
      </div>
    );

  const SidebarMenu = ({ mode = 'inline' }) => (
    <>
      <div className="demo-logo-vertical" />
      <Menu
        openKeys={[openKeys]}
        theme={isDarkMode ? 'dark' : 'light'}
        mode={mode}
        defaultSelectedKeys={[defaultSelectedKey]}
        selectedKeys={[defaultSelectedKey]}
        onOpenChange={onOpenChange}
        items={GetMenuSideBar(collapsed)}
        onSelect={handleMenuSelect}
        style={{ background: isDarkMode ? 'rgb(33, 31, 31)' : '#e5e7eb', color: 'blue' }}
      />

      {/* bottom area (keep same concept) */}
      <div style={{ marginTop: 'auto' }}>
        <Menu
          theme={isDarkMode ? 'dark' : 'light'}
          mode={mode}
          selectable={false}
          style={{
            background: isDarkMode ? 'rgb(220, 216, 216)' : 'rgb(0, 0, 0)',
          }}
          items={[
            {
              key: 'security',
              icon: <SafetyCertificateOutlined />,
              label: 'Administrator',
              style: {
                background: isDarkMode ? 'rgb(202, 199, 199)' : 'rgb(0, 0, 0)', // ✅ only this item
                color: isDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgb(255, 255, 255)', // ✅ only this item text
                borderRadius: 10,
              },
            },
          ]}
          onClick={() => {
            navigate('/administrator');
          }}
        />
      </div>
    </>
  );

  return (
    <Layout className={`h-screen ${collapsed ? 'collapsed' : ''}`} style={{ minHeight: '100vh' }}>
      {/* ===== Desktop Sidebar ===== */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          style={{ background: isDarkMode ? 'rgb(33, 31, 31)' : '#e5e7eb' }}
          collapsed={collapsed}
          theme={isDarkMode ? 'dark' : 'light'}
          width={220}>
          <SidebarLogo small={collapsed} />
          <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 64px)' }}>
            <SidebarMenu mode="inline" />
          </div>
        </Sider>
      )}

      {/* ===== Mobile Drawer Sidebar ===== */}
      {isMobile && (
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          placement="left"
          size={280}
          closable={false}
          styles={{
            body: {
              padding: 0,
              background: isDarkMode ? 'rgb(33, 31, 31)' : '#e5e7eb',
              color: 'blue',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            },
          }}>
          <div style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Image src={isDarkMode ? DarkVtsHrImage : LightVtsHrImage} alt="logo" height="30px" preview={false} />
            <div style={{ marginLeft: 'auto' }}>
              <Button type="text" onClick={() => setDrawerOpen(false)} style={{ color: colorText }}>
                <MenuUnfoldOutlined />
              </Button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <SidebarMenu mode="inline" />
          </div>
        </Drawer>
      )}

      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}>
          {/* Left: menu button (desktop collapse / mobile drawer) */}
          <Button
            type="text"
            icon={
              isMobile ? (
                <MenuUnfoldOutlined style={{ color: colorText }} />
              ) : collapsed ? (
                <MenuUnfoldOutlined style={{ color: colorText }} />
              ) : (
                <MenuFoldOutlined style={{ color: colorText }} />
              )
            }
            onClick={() => {
              if (isMobile) setDrawerOpen(true);
              else setCollapsed(!collapsed);
            }}
            style={{ fontSize: 16, height: 64 }}
          />

          {/* Right */}
          <div className="mx-6">
            <Flex gap={15} align="center">
              {showHeaderShortcuts && (
                <>
                  <Dropdown menu={{ items: itemsNotification }} trigger={['click']}>
                    <a
                      onClick={(e) => {
                        setCount(0);
                        e.preventDefault();
                      }}>
                      <div style={{ marginTop: 5 }}>
                        <Badge size="small" count={count}>
                          <BellOutlined style={{ fontSize: 20, color: colorText }} />
                        </Badge>
                      </div>
                    </a>
                  </Dropdown>

                  <Popover
                    content={() => (
                      <Row gutter={[6, 6]}>
                        {Array.from({ length: 6 }).map((_, idx) => (
                          <Col key={idx} span={8} align="center" style={{ cursor: 'pointer' }}>
                            <BorderOuterOutlined style={{ fontSize: 25 }} />
                          </Col>
                        ))}
                      </Row>
                    )}
                    title="Menu Icons"
                    trigger="click"
                    placement="bottom">
                    <AppstoreOutlined style={{ fontSize: 20, color: colorText }} />
                  </Popover>
                </>
              )}

              {/* Light/Dark toggle */}
              <Tooltip title={isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}>
                <Button
                  type="text"
                  onClick={onToggleTheme}
                  icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
                  style={{ fontSize: 20, color: colorText }}
                />
              </Tooltip>

              <Dropdown
                menu={{
                  items: itemsProfile,
                  onClick: ({ key }) => {
                    if (key === 'logout') {
                      window.location.href = '/logout';
                      return;
                    }
                    navigate(`/${key}`);
                  },
                }}
                trigger={['click']}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <Avatar style={{ backgroundColor: '#f79421' }}>
                      <b>{username ? username.slice(0, 1).toUpperCase() : ''}</b>
                    </Avatar>
                    <DownOutlined style={{ color: colorText, fontSize: 12 }} />
                  </Space>
                </a>
              </Dropdown>
            </Flex>
          </div>
        </Header>

        {/* section above content */}
        <div className="pt-5 px-5">{content}</div>

        <Content
          style={{
            margin: isMobile ? '12px' : '24px 16px',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
          className="mx-6 my-6 py-5 px-5 min-h-[280px] bg-[var(--color-bg-container)] rounded-lg overflow-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}>
          <Outlet context={{ collapsed }} />
        </Content>
      </Layout>
    </Layout>
  );
};

const ContentLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('vts-theme-mode');
    return saved ? saved === 'dark' : true;
  });

  const onToggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('vts-theme-mode', next ? 'dark' : 'light');
      return next;
    });
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: {
          Layout: {
            siderBg: '#ffffff',
          },
          Menu: {
            groupTitleColor: 'rgb(0, 0, 0)',
            darkGroupTitleColor: 'rgb(255, 255, 255)',

            // light mode
            itemBg: '#000000',
            subMenuItemBg: '#e5e7eb',
            popupBg: '#ffffff',
            itemColor: 'rgba(0, 0, 0, 0.88)',
            itemHoverColor: 'rgba(255, 255, 255, 0.88)',
            itemHoverBg: 'rgba(0, 0, 0, 0.55)',
            itemSelectedBg: 'rgb(255, 255, 255)',
            itemSelectedColor: 'rgb(255, 255, 255)',

            // dark mode (still white background + black text)
            darkItemBg: '#ffffff',
            darkSubMenuItemBg: '#rgb(33, 31, 31)',
            darkPopupBg: isDarkMode ? 'rgb(41, 39, 39)' : '#ffffff',
            darkItemColor: 'rgba(255, 255, 255, 0.88)',
            darkItemHoverColor: 'rgb(255, 255, 255)',
            darkItemHoverBg: 'rgb(0, 0, 0)',
            darkItemSelectedBg: 'rgb(255, 255, 255)',
            darkItemSelectedColor: 'rgb(255, 255, 255)',
          },
        },
      }}>
      <ContentLayoutBody isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />
    </ConfigProvider>
  );
};

export default ContentLayout;

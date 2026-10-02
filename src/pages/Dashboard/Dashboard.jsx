import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, Card, Col, Row, Typography, List, Space, Tag } from 'antd';
import {
  HomeOutlined,
  DashboardOutlined,
  SettingOutlined,
  FileTextOutlined,
  ApartmentOutlined,
  TeamOutlined,
  IdcardOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
  ScanOutlined,
  QrcodeOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useContent } from '../../contexts/ContentContext';

const { Title, Text } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  const { setContent } = useContent();

  //  hover state (store hovered item path)
  const [hoverKey, setHoverKey] = useState(null);

  useEffect(() => {
    document.title = 'Dashboard';

    setContent(
      <div className="flex justify-between">
        <div />
        <Breadcrumb
          items={[
            { title: <HomeOutlined style={{ cursor: 'pointer' }} onClick={() => navigate('/')} /> },
            { title: 'Dashboard' },
          ]}
        />
      </div>
    );
  }, [navigate, setContent]);

  const menuGuide = [
    {
      sectionTitle: 'DASHBOARD',
      sectionIcon: <DashboardOutlined />,
      cards: [
        {
          title: 'Logistic Dashboard',
          tag: 'Main',
          description: 'Quick overview for logistics: summary, status, and key numbers.',
          icon: <DashboardOutlined />,
          path: '/dashboard',
        },
      ],
    },
    {
      sectionTitle: 'SETTING',
      sectionIcon: <SettingOutlined />,
      cards: [
        {
          title: 'Setup',
          tag: 'Config',
          description:
            'Manage core master data used in HR system: company, department, position, employee, leave type, etc.',
          icon: <SettingOutlined />,
          children: [
            { label: 'Company', icon: <ApartmentOutlined />, path: '/company' },
            { label: 'Department', icon: <TeamOutlined />, path: '/department' },
            { label: 'Position', icon: <IdcardOutlined />, path: '/position' },
            { label: 'Employee', icon: <TeamOutlined />, path: '/employee' },
            { label: 'Leave Type', icon: <FileDoneOutlined />, path: '/leave' },
            { label: 'Holiday', icon: <CalendarOutlined />, path: '/holiday' },
            { label: 'QR Code', icon: <QrcodeOutlined />, path: '/qr-code' },
            { label: 'App Login', icon: <SafetyCertificateOutlined />, path: '/app-login' },
            { label: 'Document', icon: <FileTextOutlined />, path: '/document' },
          ],
        },
        {
          title: 'Employee Schedule',
          tag: 'Schedule',
          description:
            'Control shift and schedule rules: assign shifts, configure attendance rules, and manage schedules.',
          icon: <CalendarOutlined />,
          children: [
            { label: 'Shift Management', icon: <ClockCircleOutlined />, path: '/shift-management' },
            { label: 'Employee Schedule', icon: <CalendarOutlined />, path: '/employee-schedule' },
            { label: 'Attendance Rule', icon: <FileDoneOutlined />, path: '/attendance-rule' },
          ],
        },
      ],
    },
    {
      sectionTitle: 'REPORT',
      sectionIcon: <FileTextOutlined />,
      cards: [
        {
          title: 'REPORT',
          tag: 'Analytics',
          description:
            'View employee attendance and leave results: daily list, summary report, leave report and missed scan.',
          icon: <FileTextOutlined />,
          children: [
            { label: 'Attendance List', icon: <FileTextOutlined />, path: '/attendance/list' },
            { label: 'Attendance Report', icon: <FileDoneOutlined />, path: '/attendance-report' },
            { label: 'Leave Report', icon: <FileDoneOutlined />, path: '/leave/report' },
            { label: 'Missed Scan', icon: <ScanOutlined />, path: '/missed-scan' },
          ],
        },
      ],
    },
  ];

  //  styles for hover item
  const getItemStyle = (path) => {
    const isHover = hoverKey === path;
    return {
      cursor: 'pointer',
      borderRadius: 10,
      padding: '10px 12px',
      transition: 'all 0.15s ease',
      background: isHover ? 'rgba(24, 144, 255, 0.12)' : 'transparent',
      color: isHover ? '#1890ff' : 'inherit',
    };
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 4 }}>
        Menu Guide
      </Title>
      <Text type="secondary">This dashboard explains what each menu does. Click any item to open that page.</Text>

      <div style={{ height: 12 }} />

      {menuGuide.map((section) => (
        <div key={section.sectionTitle} style={{ marginBottom: 18 }}>
          <Space align="center" style={{ marginBottom: 10 }}>
            {section.sectionIcon}
            <Title level={5} style={{ margin: 0 }}>
              {section.sectionTitle}
            </Title>
          </Space>

          <Row gutter={[12, 12]}>
            {section.cards.map((card) => (
              <Col key={card.title} xs={24} md={12} lg={8}>
                <Card
                  hoverable
                  style={{ borderRadius: 12 }}
                  onClick={() => card.path && navigate(card.path)}
                  title={
                    <Space>
                      {card.icon}
                      <span>{card.title}</span>
                      {card.tag ? <Tag color="orange">{card.tag}</Tag> : null}
                    </Space>
                  }>
                  <Text>{card.description}</Text>

                  {card.children?.length ? (
                    <>
                      <div style={{ height: 12 }} />

                      <div
                        style={{
                          border: '1px solid rgba(0,0,0,0.1)',
                          borderRadius: 10,
                          overflow: 'hidden',
                        }}>
                        {card.children.map((item) => {
                          const isHover = hoverKey === item.path;

                          return (
                            <div
                              key={item.path}
                              style={{
                                ...getItemStyle(item.path),
                                borderRadius: 0,
                                borderBottom: '1px solid rgba(0,0,0,0.06)',
                              }}
                              onMouseEnter={() => setHoverKey(item.path)}
                              onMouseLeave={() => setHoverKey(null)}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(item.path);
                              }}>
                              <Space>
                                <span style={{ color: isHover ? '#1890ff' : 'inherit' }}>{item.icon}</span>
                                <span>{item.label}</span>
                              </Space>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : null}
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;

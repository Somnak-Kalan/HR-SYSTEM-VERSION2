import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

import {
  AreaChartOutlined,
  QrcodeOutlined,
  BankOutlined,
  CalendarOutlined,
  SettingOutlined,
  ScheduleOutlined,
  FundOutlined,
  PartitionOutlined,
  TeamOutlined,
  ApartmentOutlined,
  LoginOutlined,
  FileTextOutlined,
  FieldTimeOutlined,
  FileProtectOutlined,
  UnorderedListOutlined,
  EnvironmentOutlined,
  FileDoneOutlined,
  ScanOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const getItem = (label, key, icon, children, type) => ({
  key,
  icon,
  children,
  label,
  type,
});

const defaultMenuBar = ['/check-in-out', '/lates'];

const items = [
  // ================= DASHBOARD =================
  {
    label: 'DASHBOARD',
    key: 'group.dashboard',
    type: 'group',
    index: 1,
  },
  {
    label: 'Menu Guide',
    key: '/dashboard',
    type: 'key',
    index: 1,
    gKey: 'group.dashboard',
    icon: <AreaChartOutlined />,
  },

  // ================= SETTING =================
  {
    label: 'SETTING',
    key: 'group.setting',
    type: 'group',
    index: 2,
  },

  // Setup parent
  {
    label: 'Setup',
    key: '/setup',
    type: 'parent',
    index: 1,
    gKey: 'group.setting',
    icon: <SettingOutlined />,
  },
  {
    label: 'Company',
    key: '/company',
    type: 'key',
    index: 1,
    pKey: '/setup',
    icon: <BankOutlined />,
  },
  {
    label: 'Department',
    key: '/department',
    type: 'key',
    index: 2,
    pKey: '/setup',
    icon: <PartitionOutlined />,
  },
  {
    label: 'Holiday',
    key: '/holiday',
    type: 'key',
    index: 3,
    pKey: '/setup',
    icon: <CalendarOutlined />,
  },
  {
    label: 'QR Code',
    key: '/qr-code',
    type: 'key',
    index: 4,
    pKey: '/setup',
    icon: <QrcodeOutlined />,
  },
  {
    label: 'Employee',
    key: '/employee',
    type: 'key',
    index: 5,
    pKey: '/setup',
    icon: <TeamOutlined />,
  },
  {
    label: 'Position',
    key: '/position',
    type: 'key',
    index: 6,
    pKey: '/setup',
    icon: <ApartmentOutlined />,
  },
  {
    label: 'Leave Type',
    key: '/leave-type',
    type: 'key',
    index: 7,
    pKey: '/setup',
    icon: <ScheduleOutlined />,
  },
  {
    label: 'App Login',
    key: '/app-login',
    type: 'key',
    index: 8,
    pKey: '/setup',
    icon: <LoginOutlined />,
  },
  {
    label: 'Clock In/out',
    key: '/check-in-out',
    type: 'key',
    index: 9,
    pKey: '/setup',
    icon: <ClockCircleOutlined />,
  },
  {
    label: 'Late',
    key: '/lates',
    type: 'key',
    index: 10,
    pKey: '/setup',
    icon: <EnvironmentOutlined />,
  },
  {
    label: 'Document',
    key: '/document',
    type: 'key',
    index: 11,
    pKey: '/setup',
    icon: <FileTextOutlined />,
  },

  // Employee schedule parent
  {
    label: 'Employee Schedule',
    key: '/employee-schedules',
    type: 'parent',
    index: 2,
    gKey: 'group.setting',
    icon: <ScheduleOutlined />,
  },
  {
    label: 'Shift Management',
    key: '/shift-management',
    type: 'key',
    index: 1,
    pKey: '/employee-schedules',
    icon: <FieldTimeOutlined />,
  },
  {
    label: 'Apply Shift',
    key: '/apply-shift',
    type: 'key',
    index: 2,
    pKey: '/employee-schedules',
    icon: <ScheduleOutlined />,
  },
  {
    label: 'Attendance Rule',
    key: '/attendance-rule',
    type: 'key',
    index: 3,
    pKey: '/employee-schedules',
    icon: <FileProtectOutlined />,
  },

  // ================= REPORT =================
  {
    label: 'REPORT',
    key: 'group.report',
    type: 'group',
    index: 3,
  },
  {
    label: 'Report',
    key: '/report',
    type: 'parent',
    index: 1,
    gKey: 'group.report',
    icon: <FundOutlined />,
  },
  {
    label: 'Attendance List',
    key: '/attendance-list',
    type: 'key',
    index: 1,
    pKey: '/report',
    icon: <UnorderedListOutlined />,
  },
  // {
  //   label: 'Attendance Report',
  //   key: '/attendance-report',
  //   type: 'key',
  //   index: 2,
  //   pKey: '/report',
  //   icon: <BarChartOutlined />,
  // },
  {
    label: 'Leave Report',
    key: '/leave-report',
    type: 'key',
    index: 3,
    pKey: '/report',
    icon: <FileDoneOutlined />,
  },
  {
    label: 'Missed Scan',
    key: '/missed-scan',
    type: 'key',
    index: 4,
    pKey: '/report',
    icon: <ScanOutlined />,
  },
  // {
  //   label: 'Late',
  //   key: '/late',
  //   type: 'key',
  //   index: 5,
  //   pKey: '/report',
  //   icon: <ClockCircleOutlined />,
  // },
];

const normalizeMenuKey = (value) => {
  if (typeof value !== 'string') return null;

  const trimmedValue = value.trim();

  if (!trimmedValue) return null;

  const key = trimmedValue.startsWith('/') ? trimmedValue : `/${trimmedValue}`;

  return key.toLowerCase();
};

const flattenMenuKeys = (menu) => {
  if (!Array.isArray(menu)) return [];

  const keys = [];

  const addKey = (value) => {
    const normalizedKey = normalizeMenuKey(value);

    if (normalizedKey && !keys.includes(normalizedKey)) {
      keys.push(normalizedKey);
    }
  };

  const loop = (list) => {
    list.forEach((item) => {
      if (typeof item === 'string') {
        addKey(item);
        return;
      }

      if (!item || typeof item !== 'object') return;

      addKey(item.key);
      addKey(item.path);
      addKey(item.route);
      addKey(item.url);

      if (Array.isArray(item.child)) {
        loop(item.child);
      }

      if (Array.isArray(item.children)) {
        loop(item.children);
      }

      if (Array.isArray(item.permissions)) {
        loop(item.permissions);
      }

      if (Array.isArray(item.menuBar)) {
        loop(item.menuBar);
      }
    });
  };

  loop(menu);

  return keys;
};

const sortMenu = (menu) => {
  return [...menu]
    .sort((a, b) => (a.index || 0) - (b.index || 0))
    .map((item) => {
      if (!Array.isArray(item.children)) {
        return item;
      }

      return {
        ...item,
        children: sortMenu(item.children),
      };
    });
};

const addChildUnique = (list, item) => {
  const exists = list.some((child) => child.key === item.key);

  if (!exists) {
    list.push(item);
  }
};

const GetMenuSideBar = (collapsed) => {
  const { menuBar } = useContext(AuthContext);

  /*
   * Always use menuBar from AuthContext.
   * defaultMenuBar is used only when menuBar has not loaded yet
   * or is not an array.
   */
  const sourceMenuBar = [
    ...defaultMenuBar,
    ...(Array.isArray(menuBar) ? menuBar : [])
  ];
  const permissionKeys = flattenMenuKeys(sourceMenuBar);

  const menu = [];

  permissionKeys.forEach((permissionKey) => {
    const menuItem = items.find((item) => {
      return normalizeMenuKey(item.key) === permissionKey;
    });

    if (!menuItem || menuItem.type !== 'key') {
      return;
    }

    // ================= ITEM UNDER PARENT =================
    if (menuItem.pKey) {
      const parentItem = items.find((item) => {
        return item.key === menuItem.pKey && item.type === 'parent';
      });

      if (!parentItem) return;

      const groupItem = items.find((item) => {
        return item.key === parentItem.gKey && item.type === 'group';
      });

      if (!groupItem) return;

      let groupMenu = menu.find((item) => item.key === groupItem.key);

      if (!groupMenu) {
        groupMenu = {
          ...getItem(collapsed ? '' : groupItem.label, groupItem.key, null, [], groupItem.type),
          index: groupItem.index || 0,
        };

        menu.push(groupMenu);
      }

      let parentMenu = groupMenu.children.find((item) => item.key === parentItem.key);

      if (!parentMenu) {
        parentMenu = {
          ...getItem(parentItem.label, parentItem.key, parentItem.icon || null, []),
          index: parentItem.index || 0,
        };

        groupMenu.children.push(parentMenu);
      }

      addChildUnique(parentMenu.children, {
        ...getItem(menuItem.label, menuItem.key, menuItem.icon || null),
        index: menuItem.index || 0,
      });

      return;
    }

    // ================= ITEM DIRECTLY UNDER GROUP =================
    if (menuItem.gKey) {
      const groupItem = items.find((item) => {
        return item.key === menuItem.gKey && item.type === 'group';
      });

      if (!groupItem) return;

      let groupMenu = menu.find((item) => item.key === groupItem.key);

      if (!groupMenu) {
        groupMenu = {
          ...getItem(collapsed ? '' : groupItem.label, groupItem.key, null, [], groupItem.type),
          index: groupItem.index || 0,
        };

        menu.push(groupMenu);
      }

      addChildUnique(groupMenu.children, {
        ...getItem(menuItem.label, menuItem.key, menuItem.icon || null),
        index: menuItem.index || 0,
      });
    }
  });

  return sortMenu(menu);
};

export default GetMenuSideBar;

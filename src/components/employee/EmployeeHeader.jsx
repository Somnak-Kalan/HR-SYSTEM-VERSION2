import React from 'react';

import { Breadcrumb } from 'antd';

import { HomeOutlined } from '@ant-design/icons';

import GroupBtn from 'components/GroupBtn';
import ResignIcon from '../../assets/icons/resign.svg'
export default function EmployeeHeader({
  collapsed,
  selectedEmployee,
  onChangeStatus,
  onHome,
  activeTab,
  onResignBtn,
}) {
  const canResign = selectedEmployee && String(selectedEmployee?.status).toLowerCase() !== 'resign';
  return (
    <div className="mb-3 flex items-center justify-between">
      <div>
        <GroupBtn
          collapsed={collapsed}
          backBtn
          showCustomBtn
          customBtn={selectedEmployee}
          customBtnText="Change Status"
          onCustomBtnClick={onChangeStatus}
          customButtons={
            activeTab === 'resign'
              ?
              [

                {
                  text: "Re-Join Company",
                  enabled: activeTab === 'resign' && selectedEmployee ? true : false,
                  onClick: 'onRejoinBtn',
                  bgColor: "#ffffff",
                  textColor: "#1677ff",
                  borderColor: "#91caff"
                }
              ]
              : activeTab === 'employee' ? [

                {
                  text: "Resign",
                  enabled: activeTab === 'employee' && selectedEmployee ? true : false,
                  onClick: onResignBtn,



                }
              ] : ''

          }
        />
      </div>

      <Breadcrumb
        items={[
          {
            title: (
              <HomeOutlined
                style={{
                  cursor: 'pointer',
                }}

                onClick={onHome}
              />
            ),
          },

          {
            title: 'employee',
          },
        ]}
      />
    </div>
  );
}

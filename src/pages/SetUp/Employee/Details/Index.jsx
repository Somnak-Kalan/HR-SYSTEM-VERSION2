// import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
// import { Card, Breadcrumb, message } from 'antd';
// import { HomeOutlined } from '@ant-design/icons';
// import GroupBtn from 'components/GroupBtn';
// import { useEffect, useContext, useCallback } from 'react';

// import PersonalInfo from './PersonalInfo';
// import CompanyInfo from './CompanyInfor';
// import OtherInfo from './OtherInfo';
// import EmployeeSchedule from './EmployeeSchedule';

// import { AuthContext } from '../../../../contexts/AuthContext';
// import { useContent } from '../../../../contexts/ContentContext';
// import { useEmployeeDetailStore } from '../../../../stores/employeeDetail.store';
// import SectionTitle from '../../../../components/employee/detail/SectionTitle';

// const ListDownData = () => {
//   const { setContent } = useContent();
//   const { collapsed } = useOutletContext();
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const { access_token } = useContext(AuthContext);

//   const loading = useEmployeeDetailStore((s) => s.loading);

//   const personal_info = useEmployeeDetailStore((s) => s.personal_info);
//   const company_info = useEmployeeDetailStore((s) => s.company_info);
//   const other_info = useEmployeeDetailStore((s) => s.other_info);
//   const status = useEmployeeDetailStore((s) => s.status);

//   const shift = useEmployeeDetailStore((s) => s.shift);
//   const shift_management_id = useEmployeeDetailStore((s) => s.shift_management_id);

//   const profile_photo = useEmployeeDetailStore((s) => s.profile_photo);

//   const leave_type_data = useEmployeeDetailStore((s) => s.leave_type_data);
//   const leave_type = useEmployeeDetailStore((s) => s.leave_type);

//   const cv_file = useEmployeeDetailStore((s) => s.cv_file);
//   const id_card_file = useEmployeeDetailStore((s) => s.id_card_file);
//   const driver_license_file = useEmployeeDetailStore((s) => s.driver_license_file);
//   const others_file = useEmployeeDetailStore((s) => s.others_file);

//   const fetchDetail = useEmployeeDetailStore((s) => s.fetchDetail);
//   const resetDetail = useEmployeeDetailStore((s) => s.resetDetail);

//   const success = useCallback(({ content }) => {
//     message.success({ content });
//   }, []);

//   useEffect(() => {
//     if (!id || !access_token) return;

//     resetDetail();

//     fetchDetail({
//       id,
//       access_token,
//       force: true,
//     });
//   }, [id, access_token, resetDetail, fetchDetail]);

//   useEffect(() => {
//     setContent(
//       <div className="flex justify-between">
//         <div>
//           <GroupBtn collapsed={collapsed} />
//         </div>

//         <Breadcrumb
//           items={[
//             {
//               title: <HomeOutlined onClick={() => navigate('/')} />,
//             },
//             {
//               title: 'employee detail',
//             },
//           ]}
//         />
//       </div>
//     );
//   }, [setContent, collapsed, navigate]);

//   return (
//     <div>
//       <Card title="EMPLOYEE DETAIL">
//         <SectionTitle>Personal Information</SectionTitle>
//         <PersonalInfo loading={loading} personal_info={personal_info} profile_photo={profile_photo} />

//         <SectionTitle> Company Information </SectionTitle>
//         <CompanyInfo loading={loading} company_info={company_info} status={status} />

//         <SectionTitle>Other Information</SectionTitle>
//         <OtherInfo
//           loading={loading}
//           other_info={other_info}
//           id_card_file={id_card_file}
//           cv_file={cv_file}
//           driver_license_file={driver_license_file}
//           others_file={others_file}
//         />
//         <SectionTitle>Employee Schedule</SectionTitle>
//         <EmployeeSchedule
//           loading={loading}
//           schedule_List={shift}
//           shift_management_id={shift_management_id}
//           leave_type_data={leave_type_data}
//           leave_type={leave_type}
//           success={success}
//         />
//       </Card>
//     </div>
//   );
// };

// export default ListDownData;
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb, message, Skeleton } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import GroupBtn from 'components/GroupBtn';
import { useEffect, useContext, useCallback } from 'react';

import PersonalInfo from './PersonalInfo';
import CompanyInfo from './CompanyInfor';
import OtherInfo from './OtherInfo';
import EmployeeSchedule from './EmployeeSchedule';

import { AuthContext } from '../../../../contexts/AuthContext';
import { useContent } from '../../../../contexts/ContentContext';
import { useEmployeeDetailStore } from '../../../../stores/employeeDetail.store';

const ListDownData = () => {
  const { setContent } = useContent();
  const { collapsed } = useOutletContext();

  const navigate = useNavigate();
  const { id } = useParams();

  const { access_token } = useContext(AuthContext);

  const loading = useEmployeeDetailStore((s) => s.loading);

  const personal_info = useEmployeeDetailStore((s) => s.personal_info);
  const company_info = useEmployeeDetailStore((s) => s.company_info);
  const other_info = useEmployeeDetailStore((s) => s.other_info);
  const status = useEmployeeDetailStore((s) => s.status);

  const shift = useEmployeeDetailStore((s) => s.shift);
  const shift_management_id = useEmployeeDetailStore(
    (s) => s.shift_management_id
  );

  const profile_photo = useEmployeeDetailStore((s) => s.profile_photo);

  const leave_type_data = useEmployeeDetailStore(
    (s) => s.leave_type_data
  );

  const leave_type = useEmployeeDetailStore((s) => s.leave_type);

  const cv_file = useEmployeeDetailStore((s) => s.cv_file);
  const id_card_file = useEmployeeDetailStore((s) => s.id_card_file);

  const driver_license_file = useEmployeeDetailStore(
    (s) => s.driver_license_file
  );

  const others_file = useEmployeeDetailStore((s) => s.others_file);

  const fetchDetail = useEmployeeDetailStore((s) => s.fetchDetail);
  const resetDetail = useEmployeeDetailStore((s) => s.resetDetail);

  const success = useCallback(({ content }) => {
    message.success({
      content,
    });
  }, []);

  useEffect(() => {
    if (!id || !access_token) return;

    resetDetail();

    fetchDetail({
      id,
      access_token,
      force: true,
    });
  }, [
    id,
    access_token,
    resetDetail,
    fetchDetail,
  ]);

  useEffect(() => {
    setContent(
      <div className="flex justify-between items-center">
        <GroupBtn collapsed={collapsed} />

        <Breadcrumb
          items={[
            {
              title: (
                <HomeOutlined
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate('/')}
                />
              ),
            },
            {
              title: 'employee detail',
            },
          ]}
        />
      </div>
    );
  }, [
    setContent,
    collapsed,
    navigate,
  ]);

  if (loading && !personal_info && !company_info) {
    return (
      <div
        style={{
          padding: 16,
          background: '#ffffff',
          borderRadius: 12,
        }}
      >
        <Skeleton active />
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 10,
          alignItems: 'start',
        }}
        className="employee-detail-layout"
      >
        {/* LEFT */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            minWidth: 0,
          }}
        >
          <PersonalInfo
            loading={loading}
            personal_info={personal_info}
            profile_photo={profile_photo}
          />

          <OtherInfo
            loading={loading}
            other_info={other_info}
            id_card_file={id_card_file}
            cv_file={cv_file}
            driver_license_file={driver_license_file}
            others_file={others_file}
          />
        </div>

        {/* RIGHT */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            minWidth: 0,
          }}
        >
          <CompanyInfo
            loading={loading}
            company_info={company_info}
            status={status}
          />

          <EmployeeSchedule
            loading={loading}
            schedule_List={shift}
            shift_management_id={shift_management_id}
            leave_type_data={leave_type_data}
            leave_type={leave_type}
            success={success}
          />
        </div>
      </div>

      <style>
        {`
          @media (max-width: 1199px) {
            .employee-detail-layout {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ListDownData;
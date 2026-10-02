// import { Col, Row, Skeleton } from 'antd';
// import dayjs from 'dayjs';
// import UpdateCompanyInfo from './Edit/UpdateCompanyInfo';
// import InfoField from '../../../../components/employee/detail/InfoField';

// const safe = (value) => {
//   if (value === undefined || value === null) return '';
//   if (value === 'undefined') return '';
//   return value;
// };

// const formatDate = (value) => {
//   return value ? dayjs(value).format('YYYY-MM-DD') : '';
// };

// const CompanyInfo = (props) => {
//   const { loading, company_info, status } = props;

//   if (loading && !company_info) return <Skeleton active />;

//   const c = company_info || {};

//   const companyName = c.company_name || c.company || '';
//   const departmentName = c.department_name || c.department || '';
//   const positionName = c.position_name || c.position || '';

//   return (
//     <div className="mx-0 shadow-md rounded-lg overflow-hidden w-full">
//       <div className="my-4">
//         <Row>
//           <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//             <InfoField label="Employee ID" value={safe(c.employee_id)} />
//           </Col>

//           <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//             <InfoField label="Company" value={safe(companyName)} />
//           </Col>

//           <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//             <InfoField label="Department" value={safe(departmentName)} />
//           </Col>

//           <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//             <InfoField label="Position" value={safe(positionName)} />
//           </Col>

//           <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//             <InfoField label="Join Date" value={formatDate(c.join_date)} />
//           </Col>

//           <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//             <InfoField label="Base Salary" value={safe(c.base_salary)} />
//           </Col>

//           <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//             <InfoField label="Probation(Month)" value={safe(c.probation)} />
//           </Col>

//           <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//             <InfoField label="Evaluation Period (Month)" value={safe(c.evaluation_period)} />
//           </Col>

//           <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//             <InfoField label="Probation Date" value={formatDate(c.probation_date)} />
//           </Col>

//           <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//             <InfoField label="Passed Probation" value={formatDate(c.passed_probation)} />
//           </Col>
//         </Row>

//         <Col sm={24} xs={24} className="flex justify-end mx-10 py-3">
//           <div>
//             <div className="flex justify-end mx-10 py-3">
//               <UpdateCompanyInfo
//                 company_info={company_info}
//                 props_company_id={c.company_id}
//                 props_department_id={c.department_id}
//                 props_position_id={c.position_id}
//               />
//             </div>
//             {status?.toLowerCase() === 'draft' && (
//               <span className="text-red-500">* Please complete the company information</span>
//             )}
//           </div>
//         </Col>
//       </div>
//     </div>
//   );
// };

// export default CompanyInfo;
import {
  Skeleton,
  Button,
  theme,
} from 'antd';

import {
  EditOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';

import dayjs from 'dayjs';

import UpdateCompanyInfo from './Edit/UpdateCompanyInfo';

const safe = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === 'undefined'
  ) {
    return '';
  }

  return value;
};

const formatDate = (value) => {
  if (!value) return '';

  return dayjs(value).format('YYYY-MM-DD');
};

const InfoRow = ({
  label,
  children,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '105px 10px 1fr',
        minHeight: 24,
        alignItems: 'center',
        fontSize: 13,
      }}
    >
      <span
        style={{
          color: '#666',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>

      <span>:</span>

      <div
        style={{
          minWidth: 0,
          color: '#111',
          fontWeight: 500,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {children || '-'}
      </div>
    </div>
  );
};

const CompanyInfo = ({
  loading,
  company_info,
  status,
}) => {
  const {
    token: {
      colorBgContainer,
      colorBorderSecondary,
      colorText,
    },
  } = theme.useToken();

  if (loading && !company_info) {
    return <Skeleton active />;
  }

  const c = company_info || {};

  const companyName =
    c.company_name ||
    c.company ||
    '';

  const departmentName =
    c.department_name ||
    c.department ||
    '';

  const positionName =
    c.position_name ||
    c.position ||
    '';

  const passed =
    String(c.passed_probation || '').toLowerCase() ===
    'pass' ||
    String(c.passed_probation || '').toLowerCase() ===
    'passed' ||
    String(status || '').toLowerCase() === 'passed';

  return (
    <div
      style={{
        background: colorBgContainer,
        border: `1px solid ${colorBorderSecondary}`,
        borderRadius: 12,
        padding: '12px 16px 16px',
        color: colorText,
        minHeight: 168,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          Company Information
        </div>

        <UpdateCompanyInfo
          company_info={company_info}
          props_company_id={c.company_id}
          props_department_id={c.department_id}
          props_position_id={c.position_id}
          trigger={
            <Button
              type="primary"
              icon={<EditOutlined />}
              style={{
                width: 28,
                height: 28,
                padding: 0,
                borderRadius: 6,
                background: '#fa8c16',
                borderColor: '#fa8c16',
              }}
            />
          }
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'minmax(0, 1fr) minmax(0, 1fr)',
          gap: '0 22px',
        }}
      >
        {/* LEFT */}
        <div>
          <InfoRow label="Employee ID">
            {safe(c.employee_id)}
          </InfoRow>

          <InfoRow label="Company">
            {safe(companyName)}
          </InfoRow>

          <InfoRow label="Department">
            {safe(departmentName)}
          </InfoRow>

          <InfoRow label="Position">
            {safe(positionName)}
          </InfoRow>
        </div>

        {/* RIGHT */}
        <div>
          <InfoRow label="Join Date">
            {formatDate(c.join_date)}
          </InfoRow>

          <InfoRow label="Probation End">
            <span>
              {formatDate(c.probation_date)}

              {passed && (
                <span
                  style={{
                    color: '#52c41a',
                    marginLeft: 6,
                    fontWeight: 600,
                  }}
                >
                  | Pass
                </span>
              )}
            </span>
          </InfoRow>

          <InfoRow label="Evaluation">
            {safe(c.evaluation_period)}
          </InfoRow>

          <InfoRow label="Evaluation Doc">
            {c.evaluation_document ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  minWidth: 0,
                }}
              >
                <FilePdfOutlined
                  style={{
                    color: '#ff4d4f',
                    fontSize: 17,
                  }}
                />

                <span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {c.evaluation_document_name ||
                    c.evaluation_document}
                </span>
              </div>
            ) : (
              '-'
            )}
          </InfoRow>
        </div>
      </div>

      {String(status || '').toLowerCase() ===
        'draft' && (
          <div
            style={{
              color: '#ff4d4f',
              fontSize: 12,
              marginTop: 8,
            }}
          >
            * Please complete the company information
          </div>
        )}
    </div>
  );
};

export default CompanyInfo;
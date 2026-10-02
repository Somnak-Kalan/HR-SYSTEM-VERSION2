// import { Col, Skeleton, Row, theme } from 'antd';
// import UpdateOtherInfo from './Edit/UpdateOtherInfo';
// import UpdateFile from './Edit/UpdateFile';
// import { useState } from 'react';
// import InfoField from '../../../../components/employee/detail/InfoField';
// import FileRow from '../../../../components/employee/detail/FileRow';

// const safe = (value) => {
//   if (value === undefined || value === null || value === 'undefined') return '';
//   return value;
// };

// const OtherInfo = (props) => {
//   const { loading, other_info, id_card_file, cv_file, driver_license_file, others_file } = props;

//   const {
//     token: {
//       colorBgContainer,
//       colorBgElevated,
//       colorText,
//       colorTextSecondary,
//       colorBorder,
//       colorFillAlter,
//       boxShadowSecondary,
//     },
//   } = theme.useToken();

//   const [open_modal_file, setOpenModalFile] = useState(false);
//   const [documents, setDocuments] = useState([]);

//   if (loading && !other_info) return <Skeleton active />;

//   const { bank_name, acc_name, acc_no, open_payroll } = other_info || {};

//   const handleOpen = (data) => {
//     setDocuments([data]);
//     setOpenModalFile(true);
//   };

//   const cardStyle = {
//     background: colorBgContainer,
//     color: colorText,
//     border: `1px solid ${colorBorder}`,
//     boxShadow: boxShadowSecondary,
//   };

//   const tableWrapperStyle = {
//     background: colorBgContainer,
//     color: colorText,
//     border: `1px solid ${colorBorder}`,
//     boxShadow: boxShadowSecondary,
//   };

//   const tableStyle = {
//     borderCollapse: 'collapse',
//     background: colorBgContainer,
//     color: colorText,
//   };

//   const thStyle = {
//     background: colorFillAlter,
//     color: colorText,
//     border: `1px solid ${colorBorder}`,
//     padding: '10px 12px',
//     textAlign: 'left',
//     fontWeight: 600,
//   };

//   return (
//     <div
//       className="sm:block w-full"
//       style={{
//         color: colorText,
//       }}>
//       <style>
//         {`
//           .other-info-table {
//             background: ${colorBgContainer} !important;
//             color: ${colorText} !important;
//           }

//           .other-info-table th {
//             background: ${colorFillAlter} !important;
//             color: ${colorText} !important;
//             border: 1px solid ${colorBorder} !important;
//           }

//           .other-info-table td {
//             background: ${colorBgContainer} !important;
//             color: ${colorText} !important;
//             border: 1px solid ${colorBorder} !important;
//           }

//           .other-info-table tr:hover td {
//             background: ${colorBgElevated} !important;
//           }

//           .other-info-table a {
//             color: #1677ff !important;
//           }

//           .other-info-table .ant-btn {
//             color: ${colorText} !important;
//           }

//           .other-info-table .ant-btn-primary {
//             color: #ffffff !important;
//           }

//           .other-info-card {
//             background: ${colorBgContainer} !important;
//             color: ${colorText} !important;
//             border: 1px solid ${colorBorder} !important;
//           }

//           .other-info-card label,
//           .other-info-card span,
//           .other-info-card p,
//           .other-info-card div {
//             color: inherit;
//           }

//           .other-info-muted {
//             color: ${colorTextSecondary} !important;
//           }
//         `}
//       </style>

//       <div className="w-full xl:mr-2 shadow-md rounded-lg overflow-hidden other-info-card" style={cardStyle}>
//         <div className="my-4">
//           <Row>
//             <Col xs={24} sm={24} md={11} lg={11} xl={10} xxl={10} className="md:mx-3">
//               <InfoField label="Bank Name" value={safe(bank_name)} />
//             </Col>

//             <Col xs={24} sm={24} md={11} lg={11} xl={10} xxl={10} className="md:mx-3">
//               <InfoField label="Acc Name" value={safe(acc_name)} />
//             </Col>

//             <Col xs={24} sm={24} md={11} lg={11} xl={10} xxl={10} className="md:mx-3">
//               <InfoField label="Acc No" value={safe(acc_no)} />
//             </Col>

//             <Col xs={24} sm={24} md={11} lg={11} xl={10} xxl={10} className="md:mx-3">
//               <InfoField label="Open Payroll" value={safe(open_payroll)} />
//             </Col>
//           </Row>
//         </div>

//         <div className="flex justify-end mx-14 py-3">
//           <div>
//             <UpdateOtherInfo other_info={other_info} />
//             {(open_payroll === null || open_payroll === '' || open_payroll === undefined) && (
//               <span style={{ color: 'red' }} className=" text-sm mb-0">
//                 * Please Select Open Payroll
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       <UpdateFile open_modal_file={open_modal_file} setOpenModalFile={setOpenModalFile} documents={documents} />

//       <div className="py-5 w-full sm:mt-5 shadow-md rounded-lg overflow-auto" style={tableWrapperStyle}>
//         <div className="mx-3 px-1 my-4">
//           <table className="w-full other-info-table" style={tableStyle}>
//             <thead>
//               <tr>
//                 <th
//                   style={{
//                     ...thStyle,
//                     width: 10,
//                   }}>
//                   File Name
//                 </th>

//                 <th
//                   style={{
//                     ...thStyle,
//                     width: 150,
//                   }}>
//                   File
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               <FileRow
//                 label="Identity Card/Passport"
//                 file={id_card_file}
//                 filename="id_card"
//                 onEdit={() =>
//                   handleOpen({
//                     value: 'id_card',
//                     label: 'Identity Card/Passport',
//                     file: id_card_file || '',
//                   })
//                 }
//               />

//               <FileRow
//                 label="CV"
//                 file={cv_file}
//                 filename="cv"
//                 onEdit={() =>
//                   handleOpen({
//                     value: 'cv',
//                     label: 'CV',
//                     file: cv_file || '',
//                   })
//                 }
//               />

//               <FileRow
//                 label="Driver License"
//                 file={driver_license_file}
//                 filename="driver_license"
//                 onEdit={() =>
//                   handleOpen({
//                     value: 'driver_license',
//                     label: 'Driver License',
//                     file: driver_license_file || '',
//                   })
//                 }
//               />

//               <FileRow
//                 label="Other"
//                 file={others_file}
//                 filename="others"
//                 isArray
//                 onEdit={() =>
//                   handleOpen({
//                     value: 'others',
//                     label: 'Others',
//                     files: Array.isArray(others_file) ? others_file : [],
//                   })
//                 }
//               />
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OtherInfo;
import {
  Button,
  Skeleton,
  theme,
} from 'antd';

import {
  EditOutlined,
  FileTextOutlined,
  UploadOutlined,
} from '@ant-design/icons';

import { useState } from 'react';

import UpdateOtherInfo from './Edit/UpdateOtherInfo';
import UpdateFile from './Edit/UpdateFile';

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

const DocumentRow = ({
  label,
  onClick,
}) => {
  return (
    <div
      style={{
        minHeight: 34,
        border: '1px solid #e5e7eb',
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '3px 5px 3px 8px',
        marginBottom: 7,
        background: '#ffffff',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          minWidth: 0,
        }}
      >
        <FileTextOutlined
          style={{
            color: '#7b9bbf',
            fontSize: 17,
          }}
        />

        <span
          style={{
            fontSize: 13,
            color: '#1f2937',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
      </div>

      <Button
        type="primary"
        size="small"
        icon={<UploadOutlined />}
        onClick={onClick}
        style={{
          height: 25,
          borderRadius: 5,
          paddingInline: 7,
          fontSize: 11,
        }}
      >
        Upload
      </Button>
    </div>
  );
};

const OtherInfo = ({
  loading,
  other_info,
  id_card_file,
  cv_file,
  driver_license_file,
  others_file,
}) => {
  const {
    token: {
      colorBgContainer,
      colorBorderSecondary,
      colorText,
    },
  } = theme.useToken();

  const [
    open_modal_file,
    setOpenModalFile,
  ] = useState(false);

  const [documents, setDocuments] =
    useState([]);

  if (loading && !other_info) {
    return <Skeleton active />;
  }

  const {
    bank_name,
    acc_name,
    acc_no,
    open_payroll,
  } = other_info || {};

  const handleOpen = (data) => {
    setDocuments([data]);
    setOpenModalFile(true);
  };

  const cardStyle = {
    background: colorBgContainer,
    color: colorText,
    border: `1px solid ${colorBorderSecondary}`,
    borderRadius: 12,
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {/* BANK ACCOUNT */}
      <div
        style={{
          ...cardStyle,
          padding: '10px 22px 12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            Bank Account Information
          </div>

          <UpdateOtherInfo
            other_info={other_info}
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
            gridTemplateColumns: '115px 10px 1fr',
            fontSize: 13,
          }}
        >
          <span
            style={{
              color: '#666',
            }}
          >
            Open Payroll
          </span>

          <span>:</span>

          <span
            style={{
              color: '#111',
              fontWeight: 500,
            }}
          >
            {safe(open_payroll) || '-'}
          </span>
        </div>

        {!open_payroll && (
          <div
            style={{
              color: '#ff4d4f',
              fontSize: 11,
              marginTop: 5,
            }}
          >
            * Please Select Open Payroll
          </div>
        )}
      </div>

      {/* DOCUMENTS */}
      <div
        style={{
          ...cardStyle,
          padding: '10px 16px 12px',
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          Other Information
        </div>

        <DocumentRow
          label="Identity Card/Passport"
          onClick={() =>
            handleOpen({
              value: 'id_card',
              label:
                'Identity Card/Passport',
              file: id_card_file || '',
            })
          }
        />

        <DocumentRow
          label="CV"
          onClick={() =>
            handleOpen({
              value: 'cv',
              label: 'CV',
              file: cv_file || '',
            })
          }
        />

        <DocumentRow
          label="Driver License"
          onClick={() =>
            handleOpen({
              value: 'driver_license',
              label: 'Driver License',
              file:
                driver_license_file || '',
            })
          }
        />

        <DocumentRow
          label="Other"
          onClick={() =>
            handleOpen({
              value: 'others',
              label: 'Others',
              files: Array.isArray(
                others_file
              )
                ? others_file
                : [],
            })
          }
        />

        <UpdateFile
          open_modal_file={open_modal_file}
          setOpenModalFile={
            setOpenModalFile
          }
          documents={documents}
        />
      </div>
    </div>
  );
};

export default OtherInfo;
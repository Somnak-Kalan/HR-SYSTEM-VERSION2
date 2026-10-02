// import { Col, Row, Skeleton } from 'antd';
// import dayjs from 'dayjs';
// import ProfileImage from './ProfileImage';
// import UpdatePersonalInfo from './Edit/UpdatePersonalInfo';
// import InfoField from '../../../../components/employee/detail/InfoField';

// const safe = (value) => {
//   if (value === undefined || value === null) return '';
//   if (value === 'undefined') return '';
//   return value;
// };

// const formatDate = (value) => {
//   return value ? dayjs(value).format('YYYY-MM-DD') : '';
// };

// const getAddressText = (address, key) => {
//   if (!address) return '';

//   const nested = address?.[key] || {};

//   const kh = address?.[`${key}_kh`] || nested?.[`${key}_kh`] || nested?.kh || nested?.name_kh || '';

//   const en = address?.[`${key}_en`] || nested?.[`${key}_en`] || nested?.en || nested?.name_en || '';

//   return [kh, en].filter(Boolean).join(' ');
// };

// const PersonalInfo = (props) => {
//   const { loading, personal_info, profile_photo } = props;

//   if (loading && !personal_info) return <Skeleton active />;

//   const p = personal_info || {};
//   const address = p.address || {};

//   const provinceText = getAddressText(address, 'province');
//   const districtText = getAddressText(address, 'district');
//   const communeText = getAddressText(address, 'commune');
//   const villageText = getAddressText(address, 'village');

//   return (
//     <div className="block w-full">
//       <Row>
//         <Col xl={4} xxl={4} className="xl:text-center self-center overflow-hidden w-full">
//           <div className="flex text-center xl:justify-center">
//             <ProfileImage profile_photo={profile_photo} />
//           </div>
//         </Col>

//         <Col xl={20} xxl={20} className="w-full rounded-lg">
//           <div className="py-5 shadow-md rounded-lg overflow-hidden">
//             <Row>
//               <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3 lg:mx-3 xl:mx-4">
//                 <InfoField label="First Name(Khmer)" value={safe(p.first_name)} />
//               </Col>

//               <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//                 <InfoField label="Last Name(Khmer)" value={safe(p.last_name)} />
//               </Col>

//               <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//                 <InfoField label="Gender" value={safe(p.gender)} />
//               </Col>

//               <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//                 <InfoField label="First Name" value={safe(p.first_name_latin)} />
//               </Col>

//               <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//                 <InfoField label="Last Name" value={safe(p.last_name_latin)} />
//               </Col>

//               <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//                 <InfoField label="Date Of Birth" value={formatDate(p.dob)} />
//               </Col>

//               <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//                 <InfoField label="Marital Status" value={safe(p.marital_status)} />
//               </Col>

//               <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//                 <InfoField label="Phone Number" value={safe(p.phone_number)} />
//               </Col>

//               <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//                 <InfoField label="Emergency Phone" value={safe(p.emergency_phone)} />
//               </Col>
//             </Row>

//             <Row className="flex justify-end">
//               <Col className="mx-10 py-3">
//                 <UpdatePersonalInfo personal_info={personal_info} />
//               </Col>
//             </Row>
//           </div>
//         </Col>
//       </Row>

//       <div className="my-5 shadow-md rounded-lg overflow-hidden">
//         <Row>
//           <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//             <InfoField label="Identity Card ID" value={safe(p.identity_card_id)} />
//           </Col>

//           <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//             <InfoField label="Identity Card From" value={safe(p.identity_card_from)} />
//           </Col>

//           <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//             <InfoField label="Identity Card Start" value={formatDate(p.identity_card_date_from)} />
//           </Col>

//           <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//             <InfoField label="Identity Card End" value={formatDate(p.identity_card_date_to)} />
//           </Col>

//           <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//             <InfoField label="Email" value={safe(p.email)} />
//           </Col>

//           <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//             <InfoField label="City/Province" value={provinceText} />
//           </Col>

//           <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//             <InfoField label="District" value={districtText} />
//           </Col>

//           <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//             <InfoField label="Commune" value={communeText} />
//           </Col>

//           <Col xs={24} sm={24} md={10} lg={11} xl={7} xxl={7} className="md:mx-3">
//             <InfoField label="Village" value={villageText} />
//           </Col>

//           <Col xs={24} sm={24} className="md:mx-3 pb-5">
//             <InfoField label="Place Of Birth" value={safe(p.pob)} />
//           </Col>
//         </Row>
//       </div>
//     </div>
//   );
// };

// export default PersonalInfo;
import { Skeleton, Button, theme } from 'antd';

import {
  EditOutlined,
  WomanOutlined,
  ManOutlined,
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';

import dayjs from 'dayjs';

import ProfileImage from './ProfileImage';
import UpdatePersonalInfo from './Edit/UpdatePersonalInfo';
import CalendarIcon from '../../../../assets/icons/calender.svg'
import CallIcon from '../../../../assets/icons/call.svg'
import EditIcon from '../../../../assets/icons/white_edit.svg'
const safe = (value) => {
  if (value === undefined || value === null || value === 'undefined') {
    return '';
  }

  return value;
};

const formatDate = (value) => {
  if (!value) return '';

  return dayjs(value).format('DD-MMM-YYYY');
};

const getAddressText = (address, key) => {
  if (!address) return '';

  const nested = address?.[key] || {};

  const kh = address?.[`${key}_kh`] || nested?.[`${key}_kh`] || nested?.kh || nested?.name_kh || '';

  const en = address?.[`${key}_en`] || nested?.[`${key}_en`] || nested?.en || nested?.name_en || '';

  return [kh, en].filter(Boolean).join(' ');
};

const DetailRow = ({ label, value }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '165px 12px 1fr',
        alignItems: 'start',
        fontSize: 13,
        lineHeight: '22px',
      }}
    >
      <span
        style={{
          color: '#666',
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: '#333',
        }}
      >
        :
      </span>

      <span
        style={{
          color: '#111',
          fontWeight: 500,
          wordBreak: 'break-word',
        }}
      >
        {value || '-'}
      </span>
    </div>
  );
};

const PersonalInfo = ({ loading, personal_info, profile_photo }) => {
  const {
    token: { colorBgContainer, colorBorderSecondary, colorText },
  } = theme.useToken();

  if (loading && !personal_info) {
    return <Skeleton active />;
  }

  const p = personal_info || {};
  const address = p.address || {};

  const provinceText = getAddressText(address, 'province');

  const districtText = getAddressText(address, 'district');

  const communeText = getAddressText(address, 'commune');

  const villageText = getAddressText(address, 'village');
  const currentLocation = [villageText, communeText, districtText, provinceText].filter(Boolean).join(', ');
  const khmerName = [safe(p.last_name), safe(p.first_name)].filter(Boolean).join(' ');
  const latinName = [safe(p.first_name_latin), safe(p.last_name_latin)].filter(Boolean).join(' ');

  const gender =
    String(p.gender || '').toLowerCase() === 'female'
      ? 'female'
      : String(p.gender || '').toLowerCase() === 'male'
        ? 'male'
        : safe(p.gender);
  return (
    <div
      style={{
        background: colorBgContainer,
        border: `1px solid ${colorBorderSecondary}`,
        borderRadius: 12,
        padding: '12px 22px 16px',
        color: colorText,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 15,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            marginLeft: '48px'
          }}

        >
          Personal Information
        </div>

        <UpdatePersonalInfo
          personal_info={personal_info}
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
      {/* TOP PROFILE */}
      <div
        className="personal-info-top"
        style={{
          display: 'grid',
          gridTemplateColumns: '220px minmax(0, 1fr)',
          gap: 42,
          alignItems: 'center',
          padding: '8px 15px 17px',
        }}
      >
        {/* LEFT - PHOTO + NAME */}
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ProfileImage
            firstName={safe(p.first_name_latin)}
            lastName={safe(p.last_name_latin)}
            profile_photo={profile_photo}
          />

          {/* Khmer Name */}
          <div
            style={{
              marginTop: 15,
              fontSize: 15,
              fontWeight: 600,
              lineHeight: '22px',

              color: colorText,

              textAlign: 'center',
            }}
          >
            {khmerName || '-'}
          </div>

          {/* English Name */}
          <div
            style={{
              marginTop: 3,
              fontSize: 14,
              fontWeight: 400,
              lineHeight: '21px',

              color: '#333',

              textAlign: 'center',
            }}
          >
            {latinName || '-'}
          </div>
        </div>

        {/* RIGHT - BASIC INFORMATION */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minWidth: 0,
          }}
          className=''
        >
          {/* Gender */}
          <div classNam e="profile-mini-row">
            <span>{gender === 'female' ? <WomanOutlined /> : <ManOutlined />}</span>

            <span className='mx-2 md:mx-3'>:</span>

            <span>{gender || '-'}</span>
          </div>

          {/* DOB */}
          <div className="profile-mini-row">
            <img src={CalendarIcon} alt="" />
            <span>:</span>

            <span>{formatDate(p.dob) || '-'}</span>
          </div>

          {/* Email */}
          {/* <div className="profile-mini-row">
            <MailOutlined />

            <span>:</span>

            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={safe(p.email)}
            >
              {safe(p.email) || '-'}
            </span>
          </div> */}

          {/* Phone */}
          <div className="profile-mini-row">
            <img src={CallIcon} alt="" />

            <span>:</span>

            <span>{safe(p.phone_number) || '-'}</span>
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div
        style={{
          borderTop: `1px solid ${colorBorderSecondary}`,
          marginBottom: 10,
        }}
      />

      {/* BOTTOM INFORMATION */}
      <DetailRow label="Marital Status" value={safe(p.marital_status)} />

      <DetailRow label="Identity Card ID" value={safe(p.identity_card_id)} />

      <DetailRow label="Place Of Birth" value={safe(p.pob)} />

      <DetailRow label="Current Location" value={currentLocation} />

      <style>
        {`
    .profile-mini-row {
      display: grid;

      grid-template-columns:
        24px 18px minmax(0, 1fr);

      align-items: center;

      min-height: 34px;

      font-size: 15px;
      line-height: 22px;

      color: #111;
    }

    .profile-mini-row .anticon {
      color: #666;

      font-size: 15px;

      display: flex;
      align-items: center;
      justify-content: center;
    }

    @media (max-width: 700px) {
      .personal-info-top {
        grid-template-columns: 1fr !important;
        gap: 20px !important;
      }

      .profile-mini-row {
        font-size: 13px;

        grid-template-columns:
          22px 14px minmax(0, 1fr);
      }
    }
  `}
      </style>
    </div>
  );
};

export default PersonalInfo;

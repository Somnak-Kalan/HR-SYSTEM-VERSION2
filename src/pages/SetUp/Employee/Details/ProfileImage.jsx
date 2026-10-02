import React from 'react';

import {
  Avatar,
  Badge,
  theme,
} from 'antd';

import {
  UserOutlined,
  CameraFilled,
} from '@ant-design/icons';

import { getFile } from '../../../../utils/helpFuntions';
import EditProfileImage from './Edit/UpdateProfilePhoto';

const ProfileImage = ({
  profile_photo,
  firstName,
  lastName,
}) => {
  const {
    token: {
      colorBgContainer,
    },
  } = theme.useToken();

  const imageUrl = profile_photo
    ? getFile(profile_photo)
    : '';

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <EditProfileImage
        firstName={firstName}
        lastName={lastName}
        profile_photo={profile_photo}
        trigger={
          <Badge
            count={
              <div
                style={{
                  width: 28,
                  height: 28,

                  borderRadius: '50%',

                  background: '#d9d9d9',

                  border: `3px solid ${colorBgContainer}`,

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',

                  cursor: 'pointer',

                  boxSizing: 'border-box',
                }}
              >
                <CameraFilled
                  style={{
                    color: '#ffffff',
                    fontSize: 12,
                  }}
                />
              </div>
            }
            offset={[-3, 91]}
          >
            <Avatar
              size={106}
              src={
                imageUrl
                  ? imageUrl
                  : undefined
              }
              icon={
                !imageUrl
                  ? <UserOutlined />
                  : undefined
              }
              style={{
                background: '#dbeafe',
                color: '#0958d9',

                fontWeight: 600,
                fontSize: 27,

                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          </Badge>
        }
      />
    </div>
  );
};

export default ProfileImage;
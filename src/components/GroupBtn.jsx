import {
  SaveOutlined,
  CloseOutlined,
  LeftOutlined,
  EditOutlined,
  PrinterOutlined,
  UploadOutlined,
  UnlockOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  KeyOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Button, Space, Tooltip } from 'antd';
import { useEffect, useMemo, useState } from 'react';

const GroupBtn = (props) => {
  const {
    loadingBtnState,

    // back btn
    backBtn,
    showBackBtn,
    onBackBtnClick,

    // save btn
    saveBtn,
    showSaveBtn,
    onSaveBtnClick,

    // edit btn
    editBtn,
    showEditBtn,
    onEditBtnClick,

    // view btn
    viewBtn,
    showViewBtn,
    onViewBtnClick,

    // print btn
    printBtn,
    showPrintBtn,
    onPrintBtnClick,

    // export btn
    exportBtn,
    showExportBtn,
    onExportBtnClick,

    // unlock btn
    unlockBtn,
    showUnlockBtn,
    onUnlockBtnClick,

    // qr code btn
    qrCodeBtn,
    showQRCode,
    onQRCodeBtnClick,

    // update btn
    updateBtn,
    showUpdateBtn,
    onUpdateBtnClick,

    // delete btn
    deleteBtn,
    showDeleteBtn,
    onDeleteBtnClick,

    // reset btn
    resetBtn,
    showResetBtn,
    onResetBtnClick,

    // disable btn
    disabledBtn,
    showDisableBtn,
    onDisableBtn,

    // enable btn
    enableBtn,
    showEnableBtn,
    onEnableBtn,

    // change password btn
    changePasswordBtn,
    showChangePasswordBtn,
    onChangePasswordBtn,

    // reset device id btn
    resetDeviceId,
    showResetDeviceId,
    onResetDeviceId,

    // resign btn
    resignBtn,
    showResignBtn,
    onResignBtn,

    // custom btn
    customBtn,
    showCustomBtn,
    customBtnText,
    customBtnIcon,

    customButtons = [],

    // fallback color
    customBtnBgColor = '#ffffff',
    customBtnTextColor = '#6B7280',
    customBtnBorderColor = '#000000',

    // light mode color
    customBtnLightBgColor,
    customBtnLightTextColor,
    customBtnLightBorderColor,

    // dark mode color
    customBtnDarkBgColor = '#6B7280',
    customBtnDarkTextColor = '#ffffff',
    customBtnDarkBorderColor,

    customBtnStyle = {},
    onCustomBtnClick,
  } = props;

  // Use your app/system theme from ContentLayout:
  // document.documentElement.setAttribute('data-theme', 'dark' | 'light')
  const getSystemThemeMode = () => {
    if (typeof document === 'undefined') {
      return localStorage.getItem('vts-theme-mode') || 'dark';
    }

    const htmlTheme = document.documentElement.getAttribute('data-theme');
    const bodyTheme = document.body?.getAttribute('data-theme');

    return htmlTheme || bodyTheme || localStorage.getItem('vts-theme-mode') || 'dark';
  };

  const [themeMode, setThemeMode] = useState(getSystemThemeMode);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const updateThemeMode = () => {
      setThemeMode(getSystemThemeMode());
    };

    updateThemeMode();

    const observer = new MutationObserver(updateThemeMode);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    if (document.body) {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const isDarkMode = themeMode === 'dark';

  const themeColor = useMemo(
    () => ({
      primary: '#0a4199',
      primaryText: isDarkMode ? '#ffffff' : '#0a4199',
      danger: '#fb4d4fff',
      dangerText: '#ff0000',
      success: '#22C55E',
      disabledBg: 'gray',
      darkBg: '#1f1f1f',
      darkBorder: '#3a3a3a',
      white: '#ffffff',
    }),
    [isDarkMode]
  );

  const normalButtonStyle = (enabled) => ({
    color: enabled ? themeColor.primaryText : undefined,
    backgroundColor: isDarkMode ? themeColor.darkBg : undefined,
    borderColor: isDarkMode ? themeColor.darkBorder : undefined,
  });

  const darkTextButtonStyle = (enabled) => ({
    color: enabled ? (isDarkMode ? themeColor.white : undefined) : undefined,
    backgroundColor: isDarkMode ? themeColor.darkBg : undefined,
    borderColor: isDarkMode ? themeColor.darkBorder : undefined,
  });

  const customButtonStyle = (enabled) => {
    const bgColor = isDarkMode ? customBtnDarkBgColor || customBtnBgColor : customBtnLightBgColor || customBtnBgColor;

    const textColor = isDarkMode
      ? customBtnDarkTextColor || customBtnTextColor
      : customBtnLightTextColor || customBtnTextColor;

    const borderColor = isDarkMode
      ? customBtnDarkBorderColor || customBtnBorderColor
      : customBtnLightBorderColor || customBtnBorderColor;

    return {
      color: enabled ? textColor : undefined,
      backgroundColor: enabled ? bgColor : undefined,
      borderColor: enabled ? borderColor : undefined,
      ...customBtnStyle,
    };
  };

  return (
    <div
      style={{
        zIndex: '999',
        colorScheme: isDarkMode ? 'dark' : 'light',
      }}>
      <Space>
        {showBackBtn ? (
          <Tooltip placement="bottom" title="Back">
            <Button
              loading={loadingBtnState}
              style={{
                backgroundColor: !backBtn ? themeColor.disabledBg : themeColor.primary,
                color: themeColor.white,
                borderColor: !backBtn ? themeColor.disabledBg : themeColor.primary,
              }}
              icon={<LeftOutlined />}
              disabled={!backBtn}
              onClick={onBackBtnClick}
            />
          </Tooltip>
        ) : null}

        {showSaveBtn ||
          showEditBtn ||
          showViewBtn ||
          showPrintBtn ||
          showExportBtn ||
          showUnlockBtn ||
          showUpdateBtn ||
          showDisableBtn ||
          showEnableBtn ||
          showResetDeviceId ||
          showChangePasswordBtn ||
          showQRCode ||
          showCustomBtn ||
          showResignBtn ||
          showDeleteBtn ? (
          <Space>
            {showSaveBtn ? (
              <Button
                loading={loadingBtnState}
                type="primary"
                icon={<SaveOutlined />}
                disabled={!saveBtn}
                onClick={onSaveBtnClick}>
                Save
              </Button>
            ) : null}

            {showEditBtn ? (
              <Button
                loading={loadingBtnState}
                style={{
                  ...normalButtonStyle(editBtn),
                }}
                icon={<EditOutlined />}
                disabled={!editBtn}
                onClick={onEditBtnClick}>
                Edit
              </Button>
            ) : null}
            {customButtons.length > 0 &&
              customButtons.map((btn, index) => (
                <Button

                  key={index}

                  loading={loadingBtnState}

                  icon={btn.icon}

                  disabled={!btn.enabled}

                  style={{

                    backgroundColor:
                      !btn.enabled === false && btn.bgColor || undefined,

                    color:
                      !btn.enabled === false && btn.textColor || undefined,

                    borderColor:
                      !btn.enabled === false && btn.borderColor || undefined,

                  }}

                  onClick={btn.onClick}

                >

                  {btn.text}

                </Button>

              ))}
            {showViewBtn ? (
              <Button
                loading={loadingBtnState}
                style={{
                  ...normalButtonStyle(viewBtn),
                }}
                icon={<EditOutlined />}
                disabled={!viewBtn}
                onClick={onViewBtnClick}>
                View
              </Button>
            ) : null}

            {showPrintBtn ? (
              <Button
                loading={loadingBtnState}
                style={{
                  ...normalButtonStyle(printBtn),
                }}
                icon={<PrinterOutlined />}
                disabled={!printBtn}
                onClick={onPrintBtnClick}>
                Print
              </Button>
            ) : null}

            {showExportBtn ? (
              <Button
                loading={loadingBtnState}
                style={{
                  ...normalButtonStyle(exportBtn),
                }}
                icon={<UploadOutlined />}
                disabled={!exportBtn}
                onClick={onExportBtnClick}>
                Export
              </Button>
            ) : null}

            {showUnlockBtn ? (
              <Button
                loading={loadingBtnState}
                style={{
                  ...normalButtonStyle(unlockBtn),
                }}
                icon={<UnlockOutlined />}
                disabled={!unlockBtn}
                onClick={onUnlockBtnClick}>
                Unlock
              </Button>
            ) : null}

            {showUpdateBtn ? (
              <Button
                loading={loadingBtnState}
                style={{
                  ...normalButtonStyle(updateBtn),
                }}
                icon={<CheckCircleOutlined />}
                disabled={!updateBtn}
                onClick={onUpdateBtnClick}>
                Update
              </Button>
            ) : null}

            {showDeleteBtn ? (
              <Button
                loading={loadingBtnState}
                type="primary"
                style={{
                  backgroundColor: !deleteBtn ? undefined : themeColor.danger,
                  color: !deleteBtn ? undefined : themeColor.white,
                  borderColor: !deleteBtn ? undefined : themeColor.danger,
                }}
                icon={<DeleteOutlined />}
                disabled={!deleteBtn}
                onClick={onDeleteBtnClick}>
                Delete
              </Button>
            ) : null}


          </Space>
        ) : null}

        {showResetBtn ? (
          <Tooltip placement="bottom" title="Reset">
            <Button
              loading={loadingBtnState}
              style={{
                backgroundColor: !resetBtn ? themeColor.disabledBg : themeColor.primary,
                color: themeColor.white,
                borderColor: !resetBtn ? themeColor.disabledBg : themeColor.primary,
              }}
              icon={<CloseOutlined />}
              disabled={!resetBtn}
              onClick={onResetBtnClick}
            />
          </Tooltip>
        ) : null}

        {showQRCode ? (
          <Button
            loading={loadingBtnState}
            style={{
              ...normalButtonStyle(qrCodeBtn),
            }}
            icon={<DownloadOutlined />}
            disabled={!qrCodeBtn}
            onClick={onQRCodeBtnClick}>
            Download QR
          </Button>
        ) : null}

        {showChangePasswordBtn ? (
          <Button
            className="mx-1"
            loading={loadingBtnState}
            style={{
              ...darkTextButtonStyle(changePasswordBtn),
            }}
            icon={<KeyOutlined />}
            disabled={!changePasswordBtn}
            onClick={onChangePasswordBtn}>
            Change Password
          </Button>
        ) : null}
      </Space>

      {showDisableBtn ? (
        <Button
          className="mx-1"
          loading={loadingBtnState}
          style={{
            color: !disabledBtn ? undefined : isDarkMode ? '#ff6b6b' : themeColor.dangerText,
            backgroundColor: isDarkMode ? themeColor.darkBg : undefined,
            borderColor: isDarkMode ? themeColor.darkBorder : undefined,
          }}
          disabled={!disabledBtn}
          onClick={onDisableBtn}>
          Change Status
        </Button>
      ) : null}

      {showEnableBtn ? (
        <Button
          className="mx-1"
          loading={loadingBtnState}
          style={{
            color: !enableBtn ? undefined : themeColor.success,
            backgroundColor: isDarkMode ? themeColor.darkBg : undefined,
            borderColor: isDarkMode ? themeColor.darkBorder : undefined,
          }}
          disabled={!enableBtn}
          onClick={onEnableBtn}>
          Enable
        </Button>
      ) : null}

      {showResetDeviceId ? (
        <Button
          className="mx-1"
          loading={loadingBtnState}
          style={{
            ...darkTextButtonStyle(resetDeviceId),
          }}
          icon={<SyncOutlined />}
          disabled={!resetDeviceId}
          onClick={onResetDeviceId}>
          Reset Device ID
        </Button>
      ) : null}

      {showResignBtn ? (
        <Button
          className="mx-1"
          loading={loadingBtnState}
          style={{
            ...darkTextButtonStyle(resignBtn),
          }}
          icon={<SyncOutlined />}
          disabled={!resignBtn}
          onClick={onResignBtn}>
          Resign
        </Button>
      ) : null}
    </div>
  );
};
export default GroupBtn;
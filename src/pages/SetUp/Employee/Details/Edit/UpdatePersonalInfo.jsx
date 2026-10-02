import { useCallback, useContext, useEffect, useState } from 'react';
import { Card, Modal, Form, Button, Select, Input, DatePicker, Row, Col, Flex, message } from 'antd';
import { CloseCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import AddressOptServices from '../../../../../services/options/address';
import { useEmployeeDetailStore } from '../../../../../stores/employeeDetail.store';
import { AuthContext } from '../../../../../contexts/AuthContext';
import EditIcon from '../../../../../assets/icons/white_edit.svg';
// Adjust this path only if your modal folder is in a different location.
import AddKeywordModal from '../../modal/AddKeywordModal';
const getOptionArray = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
};
const buildLabel = (...values) => {
  return values.filter(Boolean).join(' - ');
};
const hasValue = (value) => {
  return value !== undefined && value !== null && value !== '';
};
const formatDate = (value) => {
  if (!value) return '';
  return dayjs(value).isValid() ? dayjs(value).format('YYYY-MM-DD') : '';
};
const checkUndefined = (value) => {
  if (value === undefined || value === null) return '';
  if (value === 'undefined' || value === 'null') return '';
  return value;
};
const getOptionValue = (option, idKey) => {
  return option?.value || option?._id || option?.[idKey];
};

const findOptionByValue = (options, value, idKey) => {
  if (!hasValue(value)) return undefined;

  return options.find((el) => {
    const optionValue = getOptionValue(el, idKey);

    const numericId = el?.[idKey];

    return String(optionValue) === String(value) || String(numericId) === String(value);
  });
};

const getAddressValues = (personalInfo) => {
  const currentAddress = personalInfo?.current_address;

  const oldAddress = personalInfo?.address;

  return {
    province:
      currentAddress?.province_id ||
      oldAddress?.province?.value ||
      oldAddress?.province?._id ||
      oldAddress?.province?.province_id ||
      '',

    district:
      currentAddress?.district_id ||
      oldAddress?.district?.value ||
      oldAddress?.district?._id ||
      oldAddress?.district?.district_id ||
      '',

    commune:
      currentAddress?.commune_id ||
      oldAddress?.commune?.value ||
      oldAddress?.commune?._id ||
      oldAddress?.commune?.commune_id ||
      '',

    village:
      currentAddress?.village_id ||
      oldAddress?.village?.value ||
      oldAddress?.village?._id ||
      oldAddress?.village?.village_id ||
      '',
  };
};

const getAddressKhNames = (personalInfo) => {
  const currentAddress = personalInfo?.current_address;

  const oldAddress = personalInfo?.address;

  return {
    provinceKh: currentAddress?.province_kh || oldAddress?.province?.province_kh || '',

    districtKh: currentAddress?.district_kh || oldAddress?.district?.district_kh || '',

    communeKh: currentAddress?.commune_kh || oldAddress?.commune?.commune_kh || '',

    villageKh: currentAddress?.village_kh || oldAddress?.village?.village_kh || '',
  };
};

const UpdatePersonalInfo = (props) => {
  const { personal_info } = props;

  const updatePersonalInfo = useEmployeeDetailStore((s) => s.updatePersonalInfo);

  const loading = useEmployeeDetailStore((s) => s.loading);

  const { username, access_token } = useContext(AuthContext);

  const { id } = useParams();

  const employee_update_id = id;

  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const [open, setOpen] = useState(false);

  const [provinces, setProvinces] = useState([]);

  const [districts, setDistricts] = useState([]);

  const [communes, setCommunes] = useState([]);

  const [villages, setVillages] = useState([]);

  const [provinceKh, setProvinceKh] = useState('');

  const [districtKh, setDistrictKh] = useState('');

  const [communeKh, setCommuneKh] = useState('');

  const [villageKh, setVillageKh] = useState('');

  // Current-address keyword state
  const [openKeyword, setOpenKeyword] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [keywordValue, setKeywordValue] = useState('');

  const isKeywordSelected = !!selectedKeyword;

  const province = Form.useWatch('province', form);
  const district = Form.useWatch('district', form);
  const commune = Form.useWatch('commune', form);

  const canAddKeyword = province && district && commune;

  const showModal = () => setOpen(true);

  const handleCancel = () => setOpen(false);

  const onCloseModal = () => setOpen(false);

  const getProvinceOptions = useCallback(async () => {
    try {
      const res = await AddressOptServices.Get_Province_Otp({ access_token });

      const data = getOptionArray(res);

      setProvinces(data);

      return data;
    } catch (error) {
      console.log(error);

      setProvinces([]);

      return [];
    }
  }, [access_token]);

  const getDistrictOptions = useCallback(
    async (provinceCode) => {
      if (!hasValue(provinceCode)) {
        setDistricts([]);

        return [];
      }

      try {
        const res = await AddressOptServices.Get_District_Otp({
          access_token,

          doc: { id: provinceCode },
        });

        const data = getOptionArray(res);

        setDistricts(data);

        return data;
      } catch (error) {
        console.log(error);

        setDistricts([]);

        return [];
      }
    },

    [access_token]
  );

  const getCommuneOptions = useCallback(
    async (districtCode) => {
      if (!hasValue(districtCode)) {
        setCommunes([]);

        return [];
      }

      try {
        const res = await AddressOptServices.Get_Commune_Otp({
          access_token,

          doc: { id: districtCode },
        });

        const data = getOptionArray(res);

        setCommunes(data);

        return data;
      } catch (error) {
        console.log(error);

        setCommunes([]);

        return [];
      }
    },

    [access_token]
  );

  const getVillageOptions = useCallback(
    async (communeCode) => {
      if (!hasValue(communeCode)) {
        setVillages([]);

        return [];
      }

      try {
        const res = await AddressOptServices.Get_Village_Otp({
          access_token,

          doc: { id: communeCode },
        });

        const data = getOptionArray(res);

        setVillages(data);

        return data;
      } catch (error) {
        console.log(error);

        setVillages([]);

        return [];
      }
    },

    [access_token]
  );

  useEffect(() => {
    if (!open || !personal_info) return;

    const addressValues = getAddressValues(personal_info);

    const addressKhNames = getAddressKhNames(personal_info);

    form.setFieldsValue({
      ...personal_info,

      email: checkUndefined(personal_info?.email),

      emergency_phone: checkUndefined(personal_info?.emergency_phone),

      identity_card_from: checkUndefined(personal_info?.identity_card_from),

      dob: dayjs(personal_info?.dob).isValid() ? dayjs(personal_info?.dob) : null,

      identity_card_date_from: dayjs(personal_info?.identity_card_date_from).isValid()
        ? dayjs(personal_info?.identity_card_date_from)
        : null,

      identity_card_date_to: dayjs(personal_info?.identity_card_date_to).isValid()
        ? dayjs(personal_info?.identity_card_date_to)
        : null,

      province: addressValues.province,

      district: addressValues.district,

      commune: addressValues.commune,

      village: addressValues.village,
    });

    setProvinceKh(addressKhNames.provinceKh);

    setDistrictKh(addressKhNames.districtKh);

    setCommuneKh(addressKhNames.communeKh);

    setVillageKh(addressKhNames.villageKh);
  }, [form, open, personal_info]);

  useEffect(() => {
    if (!open || !access_token) return;

    let cancelled = false;

    const loadAddressOptions = async () => {
      const addressValues = getAddressValues(personal_info);

      const provinceOptions = await getProvinceOptions();

      if (cancelled) return;

      const provinceOption = findOptionByValue(provinceOptions, addressValues.province, 'province_id');

      const provinceValue = getOptionValue(provinceOption, 'province_id') || addressValues.province;

      if (hasValue(provinceValue)) {
        form.setFieldValue('province', provinceValue);

        const districtOptions = await getDistrictOptions(provinceValue);

        if (cancelled) return;

        const districtOption = findOptionByValue(districtOptions, addressValues.district, 'district_id');

        const districtValue = getOptionValue(districtOption, 'district_id') || addressValues.district;

        if (hasValue(districtValue)) {
          form.setFieldValue('district', districtValue);

          const communeOptions = await getCommuneOptions(districtValue);

          if (cancelled) return;

          const communeOption = findOptionByValue(communeOptions, addressValues.commune, 'commune_id');

          const communeValue = getOptionValue(communeOption, 'commune_id') || addressValues.commune;

          if (hasValue(communeValue)) {
            form.setFieldValue('commune', communeValue);

            const villageOptions = await getVillageOptions(communeValue);

            if (cancelled) return;

            const villageOption = findOptionByValue(villageOptions, addressValues.village, 'village_id');

            const villageValue = getOptionValue(villageOption, 'village_id') || addressValues.village;

            if (hasValue(villageValue)) {
              form.setFieldValue('village', villageValue);
            }
          }
        }
      }
    };

    loadAddressOptions();

    return () => {
      cancelled = true;
    };
  }, [
    open,

    access_token,

    personal_info,

    form,

    getProvinceOptions,

    getDistrictOptions,

    getCommuneOptions,

    getVillageOptions,
  ]);

  const onChangeProvince = (value, option) => {
    setProvinceKh(option?.province_kh || '');

    form.setFieldsValue({
      district: null,

      commune: null,

      village: null,
    });

    setDistrictKh('');

    setCommuneKh('');

    setVillageKh('');

    setDistricts([]);

    setCommunes([]);

    setVillages([]);

    if (hasValue(value)) {
      getDistrictOptions(value);
    }
  };

  const onChangeDistrict = (value, option) => {
    setDistrictKh(option?.district_kh || '');

    form.setFieldsValue({
      commune: null,

      village: null,
    });

    setCommuneKh('');

    setVillageKh('');

    setCommunes([]);

    setVillages([]);

    if (hasValue(value)) {
      getCommuneOptions(value);
    }
  };

  const onChangeCommune = (value, option) => {
    setCommuneKh(option?.commune_kh || '');

    form.setFieldsValue({
      village: null,
    });

    setVillageKh('');

    setVillages([]);

    if (hasValue(value)) {
      getVillageOptions(value);
    }
  };

  const onChangeVillage = (value, option) => {
    setVillageKh(option?.village_kh || '');
  };

  const searchLocationKeyword = async (keyword) => {
    if (!keyword?.trim()) return;

    try {
      const result = await AddressOptServices.Search_Location_Keyword({
        access_token,
        keyword: keyword.trim(),
      });

      const data = result?.data;

      if (!data) {
        messageApi.warning('Location keyword not found');
        return;
      }

      setSelectedKeyword(data);
      setKeywordValue(keyword.trim());

      form.setFieldsValue({
        province: data.province_id,
        district: data.district_id,
        commune: data.commune_id,
        village: null,
        location_keyword: keyword.trim(),
        location_description: data.description || '',
      });
    } catch (error) {
      console.log('search location keyword error:', error);
      messageApi.error(
        error?.response?.data?.message ||
        error?.response?.data?.msg ||
        error?.message ||
        'Search location keyword failed'
      );
    }
  };

  const onFinish = async (values) => {
    try {
      const {
        first_name,

        last_name,

        nation,

        first_name_latin,

        last_name_latin,

        gender,

        dob,

        pob,

        email,

        marital_status,

        phone_number,

        emergency_phone,

        identity_card_date_from,

        identity_card_date_to,

        identity_card_from,

        identity_card_id,

        province,

        district,

        commune,
        location_description,
        location_keyword,
      } = values;

      const doc = {
        id: employee_update_id || undefined,

        jsonData: {
          first_name,

          last_name,

          first_name_latin,

          last_name_latin,

          gender,

          dob: formatDate(dob),

          marital_status,

          nation,

          identity_card_id,

          identity_card_from: identity_card_from || '',

          identity_card_date_from: formatDate(identity_card_date_from),

          identity_card_date_to: formatDate(identity_card_date_to),

          phone_number,

          email: email || '',

          emergency_phone: emergency_phone || '',

          pob,

          current_address: {
            province_id: province,

            district_id: district,

            commune_id: commune,
            location_description: location_description || '',
            location_keyword: location_keyword || keywordValue || '',
          },
        },
      };

      const ok = await updatePersonalInfo({ doc, access_token });

      if (ok) {
        messageApi.success('Update Success');

        setOpen(false);
      } else {
        messageApi.warning('Update Fail');
      }
    } catch (error) {
      console.log('update personal info error:', error);

      console.log('backend response:', error?.response?.data);

      messageApi.error(error?.response?.data?.message || error?.response?.data?.msg || error?.message || 'Update Fail');
    }
  };

  const onFinishFailed = () => { };

  return (
    <>
      {contextHolder}

      <div>
        <Button
          type="primary"

          icon={<img src={EditIcon} />}

          onClick={showModal}

          style={{
            width: 28,

            height: 28,

            minWidth: 28,

            padding: 4,

            display: 'flex',

            alignItems: 'center',

            justifyContent: 'center',

            borderRadius: 6,

            background: '#fa8c16',

            borderColor: '#fa8c16',

            boxShadow: 'none',
          }}
        />
      </div>

      <Modal open={open} onCancel={handleCancel} footer="" width="65vw" closable={false}>
        <Card
          title="Update Personal Information"

          extra={
            <CloseCircleOutlined
              onClick={onCloseModal}

              className="cursor-pointer"

              style={{ fontSize: '20px', color: 'red' }}
            />
          }
        >
          <AddKeywordModal
            open={openKeyword}
            setOpen={setOpenKeyword}
            province={province}
            district={district}
            commune={commune}
            provinces={provinces}
            districts={districts}
            communes={communes}
            onSave={(data) => {
              setSelectedKeyword(data);
              setKeywordValue(data.keyword_name || '');

              form.setFieldsValue({
                location_keyword: data.keyword_name || '',
                location_description: data.description || '',
              });
            }}
          />

          <Form
            form={form}

            name="edit_personal_info"

            onFinish={onFinish}

            onFinishFailed={onFinishFailed}

            autoComplete="off"

            className="flex justify-center"
          >
            <div>
              <Form.Item hidden name="id">
                <Input />
              </Form.Item>

              <Row gutter={[8, 2]}>
                <Col className="my-2" xs={24} sm={24} md={12} lg={8}>
                  <Form.Item
                    label="First Name"

                    labelCol={{ span: 24 }}

                    name="first_name_latin"

                    className="m-0 p-0"

                    rules={[{ required: true, message: 'field require' }]}
                  >
                    <Input placeholder="First name latin" />
                  </Form.Item>
                </Col>

                <Col className="my-2" xs={24} sm={24} md={12} lg={8}>
                  <Form.Item
                    label="Last Name"

                    labelCol={{ span: 24 }}

                    name="last_name_latin"

                    className="m-0 p-0"

                    rules={[{ required: true, message: 'field require!' }]}
                  >
                    <Input placeholder="Last name latin" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12} lg={8} className="my-2">
                  <Form.Item
                    label="First Name Khmer"

                    labelCol={{ span: 24 }}

                    name="first_name"

                    className="m-0 p-0"

                    rules={[{ required: true, message: 'field require!' }]}
                  >
                    <Input placeholder="First Name Khmer" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12} lg={8} className="my-2">
                  <Form.Item
                    label="Last Name Khmer"

                    labelCol={{ span: 24 }}

                    name="last_name"

                    className="m-0 p-0"

                    rules={[{ required: true, message: 'field require!' }]}
                  >
                    <Input placeholder="Last Name Khmer" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12} lg={8} className="my-2">
                  <Form.Item
                    label="Gender"

                    name="gender"

                    labelCol={{ span: 24 }}

                    className="m-0 p-0"

                    rules={[{ required: true, message: 'field require!' }]}
                  >
                    <Select
                      placeholder="Gender"

                      options={[
                        { value: 'male', label: 'Male' },

                        { value: 'female', label: 'Female' },
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12} lg={8} className="my-2">
                  <Form.Item
                    label="Date Of Birth"

                    labelCol={{ span: 24 }}

                    name="dob"

                    className="m-0 p-0"

                    rules={[{ required: true, message: 'field require' }]}
                  >
                    <DatePicker placeholder="YYYY-MM-DD" className="w-full" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12} lg={8} className="my-2">
                  <Form.Item
                    label="Marital Status"

                    labelCol={{ span: 24 }}

                    name="marital_status"

                    className="m-0 p-0"

                    rules={[{ required: true, message: 'field require!' }]}
                  >
                    <Select
                      placeholder="Marital Status"

                      options={[
                        { value: 'single', label: 'Single' },

                        { value: 'marriage', label: 'Marriage' },
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12} lg={8} className="my-2">
                  <Form.Item
                    label="Nation"

                    labelCol={{ span: 24 }}

                    name="nation"

                    className="m-0 p-0"

                    rules={[{ required: true, message: 'field require!' }]}
                  >
                    <Input placeholder="Nation" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12} lg={8} className="my-2">
                  <Form.Item
                    label="Identity Card ID"

                    labelCol={{ span: 24 }}

                    name="identity_card_id"

                    className="m-0 p-0"

                    rules={[{ required: true, message: 'field require!' }]}
                  >
                    <Input placeholder="Identity Card ID" />
                  </Form.Item>
                </Col>
                {/* 
                <Col xs={24} sm={24} md={12} lg={8} className="my-2">
                  <Form.Item
                    label="Identity Card From"

                    labelCol={{ span: 24 }}

                    name="identity_card_from"

                    className="m-0 p-0"
                  >
                    <Input placeholder="Identity Card From" />
                  </Form.Item>
                </Col> */}

                {/* <Col xs={24} sm={24} md={12} lg={8} className="my-2">
                  <Form.Item
                    label="Identity Card Date From"

                    labelCol={{ span: 24 }}

                    name="identity_card_date_from"

                    className="m-0 p-0"
                  >
                    <DatePicker className="w-full" placeholder="YYYY-MM-DD" />
                  </Form.Item>
                </Col> */}

                {/* <Col xs={24} sm={24} md={12} lg={8} className="my-2">
                  <Form.Item
                    label="Identity Card Date To"

                    labelCol={{ span: 24 }}

                    name="identity_card_date_to"

                    className="m-0 p-0"
                  >
                    <DatePicker className="w-full" placeholder="YYYY-MM-DD" />
                  </Form.Item>
                </Col> */}

                <Col xs={24} sm={24} md={12} lg={8} className="my-2">
                  <Form.Item
                    label="Phone Number"

                    labelCol={{ span: 24 }}

                    name="phone_number"

                    className="m-0 p-0"

                    rules={[{ required: true, message: 'Require phone number!' }]}
                  >
                    <Input placeholder="Phone Number" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12} lg={8} className="my-2">
                  <Form.Item
                    label="Email"

                    labelCol={{ span: 24 }}

                    name="email"

                    className="m-0 p-0"

                    rules={[{ type: 'email' }]}
                  >
                    <Input placeholder="Email" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12} lg={8} className="my-2">
                  <Form.Item label="Emergency Phone" labelCol={{ span: 24 }} name="emergency_phone" className="m-0 p-0">
                    <Input placeholder="Emergency Phone" />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col xs={24} sm={24} md={24} lg={24} className="my-2">
                  <Form.Item
                    label="Place Of Birth"

                    labelCol={{ span: 24 }}

                    name="pob"

                    className="m-0 p-0"

                    rules={[{ required: true, message: 'Field is required!' }]}
                  >
                    <Input placeholder="village - commune - district - province" />
                  </Form.Item>
                </Col>
              </Row>

              <div>
                <Row align="middle" justify="space-between" style={{ marginBottom: 8 }}>
                  <Col xs={24} sm={8} md={8} className="mb-12">
                    <span style={{ fontWeight: 600 }}>
                      <span style={{ color: '#ff4d4f' }}>*</span> Currently Location
                    </span>
                  </Col>

                  <Col xs={24} sm={16} md={16}>
                    <div className="flex items-center">
                      <p>
                        <span
                          style={{
                            color: '#999',
                            marginRight: 8,
                            fontSize: 12,
                          }}
                        >
                          បញ្ចូលទីតាំងស្វែងរក Keyword :
                        </span>
                      </p>

                      <Button
                        icon={<PlusOutlined />}
                        disabled={!canAddKeyword}
                        onClick={() => setOpenKeyword(true)}
                        style={{
                          height: 34,
                          padding: '0 24px',
                          borderRadius: 20,
                          background: canAddKeyword ? '#EFF6FF' : '#f5f5f5',
                          color: canAddKeyword ? '#1677ff' : '#bfbfbf',
                          border: `2px solid ${canAddKeyword ? '#91caff' : '#d9d9d9'}`,
                          fontSize: 16,
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        Add Keyword
                      </Button>
                    </div>

                    <Form.Item name="location_keyword" className="mt-2" >
                      <Input
                        allowClear
                        value={keywordValue}
                        placeholder="Search keyword..."
                        prefix={<SearchOutlined style={{ color: '#999' }} />}
                        onChange={(e) => {
                          const value = e.target.value;
                          setKeywordValue(value);
                          form.setFieldValue('location_keyword', value);
                        }}
                        onClear={() => {
                          setKeywordValue('');
                          setSelectedKeyword(null);

                          form.setFieldsValue({
                            location_keyword: '',
                            province: null,
                            district: null,
                            commune: null,
                            location_description: '',
                          });

                          setProvinceKh('');
                          setDistrictKh('');
                          setCommuneKh('');

                          setDistricts([]);
                          setCommunes([]);
                          setVillages([]);
                        }}
                        onPressEnter={() => {
                          searchLocationKeyword(keywordValue);
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[8, 2]}>
                  <Col xs={24} sm={12} md={12} lg={6}>
                    <Form.Item
                      name="province"
                      label="Province"
                      style={{ marginBottom: 0 }}
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'field require',
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        disabled={isKeywordSelected}
                        optionFilterProp="label"
                        placeholder="Select province"
                        onChange={onChangeProvince}
                        options={provinces.map((el) => ({
                          label: el.label || buildLabel(el.province_en, el.province_kh),
                          value: el.value || el._id,
                          province_id: el.province_id,
                          province_kh: el.province_kh,
                          province_en: el.province_en,
                        }))}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={12} lg={6}>
                    <Form.Item
                      name="district"
                      label="District"
                      style={{ marginBottom: 0 }}
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'field require',
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        optionFilterProp="label"
                        placeholder="Select district"
                        disabled={isKeywordSelected || !districts.length}
                        onChange={onChangeDistrict}
                        options={districts.map((el) => ({
                          label: el.label || buildLabel(el.district_en, el.district_kh),
                          value: el.value || el._id,
                          district_id: el.district_id,
                          district_kh: el.district_kh,
                          district_en: el.district_en,
                        }))}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={12} lg={6}>
                    <Form.Item
                      name="commune"
                      label="Commune"
                      style={{ marginBottom: 0 }}
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: 'field require',
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        disabled={isKeywordSelected || !communes.length}
                        optionFilterProp="label"
                        placeholder="Select commune"
                        onChange={onChangeCommune}
                        options={communes.map((el) => ({
                          label: el.label || buildLabel(el.commune_en, el.commune_kh),
                          value: el.value || el._id,
                          commune_id: el.commune_id,
                          commune_kh: el.commune_kh,
                          commune_en: el.commune_en,
                        }))}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={12} lg={6}>
                    <Form.Item name="location_description" label="Location Description" style={{ marginBottom: 0 }} labelCol={{ span: 24 }} >
                      <Input disabled={isKeywordSelected} placeholder="e.g. Walk Street" />
                    </Form.Item>
                  </Col>
                </Row>

                {isKeywordSelected && (
                  <span className="text-[#00000066]">
                    Location locked by keyword. Search a different keyword to change.
                  </span>
                )}
              </div>

              <Flex justify="right">
                <Form.Item className="m-0 mt-5 p-0">
                  <Button
                    loading={loading}

                    type="primary"

                    htmlType="submit"

                    style={{ background: '#1677ff' }}

                    className="cursor-pointer text-white"
                  >
                    Update
                  </Button>
                </Form.Item>
              </Flex>
            </div>
          </Form>
        </Card>
      </Modal>
    </>
  );
};

export default UpdatePersonalInfo;

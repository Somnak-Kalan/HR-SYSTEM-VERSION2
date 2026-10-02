import { useContext, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Popconfirm, Row, Select, Space, Upload, message } from 'antd';

import { AuthContext } from '../../../contexts/AuthContext';
import AddressOptServices from '../../../services/options/address';
import { useEmployeeStore } from '../../../stores/employee.store';
import AddKeywordModal from './modal/AddKeywordModal';
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const normFile = (e) => {
  if (Array.isArray(e)) return e;
  return e?.fileList || [];
};

const getUploadFile = (fileOrUploadFile) => {
  if (!fileOrUploadFile) return null;
  return fileOrUploadFile.originFileObj || fileOrUploadFile;
};

const formatDate = (value) => {
  if (!value) return '';
  return dayjs(value).isValid() ? dayjs(value).format('YYYY-MM-DD') : '';
};

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

const PersonalInfoForm = (props) => {
  const { form, open, setOpen, setCurrent, btnLoading, imageUrl, setImageUrl, setPersonalInfoDoc } = props;

  const { access_token, username } = useContext(AuthContext);

  const [messageApi, contextHolder] = message.useMessage();
  const submitModeRef = useRef('save_only');
  const fetchedProvinceRef = useRef(false);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [villages, setVillages] = useState([]);

  const [provinceKh, setProvinceKh] = useState('');
  const [districtKh, setDistrictKh] = useState('');
  const [communeKh, setCommuneKh] = useState('');
  const [villageKh, setVillageKh] = useState('');
  //
  const [openKeyword, setOpenKeyword] = useState(false);

  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [keywordValue, setKeywordValue] = useState('');
  const isKeywordSelected = !!selectedKeyword;


  const province = Form.useWatch('province', form);
  const district = Form.useWatch('district', form);
  const commune = Form.useWatch('commune', form);


  const canAddKeyword =
    province &&
    district &&
    commune;
  //
  const addEmployeeOnlyPersonalInfo = useEmployeeStore((s) => s.addEmployeeOnlyPersonalInfo);
  const createLoading = useEmployeeStore((s) => s.create_loading);

  const beforeUploadImage = (file) => {
    if (!file) return Upload.LIST_IGNORE;

    if (file.size > MAX_FILE_SIZE) {
      messageApi.error('File size must be less than 2MB');
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  const handleChange = (info) => {
    const file = getUploadFile(info?.file);

    if (!file) {
      setImageUrl(null);
      return;
    }

    setImageUrl(URL.createObjectURL(file));
  };

  const getProvinceOptions = () => {
    AddressOptServices.Get_Province_Otp({ access_token })
      .then((res) => {
        setProvinces(getOptionArray(res));
      })
      .catch((error) => {
        console.log(error);
        setProvinces([]);
      });
  };

  const getDistrictOptions = (provinceCode) => {
    AddressOptServices.Get_District_Otp({
      access_token,
      doc: { id: provinceCode },
    })
      .then((res) => {
        setDistricts(getOptionArray(res));
      })
      .catch((error) => {
        console.log(error);
        setDistricts([]);
      });
  };

  const getCommuneOptions = (districtCode) => {
    AddressOptServices.Get_Commune_Otp({
      access_token,
      doc: { id: districtCode },
    })
      .then((res) => {
        setCommunes(getOptionArray(res));
      })
      .catch((error) => {
        console.log(error);
        setCommunes([]);
      });
  };

  const getVillageOptions = (communeCode) => {
    AddressOptServices.Get_Village_Otp({
      access_token,
      doc: { id: communeCode },
    })
      .then((res) => {
        setVillages(getOptionArray(res));
      })
      .catch((error) => {
        console.log(error);
        setVillages([]);
      });
  };

  useEffect(() => {
    if (!open || !access_token) return;

    if (fetchedProvinceRef.current) return;
    fetchedProvinceRef.current = true;

    getProvinceOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, access_token]);

  useEffect(() => {
    if (!open) {
      fetchedProvinceRef.current = false;
    }
  }, [open]);
  useEffect(() => {
    if (!open || !access_token) return;

    const provinceId = form.getFieldValue('province');
    const districtId = form.getFieldValue('district');
    const communeId = form.getFieldValue('commune');

    if (provinceId) {
      getDistrictOptions(provinceId);
    }

    if (districtId) {
      getCommuneOptions(districtId);
    }

    if (communeId) {
      getVillageOptions(communeId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, access_token]);
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

    // IMPORTANT:
    // value = ObjectId for submit
    // option.province_id = number for district API
    if (hasValue(option?.value)) {
      getDistrictOptions(option.value);
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

    if (hasValue(option?.value)) {
      getCommuneOptions(option.value);
    }
  };

  const onChangeCommune = (value, option) => {
    setCommuneKh(option?.commune_kh || '');

    form.setFieldsValue({
      village: null,
    });

    setVillageKh('');
    setVillages([]);

    // IMPORTANT:
    // value = ObjectId for submit
    // option.commune_id = number for village API
    if (hasValue(option?.value)) {
      getVillageOptions(option.value);
    }
  };

  const onChangeVillage = (value, option) => {
    setVillageKh(option?.village_kh || '');
  };

  const buildDoc = (values) => {
    const imageFile = getUploadFile(values?.image?.[0]);

    const doc = {
      personal_info: {
        first_name: values.first_name,
        last_name: values.last_name,
        first_name_latin: values.first_name_latin,
        last_name_latin: values.last_name_latin,
        gender: values.gender,
        dob: formatDate(values.dob),
        marital_status: values.marital_status,
        nation: values.nation,
        identity_card_id: values.identity_card_id,
        identity_card_from: values.identity_card_from || '',
        identity_card_date_from: formatDate(values.identity_card_date_from),
        identity_card_date_to: formatDate(values.identity_card_date_to),
        phone_number: values.phone_number,
        email: values.email || '',
        emergency_phone: values.emergency_phone || '',
        pob: values.pob,

        // These are ObjectId values, same as your Postman JSON.
        current_address: {
          province_id: values.province,
          district_id: values.district,
          commune_id: values.commune,
          village_id: values.village,
        },
      },
    };

    return {
      doc,
      imageFile,
    };
  };

  const onFinish = async (values) => {
    const { doc, imageFile } = buildDoc(values);

    setPersonalInfoDoc({
      ...doc,
      images: imageFile,
    });

    //  If user clicks Next, only go to next step. Do NOT save API.
    if (submitModeRef.current === 'next') {
      setCurrent(1);
      return;
    }

    //  Only Save Only Personal Info will reach here
    const formData = new FormData();
    formData.append('doc', JSON.stringify(doc));

    if (imageFile) {
      formData.append('images', imageFile);
    }

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const ok = await addEmployeeOnlyPersonalInfo({
        access_token,
        doc: formData,
      });

      if (ok) {
        messageApi.success('Add success');
        form.resetFields();
        setImageUrl(null);
        setOpen(false);
      } else {
        messageApi.warning('Add fail');
      }
    } catch (error) {
      console.log('submit error:', error);
      console.log('backend response:', error?.response?.data);

      messageApi.error(error?.response?.data?.message || error?.response?.data?.msg || error?.message || 'Add fail');
    }
  };
  const onSaveOnly = () => {
    submitModeRef.current = 'save_only';
    form.submit();
  };

  const onNext = () => {
    submitModeRef.current = 'next';
    form.submit();
  };
  const searchLocationKeyword = async (keyword) => {

    if (!keyword?.trim()) return;


    try {

      const result =
        await AddressOptServices.Search_Location_Keyword({
          access_token,
          keyword
        });


      const data = result?.data;


      if (!data) return;


      setSelectedKeyword(data);

      setKeywordValue(keyword);


      // set address automatically

      form.setFieldsValue({

        province: data.province_id,

        district: data.district_id,

        commune: data.commune_id,

        location_description:
          data.description || '',

      });


    } catch (error) {

      console.log(error);

    }

  };
  return (
    <div>
      {contextHolder}
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


          console.log(
            "saved keyword",
            data
          );


          setSelectedKeyword(data);


          setKeywordValue(
            data.keyword_name
          );


        }}


      />
      <Form
        form={form}
        name="personal_info_form"
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
        initialValues={{
          nation: 'KHMER',
          gender: 'male',
          marital_status: 'single',
        }}
        className='personalInformation'
      >
        <Row gutter={[8, 2]}>
          <Col span={24}>
            <Row gutter={[8, 2]}>
              <Col
                xs={24}
                sm={24}
                md={8}
                align="center"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <span className='text-[#00000066] font-bold mb-2'>Photo</span>
                <Form.Item name="image" valuePropName="fileList" getValueFromEvent={normFile}>
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={beforeUploadImage}
                    onChange={handleChange}
                    accept="image/png,image/jpeg"
                    maxCount={1}
                  >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : <PlusOutlined />}
                  </Upload>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={16}>
                <Row gutter={[8, 2]}>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      name="first_name_latin"
                      label="First Name"
                      rules={[{ required: true, message: 'field require' }]}
                    >
                      <Input placeholder="First Name" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      name="last_name_latin"
                      label="Last Name"
                      rules={[{ required: true, message: 'field require' }]}
                    >
                      <Input placeholder="Last Name" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      name="first_name"
                      label="First Name Khmer"
                      rules={[{ required: true, message: 'field require' }]}
                    >
                      <Input placeholder="First Name Khmer" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      name="last_name"
                      label="Last Name Khmer"
                      rules={[{ required: true, message: 'field require' }]}
                    >
                      <Input placeholder="Last Name Khmer" />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>

          <Col xs={24} sm={24} md={12} lg={8}>
            <Form.Item name="gender" label="Gender" rules={[{ required: true, message: 'field require' }]}>
              <Select
                placeholder="Gender"
                options={[
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12} lg={8}>
            <Form.Item name="dob" label="Date Of Birth" rules={[{ required: true, message: 'field require' }]}>
              <DatePicker placeholder="YYYY-MM-DD" style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12} lg={8}>
            <Form.Item
              name="marital_status"
              label="Marital Status"
              rules={[{ required: true, message: 'field require' }]}
            >
              <Select
                placeholder="Marital Status"
                options={[
                  { label: 'Single', value: 'single' },
                  { label: 'Marriage', value: 'marriage' },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12} lg={8}>
            <Form.Item name="nation" label="Nation" rules={[{ required: true, message: 'field require' }]}>
              <Input placeholder="Nation" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12} lg={8}>
            <Form.Item
              name="identity_card_id"
              label="Identity Card ID"
              rules={[{ required: true, message: 'field require' }]}
            >
              <Input placeholder="Identity Card ID" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12} lg={8}>
            <Form.Item name="phone_number" label="Phone Number" rules={[{ required: true, message: 'field require' }]}>
              <Input placeholder="Phone Number" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12} lg={8}>
            <Form.Item name="emergency_phone" label="Emergency Phone">
              <Input placeholder="Emergency Phone" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="pob" label="Place Of Birth" rules={[{ required: true, message: 'field require' }]}>
              <Input placeholder="village - commune - district - province" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Row
              align="middle"
              justify="space-between"
              style={{
                marginBottom: 8,
              }}
            >
              <Col xs={24} sm={8} md={8} className=' mb-12'>
                <span
                  style={{
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      color: '#ff4d4f',
                    }}
                  >
                    *
                  </span>
                  Currently Location
                </span>
              </Col>

              <Col xs={24} sm={16} md={16} >
                <div className='flex items-center '>
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
                      border: `2px solid ${canAddKeyword ? '#91caff' : '#d9d9d9'
                        }`,
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
                <Form.Item
                  name="location_keyword"
                  className="mt-2"
                >

                  <Input

                    allowClear

                    value={keywordValue}

                    placeholder="Search keyword..."

                    prefix={
                      <SearchOutlined
                        style={{
                          color: '#999'
                        }}
                      />
                    }


                    onChange={(e) => {

                      setKeywordValue(
                        e.target.value
                      );

                    }}


                    onClear={() => {


                      setKeywordValue('');

                      setSelectedKeyword(null);


                      form.setFieldsValue({

                        province: null,

                        district: null,

                        commune: null,

                        location_description: ''

                      });


                      setDistricts([]);

                      setCommunes([]);


                    }}


                    onPressEnter={() => {

                      searchLocationKeyword(
                        keywordValue
                      );

                    }}

                  />

                </Form.Item>
              </Col>
            </Row>
          </Col>

          {/* SEARCH KEYWORD */}


          {/* PROVINCE */}

          <Col xs={24} sm={12} md={12} lg={6}>
            <Form.Item

              name="province"

              label="Province"

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

          {/* DISTRICT */}

          <Col xs={24} sm={12} md={12} lg={6}>
            <Form.Item
              name="district"
              style={{ marginBottom: 0 }}
              label="District"

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

                disabled={
                  isKeywordSelected ||
                  !districts.length
                }

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

          {/* COMMUNE */}

          <Col xs={24} sm={12} md={12} lg={6}>
            <Form.Item
              name="commune"
              style={{ marginBottom: 0 }}
              label="Commune"

              rules={[
                {
                  required: true,
                  message: 'field require',
                },
              ]}
            >
              <Select
                showSearch

                disabled={
                  isKeywordSelected ||
                  !communes.length
                }
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
          {/* LOCATION DESCRIPTION */}
          <Col xs={24} sm={12} md={12} lg={6}>
            <Form.Item
              name="location_description"
              label="Location Description"
              style={{ marginBottom: 0 }}
            >
              <Input
                disabled={isKeywordSelected}
                placeholder="e.g. Walk Street"
              />
            </Form.Item>
          </Col>
          <span className='text-[#00000066] '> Location locked by keyword. Search a different keyword to change.</span>
          <Col span={24}>
            <Row style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Col span={18} align="right">
                <Space>
                  {/* <Popconfirm
                    title="Please confirm !"
                    description="Are you sure to save only personal information?"
                    onConfirm={onSaveOnly}
                    overlayClassName="custom-popconfirm"
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      loading={createLoading}
                      type="primary"
                      style={{ background: '#1677ff' }}
                      className="cursor-pointer text-white"
                    >
                      Save Only Personal Info
                    </Button>
                  </Popconfirm> */}
                  <Button
                    loading={btnLoading}
                    onClick={onNext}
                    type="primary"
                    style={{ background: '#1677ff' }}
                    className="cursor-pointer text-white"
                  >
                    Next
                  </Button>
                </Space>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default PersonalInfoForm;

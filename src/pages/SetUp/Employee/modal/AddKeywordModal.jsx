import React, { useMemo, useState } from 'react';

import {
    Modal,
    Button,
    Input,
    Form,
} from 'antd';

import {
    CloseOutlined,
} from '@ant-design/icons';


export default function SaveLocationKeywordModal({
    open,
    setOpen,

    province,
    district,
    commune,

    provinces = [],
    districts = [],
    communes = [],

    onSave,
}) {

    const [form] = Form.useForm();


    const [count, setCount] = useState(0);



    const selectedLocation = useMemo(() => {

        const provinceName =
            provinces.find(
                (item) => item.value === province
            )?.label || '';


        const districtName =
            districts.find(
                (item) => item.value === district
            )?.label || '';


        const communeName =
            communes.find(
                (item) => item.value === commune
            )?.label || '';



        return [
            provinceName,
            districtName,
            communeName,
        ]
            .filter(Boolean)
            .join(' › ');


    }, [
        province,
        district,
        commune,
        provinces,
        districts,
        communes,
    ]);



    const handleCancel = () => {

        form.resetFields();

        setCount(0);

        setOpen(false);

    };


    const handleSave = async () => {


        const values =
            await form.validateFields();


        const payload = {


            keyword_name:
                values.keyword_name,


            province_id: province,

            district_id: district,

            commune_id: commune,


            location:
                selectedLocation,


        };


        onSave?.(payload);


        handleCancel();


    };



    return (

        <Modal

            open={open}

            centered

            width={490}

            footer={null}

            onCancel={handleCancel}


            closeIcon={

                <CloseOutlined

                    style={{

                        color: '#ff4d4f',

                        fontSize: 20,

                    }}

                />

            }


            title={

                <div

                    style={{

                        fontSize: 20,

                        fontWeight: 600,

                    }}

                >

                    Save Location Keyword

                </div>

            }


        >


            <Form

                form={form}

                layout="vertical"

            >



                {/* SELECTED LOCATION */}

                <div

                    style={{

                        background: '#EFF6FF',

                        border: '1px solid #BFDBFE',

                        borderRadius: 8,

                        padding: '14px 18px',

                        marginBottom: 20,

                    }}

                >


                    <div

                        style={{

                            color: '#8c8c8c',

                            fontSize: 12,

                            marginBottom: 6,

                        }}

                    >

                        SELECTED LOCATION

                    </div>



                    <div

                        style={{

                            fontSize: 12,

                            fontWeight: 500,

                            color: '#1f2937',

                        }}

                    >

                        {selectedLocation || '-'}

                    </div>


                </div>





                {/* KEYWORD NAME */}

                <Form.Item

                    name="keyword_name"

                    label="Keyword name"

                    rules={[

                        {

                            required: true,

                            message: 'Please input keyword name',

                        }

                    ]}

                >


                    <Input

                        maxLength={60}

                        placeholder='e.g. "Phnom Penh office"'

                        onChange={(e) => {

                            setCount(
                                e.target.value.length
                            );

                        }}

                    />


                </Form.Item>



                <div

                    style={{

                        textAlign: 'right',

                        marginTop: -18,

                        marginBottom: 20,

                        color: '#999',

                        fontSize: 12,

                    }}

                >

                    {count}/60

                </div>





                {/* BUTTON */}

                <div

                    style={{

                        display: 'flex',

                        justifyContent: 'flex-end',

                        gap: 10,

                    }}

                >


                    <Button

                        onClick={handleCancel}

                    >

                        Cancel

                    </Button>



                    <Button

                        type="primary"

                        onClick={handleSave}

                        style={{

                            background: '#91caff',

                            borderColor: '#91caff',

                        }}

                    >

                        Save Keyword

                    </Button>



                </div>


            </Form>


        </Modal>

    );

}
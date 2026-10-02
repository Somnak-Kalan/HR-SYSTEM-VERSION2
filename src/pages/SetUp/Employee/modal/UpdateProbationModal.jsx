import React, { useEffect, useState } from "react";

import {
    Modal,
    Form,
    Input,
    DatePicker,
    Upload,
    Button,
    Radio,
    Row,
    Col
} from "antd";

import {
    CloseOutlined,
    InboxOutlined, CloseCircleOutlined
} from "@ant-design/icons";

import dayjs from "dayjs";


export default function UpdateProbationModal({

    open,

    setOpen,

    employee,

    onSubmit

}) {


    const [form] = Form.useForm();


    const [fileList, setFileList] = useState([]);



    const isRed =
        employee?.color === "red";



    useEffect(() => {


        if (open && employee) {


            form.setFieldsValue({

                company:
                    employee?.company,

                department:
                    employee?.department,

                position:
                    employee?.position,


                join_date:
                    employee?.joining_date
                        ?
                        dayjs(employee.joining_date)
                        :
                        null,


                probation_date:
                    employee?.probation_due
                        ?
                        dayjs(employee.probation_due)
                        :
                        null,


                probation_month:
                    employee?.duration

            });


        }


    }, [open, employee]);





    const handleCancel = () => {

        form.resetFields();

        setFileList([]);

        setOpen(false);

    };




    const submit = (values) => {


        const payload = {

            ...values,

            employeeId: employee?.id,

            document: fileList[0]

        };


        onSubmit?.(payload);


        handleCancel();

    };





    return (

        <Modal


            open={open}


            onCancel={handleCancel}


            footer={null}


            width={830}


            centered


            closeIcon={
                <CloseCircleOutlined
                    className="cursor-pointer"
                    style={{ fontSize: 20, color: 'red' }}
                />


            }


            title={

                <div

                    style={{

                        fontSize: 22,

                        fontWeight: 700

                    }}

                >

                    Update Company Info :

                    {" "}

                    {employee?.employee}

                </div>

            }


        >



            <Form

                form={form}

                layout="vertical"

                onFinish={submit}

            >



                <Row gutter={20}>


                    <Col span={8}>

                        <Form.Item

                            label="Company"

                            name="company"

                            required

                        >

                            <Input disabled />

                        </Form.Item>

                    </Col>



                    <Col span={8}>

                        <Form.Item

                            label="Department"

                            name="department"

                            required

                        >

                            <Input disabled />

                        </Form.Item>

                    </Col>




                    <Col span={8}>

                        <Form.Item

                            label="Position"

                            name="position"

                            required

                        >

                            <Input disabled />

                        </Form.Item>

                    </Col>



                </Row>





                <Row gutter={20}>


                    <Col span={8}>

                        <Form.Item

                            label="Join Date"

                            name="join_date"

                            required

                        >

                            <DatePicker

                                style={{
                                    width: "100%"
                                }}

                                format="YYYY-MM-DD"

                                disabled

                            />

                        </Form.Item>


                    </Col>





                    {
                        !isRed &&

                        <Col span={8}>

                            <Form.Item

                                label="Probation Date"

                                name="probation_date"

                                required

                            >

                                <DatePicker

                                    style={{
                                        width: "100%"
                                    }}

                                    format="YYYY-MM-DD"

                                />


                            </Form.Item>


                        </Col>

                    }




                    {
                        !isRed &&

                        <Col span={8}>


                            <Form.Item

                                label="Probation (Month)"

                                name="probation_month"

                                required

                            >

                                <Input

                                    placeholder="3M"

                                />


                            </Form.Item>


                        </Col>

                    }



                </Row>







                <Form.Item

                    label="Evaluation Document"

                >



                    <Upload.Dragger


                        fileList={fileList}


                        beforeUpload={(file) => {


                            setFileList([file]);


                            return false;

                        }}


                        maxCount={1}


                        height={180}

                    >


                        <InboxOutlined


                            style={{

                                fontSize: 70,

                                color: "#d9dde5"

                            }}


                        />



                        <br />


                        <Button

                            type="primary"

                        >

                            Browse

                        </Button>



                        <div

                            style={{

                                marginTop: 12,

                                color: "#888"

                            }}

                        >

                            Upload evaluation file here

                        </div>



                    </Upload.Dragger>



                </Form.Item>







                <Form.Item

                    label="Probation Status"

                    name="probation_status"

                >


                    <Radio.Group>


                        <Radio value="passed">

                            Pass Probation

                        </Radio>



                        <Radio value="failed">

                            Fail Probation

                        </Radio>


                    </Radio.Group>



                </Form.Item>











                <Button

                    htmlType="submit"

                    block


                    style={{

                        height: 42,

                        background: "#ff9800",

                        color: "#fff",

                        border: "none",

                        borderRadius: 6

                    }}

                >

                    UPDATE

                </Button>




            </Form>



        </Modal>

    );

}
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Checkbox,
    Col,
    Form,
    Input,
    Modal,
    Row,
    Space,
} from 'antd';
import dayjs from 'dayjs';

const Resign = ({
    open,
    setOpen,
    employee,
    loading = false,
    onSave,
}) => {
    const [form] = Form.useForm();
    const [confirmed, setConfirmed] = useState(false);

    useEffect(() => {
        if (!open) return;

        form.setFieldsValue({
            employee_id: employee?.employee_id || '',
            employee_name: employee?.name || '',
            identity_card: employee?.identity_card || '',
            dob: employee?.dob
                ? dayjs(employee.dob).format('YYYY-MM-DD')
                : '',
            passport: employee?.passport || '',
            phone_number: employee?.phone_number || '',
            gender: employee?.gender || '',
            company: employee?.company || '',
            department: employee?.department || '',
            position: employee?.position || '',
        });

        setConfirmed(false);
    }, [open, employee, form]);

    const handleClose = () => {
        form.resetFields();
        setConfirmed(false);
        setOpen(false);
    };

    const handleSave = async () => {
        if (!employee) return;

        await onSave?.(employee);

        // close from parent after API success if preferred
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={null}
            width={635}
            centered
            destroyOnHidden
            title={
                <span
                    style={{
                        fontSize: 16,
                        fontWeight: 600,
                    }}
                >
                    Resign Employee
                </span>
            }
        >
            <Form
                form={form}
                layout="vertical"
                autoComplete="off"
            >
                <Row gutter={[8, 0]}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="employee_id"
                            label="Staff Code"
                            style={{ marginBottom: 8 }}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="employee_name"
                            label="Employee Name"
                            style={{ marginBottom: 8 }}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="identity_card"
                            label="Identity Card"
                            style={{ marginBottom: 8 }}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="dob"
                            label="Date of Birth"
                            style={{ marginBottom: 8 }}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="passport"
                            label="Passport"
                            style={{ marginBottom: 8 }}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="phone_number"
                            label="Phone Number"
                            style={{ marginBottom: 8 }}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="gender"
                            label="Gender"
                            style={{ marginBottom: 8 }}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="company"
                            label="Company"
                            style={{ marginBottom: 8 }}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="department"
                            label="Department"
                            style={{ marginBottom: 8 }}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="position"
                            label="Position"
                            style={{ marginBottom: 8 }}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>
                </Row>

                <Alert
                    type="warning"
                    showIcon
                    style={{
                        marginTop: 4,
                        marginBottom: 10,
                    }}
                    message={
                        <div style={{ fontSize: 12 }}>
                            <div>
                                Please check employee information before resign.
                            </div>

                            <div style={{ marginTop: 4 }}>
                                After save, this employee will be moved to resign status.
                            </div>
                        </div>
                    }
                />

                <Checkbox
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    style={{
                        fontSize: 12,
                        marginBottom: 16,
                    }}
                >
                    I have checked and confirmed this employee resign information.
                </Checkbox>

                <Row gutter={8}>
                    <Col span={12}>
                        <Button
                            block
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                    </Col>

                    <Col span={12}>
                        <Button
                            block
                            type="primary"
                            disabled={!confirmed}
                            loading={loading}
                            onClick={handleSave}
                            style={{
                                background: confirmed ? '#1677ff' : undefined,
                            }}
                        >
                            Save
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default Resign;
import { Form, Input, Select, DatePicker, Row, Col, Checkbox } from 'antd';

const { TextArea } = Input;

const DepartmentForm = ({
    form,

    list_company = [],

    employeeOptions = [],

    employeeLoading,

    handleEmployeeSearch,

    fetchEmployeeList,

    leaveTypes = [],
    isUpdate = false,
    disabled = false,
}) => {
    return (
        <Form
            form={form}

            layout="vertical"

            autoComplete="off"
        >
            <Row gutter={[8, 8]}>
                {/* =========================
    COMPANY
========================= */}

                <Col
                    xs={24}

                    lg={12}
                >
                    <Form.Item
                        label="Company Name"

                        name="company_id"

                        rules={[
                            {
                                required: true,

                                message: 'Company is required',
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select company"

                            disabled={disabled}
                        >
                            {list_company?.map((item, index) => (
                                <Select.Option
                                    key={item?._id || index}

                                    value={item?._id}
                                >
                                    {item?.company_name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

                {/* =========================
    DEPARTMENT NAME
========================= */}

                <Col
                    xs={24}

                    lg={12}
                >
                    <Form.Item
                        label="Department Name"

                        name="department_name"

                        rules={[
                            {
                                required: true,

                                message: 'Department name is required',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Department name"

                            disabled={disabled}
                        />
                    </Form.Item>
                </Col>

                {/* =========================
    MANAGER
========================= */}

                <Col
                    xs={24}

                    lg={12}
                >

                    <Form.Item
                        label="Manager"

                        name="leader"
                    >
                        <Select
                            placeholder="Select manager"

                            showSearch

                            allowClear

                            disabled={disabled}

                            options={employeeOptions}

                            loading={employeeLoading}
                            onSearch={handleEmployeeSearch}
                            onDropdownVisibleChange={(open) => {
                                if (open) {
                                    fetchEmployeeList('');
                                }
                            }}
                            notFoundContent={employeeLoading ? 'Loading...' : 'No employee found'}
                        ></Select>
                    </Form.Item>
                </Col>

                {/* =========================
    DATE CREATE
========================= */}

                <Col
                    xs={24}
                    lg={12}
                >
                    <Form.Item
                        label="Date Create"
                        name="date_create"
                    >
                        <DatePicker
                            style={{
                                width: '100%',
                            }}

                            disabled={isUpdate}
                        />
                    </Form.Item>
                </Col>

                {/* =========================
    DESCRIPTION
========================= */}

                <Col xs={24}>
                    <Form.Item
                        label="Description"

                        name="department_description"
                    >
                        <TextArea
                            rows={4}

                            placeholder="Description"

                            disabled={disabled}
                        />
                    </Form.Item>
                </Col>
                {
                    leaveTypes?.length > 0 && (
                        <Col xs={24}>
                            <Form.Item
                                label="Leave Types"
                                name="leave_types"
                            >

                                <Checkbox.Group
                                    disabled={disabled}
                                    className="w-full"
                                    value={form.getFieldValue("leave_types") || []}
                                    onChange={(checkedValues) => {

                                        form.setFieldsValue({
                                            leave_types: checkedValues
                                        });

                                    }}
                                >

                                    <div
                                        className="
                    rounded-lg
                    border
                    border-gray-300
                    px-3
                    py-3
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-4
                    gap-y-4
                    gap-x-2
                "
                                    >

                                        {leaveTypes?.map((item) => (

                                            <Checkbox
                                                key={item.value}
                                                value={item.value}
                                                className="
                                 !m-0
                                 whitespace-nowrap
                                 text-[14px]
                                 text-gray-700
                                "
                                            >
                                                {item.label}
                                            </Checkbox>

                                        ))}

                                    </div>


                                </Checkbox.Group>


                            </Form.Item>


                        </Col>
                    )
                }

            </Row>
        </Form>
    );
};

export default DepartmentForm;

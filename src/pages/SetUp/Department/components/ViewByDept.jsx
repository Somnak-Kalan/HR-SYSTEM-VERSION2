import { CloseOutlined, TeamOutlined, FileTextOutlined, EditOutlined } from '@ant-design/icons';

import { Modal, Tag, Button, Skeleton } from 'antd';

import { useEffect, useState } from 'react';

import BuildingIcon from '../../../../assets/icons/Building.svg';

import { useDepartmentStore } from '../../../../stores/department.store';

import EditLeaveTypeModal from '../modal/EditLeaveType';

const EmployeeSkeleton = () => {
  return (
    <div className="absolute inset-0 z-20 bg-white/70 p-3 backdrop-blur-[1px]">
      {Array.from({
        length: 8,
      }).map((_, index) => (
        <div key={index} className="mb-3 grid grid-cols-6 gap-3">
          {Array.from({
            length: 6,
          }).map((_, i) => (
            <Skeleton.Input key={i} active size="small" className="!h-4 !w-full" />
          ))}
        </div>
      ))}
    </div>
  );
};

const ViewByDepartment = ({ open, setOpen, propData, access_token, departmentData = {} }) => {
  const { departmentEmployeeDepartment, departmentEmployees, employeesLoading, Fetch_List_Employee_By_Department } =
    useDepartmentStore();

  const [openEditLeaveType, setOpenEditLeaveType] = useState(false);

  const close = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (open && propData?.id) {
      Fetch_List_Employee_By_Department({
        doc: {
          id: propData.id,
        },

        access_token,

        force: true,
      });
    }
  }, [open, propData?.id]);

  const department = departmentEmployeeDepartment || {};

  const employees = departmentEmployees || [];

  return (
    <>
      <EditLeaveTypeModal
        open={openEditLeaveType}

        setOpen={setOpenEditLeaveType}

        propData={propData}

        departmentData={department}
      />

      <Modal
        rootClassName='departmentModalPadding'
        open={open}

        onCancel={close}

        footer={null}

        closable={false}

        width={1000}

        centered

        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <div className="overflow-hidden rounded-xl bg-white text-[12px] text-gray-700">
          {/* HEADER */}

          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center">
                <img src={BuildingIcon} className="h-8 w-8" />
              </div>

              <div>
                <div className="text-[14px] font-semibold text-gray-800">{department?.department_name || '-'}</div>

                <div className="text-[10px] text-gray-500">Manager: {department?.leaderName || '-'}</div>
              </div>
            </div>

            <CloseOutlined
              onClick={close}

              className="cursor-pointer text-gray-400"
            />
          </div>
          <div className="p-4">
            {/* EMPLOYEE TITLE */}

            <div className="mb-2 flex items-center gap-2 font-semibold text-gray-800">
              <TeamOutlined />
              Department Employees ({employees.length})
            </div>

            {/* TABLE */}

            <div className="relative overflow-x-auto rounded-lg border">
              {employeesLoading && <EmployeeSkeleton />}

              <div className="max-h-[420px] overflow-y-auto">
                <table className="w-full min-w-[750px] text-[11px]">
                  <thead className="sticky top-0 z-10 bg-gray-50">
                    <tr className="text-gray-500">
                      <th className="w-[15%] px-3 py-2 text-left">EMPLOYEE ID</th>

                      <th className="w-[15%] px-3 py-2 text-left">FULL NAME</th>

                      <th className="w-[15%] px-3 py-2 text-left">POSITION</th>

                      <th className="w-[15%] px-3 py-2 text-left">JOIN DATE</th>

                      <th className="w-[40%] px-3 py-2 text-left">LEAVE TYPE</th>

                      <th className="w-[15%] px-3 py-2 text-left">STATUS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {employees.map((item, index) => (
                      <tr
                        key={item._id || index}

                        className="border-t border-gray-100"
                      >
                        {/* EMPLOYEE ID */}

                        <td className="px-3 py-2 uppercase text-blue-600">
                          {item.employee_id ? item.employee_id.toUpperCase() : '-'}
                        </td>

                        {/* FULL NAME */}

                        <td className="px-3 py-2">
                          <div className="text-blue-600">{item.name_latin || '-'}</div>
                        </td>

                        {/* POSITION */}

                        <td className="whitespace-nowrap px-3 py-2">{item.position || '-'}</td>

                        {/* JOIN DATE */}

                        <td className="whitespace-nowrap px-3 py-2">
                          {item.joinDate ? new Date(item.joinDate).toLocaleDateString() : '-'}
                        </td>

                        {/* LEAVE TYPE */}

                        <td className="px-3 py-2">
                          <div className="flex flex-wrap gap-1">
                            {item.leaveTypeDocs?.map((leave, i) => (
                              <Tag
                                key={leave._id || i}

                                className="!border-0 !bg-blue-50 !text-[10px] !text-blue-600"
                              >
                                {leave.leave_type_name || '-'}
                              </Tag>
                            ))}
                          </div>
                        </td>

                        {/* STATUS */}

                        <td className="px-3 py-2">
                          <Tag
                            color={
                              item.status === 'active' ? 'success' : item.status === 'resign' ? 'error' : 'warning'
                            }

                            className="!rounded-full !border-0 !text-[10px]"
                          >
                            {item.status}
                          </Tag>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* LEAVE RULE TITLE */}

            <div className="mb-2 mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-gray-800">
                <FileTextOutlined />
                Leave Policy Rules
              </div>

              <Button
                size="small"

                type="primary"

                onClick={() => setOpenEditLeaveType(true)}

                style={{
                  background: '#ff9800',
                  height: 28,
                  fontSize: 11,
                }}
              >
                Edit leave type
              </Button>
            </div>

            {/* RULE CARD */}

            <div className="space-y-3">
              {department?.leaveTypeDocs?.map((leave, index) => {
                const rules = leave?.rulesSet;

                return (
                  <div key={leave._id || index} className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3">
                    {/* TITLE */}

                    <div className="mb-3 text-[12px] font-semibold text-gray-800">{leave.leave_type_name}</div>

                    {rules ? (
                      <div className="grid grid-cols-3 gap-y-4">
                        <div>
                          <div className="text-[10px] text-gray-400">Days per Year</div>

                          <div className="text-[12px] font-medium">{rules.daysPerYear || 0} days</div>
                        </div>

                        <div>
                          <div className="text-[10px] text-gray-400">Accrual per Month</div>

                          <div className="text-[12px] font-medium">{rules.daysPerMonth || 0} days</div>
                        </div>

                        <div>
                          <div className="text-[10px] text-gray-400">Grant Condition</div>

                          <div className="text-[12px] font-medium">
                            {rules.grantCondition === 'after-probation'
                              ? 'After probation'
                              : rules.grantCondition || '-'}
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] text-gray-400">Monthly Limit</div>

                          <div className="text-[12px] font-medium">{rules.daysPerMonth || '-'}</div>
                        </div>

                        <div>
                          <div className="text-[10px] text-gray-400">Expiration</div>

                          <div className="text-[12px] font-medium">
                            {rules.expireMonth?.length ? rules.expireMonth.join(', ') : '-'}
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] text-gray-400">Carry Over</div>

                          <div className="text-[12px] font-medium">
                            {rules.carryForward ? 'Carry over' : 'No carry-over (resets to 0)'}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-gray-400">No rule configuration</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* CLOSE BUTTON */}


          </div>
          <div className="mt-4 mb-4  flex justify-end border-t border-[#E5E7EB]">
            <button
              onClick={close}

              className="rounded-xl mt-3 mx-4 border border-gray-200 bg-[#4A5565] px-4 py-1.5 text-[11px] text-gray-700  text-white"
            >
              Close
            </button>
          </div>

        </div>
      </Modal>
    </>
  );
};

export default ViewByDepartment;

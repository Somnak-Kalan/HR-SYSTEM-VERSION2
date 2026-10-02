import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Popconfirm, Row } from 'antd';
import dayjs from 'dayjs';
import { DAYS, DayLabels } from './schedule.utils';

const isValidTime = (t) => dayjs(t, 'HH:mm').isValid();

const ListSchedule = (props) => {
  const { schedule_List, new_shift_mgmt, add_new_shift } = props;

  if (!schedule_List?.attendance) return null;

  const Add_New_Shift = async () => {
    await new_shift_mgmt?.(true);
  };

  const renderDayRow = (day) => {
    const d = schedule_List.attendance?.[day];
    const show =
      isValidTime(d?.morning?.start) ||
      isValidTime(d?.morning?.end) ||
      isValidTime(d?.afternoon?.start) ||
      isValidTime(d?.afternoon?.end);

    if (!show) return null;

    return (
      <Row key={day} className="flex">
        <Col span={5}>{DayLabels[day]}</Col>
        <Col span={1}>:</Col>
        <Col span={4}>{isValidTime(d?.morning?.start) ? dayjs(d.morning.start, 'HH:mm').format('HH:mm') : ''}</Col>
        <Col span={6}>{isValidTime(d?.morning?.end) ? dayjs(d.morning.end, 'HH:mm').format('HH:mm') : ''}</Col>
        <Col span={4}>{isValidTime(d?.afternoon?.start) ? dayjs(d.afternoon.start, 'HH:mm').format('HH:mm') : ''}</Col>
        <Col span={4}>{isValidTime(d?.afternoon?.end) ? dayjs(d.afternoon.end, 'HH:mm').format('HH:mm') : ''}</Col>
      </Row>
    );
  };

  const panelContent = (
    <>
      <Row style={{ marginTop: 5, marginBottom: 5 }}>
        <Col span={5}>
          <strong>Day</strong>
        </Col>
        <Col span={3}>
          <strong>:</strong>
        </Col>
        <Col span={10}>
          <strong>Morning</strong>
        </Col>
        <Col span={4}>
          <strong>Afternoon</strong>
        </Col>
      </Row>

      {DAYS.map(renderDayRow)}

      {/* {add_new_shift ? (
        <div style={{ marginTop: 20 }}>
          <Popconfirm
            title="Add New Shift"
            description="Are you sure to add new shift?"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={Add_New_Shift}
          >
            <Button className="border-blue-500">Add New Shift</Button>
          </Popconfirm>
        </div>
      ) : null} */}
    </>
  );

  return (
    <div className="mb-5 overflow-hidden w-full">
      <Collapse
        items={[
          {
            key: '1',
            label: 'Shift Schedule',
            children: panelContent,
          },
        ]}
        style={{
          padding: 0,
          margin: 0,
          background: 'white',
          border: 'solid 1px white',
        }}
      />
    </div>
  );
};

export default ListSchedule;

import dayjs from 'dayjs';

export const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const DayLabels = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

const DEFAULT_MORNING_START = '08:00';
const DEFAULT_MORNING_END = '12:00';
const DEFAULT_AFTERNOON_START = '13:00';
const DEFAULT_AFTERNOON_END = '17:00';

export const safeHHmm = (value) => {
  if (!value) return null;

  if (dayjs.isDayjs(value)) {
    return value.isValid() ? value.format('HH:mm') : null;
  }

  const d = dayjs(String(value), 'HH:mm');

  return d.isValid() ? d.format('HH:mm') : null;
};

export const rangeToHHmm = (range, index, fallback = null) => {
  if (!Array.isArray(range)) return fallback;

  const value = range[index];

  if (!value) return fallback;

  if (dayjs.isDayjs(value)) {
    return value.isValid() ? value.format('HH:mm') : fallback;
  }

  const d = dayjs(String(value), 'HH:mm');

  return d.isValid() ? d.format('HH:mm') : fallback;
};

export const getScheduleById = (shiftList, id) => {
  if (!Array.isArray(shiftList) || !id) return null;

  return (
    shiftList.find((item) => {
      const rowId = item?._id || item?.id || item?.value;
      return String(rowId) === String(id);
    }) || null
  );
};

export const getCreatedShiftId = (res) => {
  return (
    res?.data?._id ||
    res?.data?.id ||
    res?.data?.value ||
    res?._id ||
    res?.id ||
    res?.value ||
    res?.shift_management_id ||
    null
  );
};

/**
 * IMPORTANT:
 * Only send checked days.
 * Do not send unchecked days with empty string/null.
 */
export const buildAttendancePayload = (values) => {
  const attendance = {};

  DAYS.forEach((day) => {
    const enabled = !!values?.[day];

    if (!enabled) return;

    const morning = values?.[`${day}_morning`];
    const afternoon = values?.[`${day}_afternoon`];

    attendance[day] = {
      morning: {
        start: rangeToHHmm(morning, 0, DEFAULT_MORNING_START),
        end: rangeToHHmm(morning, 1, DEFAULT_MORNING_END),
      },
      afternoon: {
        start: rangeToHHmm(afternoon, 0, DEFAULT_AFTERNOON_START),
        end: rangeToHHmm(afternoon, 1, DEFAULT_AFTERNOON_END),
      },
    };
  });

  return attendance;
};

export const buildCreateShiftDoc = ({ username, shiftFormValues }) => {
  return {
    shift_name: shiftFormValues?.shift_name,
    user: username,
    attendance_rule_ids: shiftFormValues?.attendance_rule_id || [],
    attendance: buildAttendancePayload(shiftFormValues),
  };
};

export const buildShiftInitialFormValues = (propData) => {
  const values = {};

  if (!propData) return values;

  const ruleIds = propData?.attendance_rule_ids || propData?.attendance_rule_id || propData?.attendanceRuleIds || [];

  values.id = propData?.id || propData?._id;

  values.attendance_rule_id = Array.isArray(ruleIds) ? ruleIds : ruleIds ? [ruleIds] : [];

  values.shift_name = propData?.shift_name;

  DAYS.forEach((day) => {
    const mStart = safeHHmm(propData?.attendance?.[day]?.morning?.start);
    const mEnd = safeHHmm(propData?.attendance?.[day]?.morning?.end);
    const aStart = safeHHmm(propData?.attendance?.[day]?.afternoon?.start);
    const aEnd = safeHHmm(propData?.attendance?.[day]?.afternoon?.end);

    const enabled = !!(mStart || mEnd || aStart || aEnd);

    values[day] = enabled;

    values[`${day}_morning`] = enabled && mStart && mEnd ? [dayjs(mStart, 'HH:mm'), dayjs(mEnd, 'HH:mm')] : null;

    values[`${day}_afternoon`] = enabled && aStart && aEnd ? [dayjs(aStart, 'HH:mm'), dayjs(aEnd, 'HH:mm')] : null;
  });

  return values;
};

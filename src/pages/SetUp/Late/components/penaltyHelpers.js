export const CONDITION = {
  LESS: 'Less than or equal to (តិចជាងឬស្មើ)',
  BETWEEN: 'Between (ចន្លោះពី)',
  GREATER: 'Greater than or equal to (ធំជាងឬស្មើ)',
};

export const conditionToApi = (condition) => {
  const value = String(condition || '').toLowerCase();

  if (value.includes('between')) return 'between';
  if (value.includes('greater')) return 'greater';

  return 'less';
};

const formatMinutesAsHours = (minutes) => {
  const totalMinutes = Math.max(0, Number(minutes) || 0);
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return `${hours}h ${String(remainingMinutes).padStart(2, '0')}m`;
};
const formatMinutesAsKhmer = (minutes) => {
  const totalMinutes = Math.max(0, Number(minutes) || 0);

  const hours = Math.floor(totalMinutes / 60);

  const remainingMinutes = totalMinutes % 60;

  return `${hours}ម៉ោង ${String(remainingMinutes).padStart(2, '0')}នាទី`;
};

export const getRangeText = (tier) => {
  const condition = conditionToApi(tier?.condition);
  const from = Math.max(0, Number(tier?.fromMinute ?? tier?.minute) || 0);
  const to = Math.max(0, Number(tier?.toMinute) || 0);

  if (condition === 'between') {
    return `${formatMinutesAsHours(from)} – ${formatMinutesAsHours(to)} (ចាប់ផ្ដើមពីរយ:ពេល ${formatMinutesAsKhmer(from)} ដល់ ${formatMinutesAsKhmer(to)})`;
  }

  if (condition === 'greater') {
    return `≥ ${formatMinutesAsHours(from)} ត្រឹមឬ​លើសពីរយ:ពេល ${formatMinutesAsKhmer(from)} ឡើងទៅ`;
  }

  return `≤ ${formatMinutesAsHours(from)}  (ត្រឹមរឬក្រោមពីរយ:ពេល ${formatMinutesAsKhmer(from)}ចុះក្រោម)`;
};

export const buildPenaltyTier = (tier, index) => {
  const condition = conditionToApi(tier?.condition);

  const from = Math.max(0, Number(tier?.fromMinute ?? tier?.minute) || 0);

  const to = Math.max(0, Number(tier?.toMinute) || 0);

  return {
    tierNo: tier?.tierNo || index + 1,
    condition,
    from,
    to: condition === 'between' ? to : 0,
    deductionType: tier?.deductionType || 'Salary Deduction',
    amount: Number(tier?.amount) || 0,
  };
};

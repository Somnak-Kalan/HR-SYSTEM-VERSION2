import { useEffect, useMemo } from 'react';

import {
  CalendarOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  IssuesCloseOutlined,
} from '@ant-design/icons';

const toNumber = (value, fallback) => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const number = Number(value);

  return Number.isNaN(number) ? fallback : number;
};

export default function CountAtt({ detailData = [], countData, onTotalCount }) {
  const safeDetailData = Array.isArray(detailData) ? detailData : [];

  const calculated = useMemo(() => {
    let count_a = 0;
    let count_ms = 0;
    let count_l = 0;
    let count_al = 0;
    let count_ul = 0;

    safeDetailData.forEach((item) => {
      if (item?.value === 'A') {
        count_a += 1;
      }

      if (item?.value === 'AL') {
        const status = item?.date_leave?.[0]?.status_request;

        if (status === 'afternoon' || status === 'morning') {
          count_al += 0.5;
        } else {
          count_al += 1;
        }
      }

      if (item?.value === 'L') {
        count_l += 1;
      }

      if (item?.value === 'MS') {
        const status = item?.date_miss?.[0]?.status_request;

        if (status === 'full day') {
          count_ms += 2;
        } else {
          count_ms += 1;
        }
      }

      if (item?.value === 'UL') {
        count_ul += 1;
      }
    });

    return {
      count_a,
      count_al,
      count_ul,
      count_ms,
      count_l,
    };
  }, [safeDetailData]);

  const result = useMemo(() => {
    return {
      count_a: toNumber(countData?.count_a ?? countData?.absent, calculated.count_a),

      count_al: toNumber(countData?.count_al ?? countData?.al, calculated.count_al),

      count_ul: toNumber(countData?.count_ul ?? countData?.unpaid_leave ?? countData?.ul, calculated.count_ul),

      count_ms: toNumber(countData?.count_ms ?? countData?.miss_scan, calculated.count_ms),

      count_l: toNumber(countData?.count_l ?? countData?.late, calculated.count_l),
    };
  }, [countData, calculated]);

  useEffect(() => {
    onTotalCount?.(result);
  }, [result, onTotalCount]);

  const cardData = [
    {
      label: 'Absent',

      value: result.count_a,

      unit: 'days',

      variant: 'light',

      Icon: CloseCircleOutlined,

      iconBg: '#FDE2E2',

      iconColor: '#EF4444',
    },
    {
      label: 'Annual Leave',

      value: result.count_al,

      unit: 'days',

      variant: 'dark',

      Icon: CalendarOutlined,

      iconBg: '#3A2F1F',

      iconColor: '#F59E0B',
    },

    {
      label: 'Missed Scan',

      value: result.count_ms,

      unit: 'times',

      variant: 'dark',

      Icon: IssuesCloseOutlined,

      iconBg: '#2A1E3A',

      iconColor: '#A855F7',
    },
    {
      label: 'Late',

      value: result.count_l,

      unit: 'times',

      variant: 'light',

      Icon: ClockCircleOutlined,

      iconBg: '#DBEAFE',

      iconColor: '#3B82F6',
    },
  ];

  const Card = ({ item }) => {
    const isDark = item.variant === 'dark';

    return (
      <div
        className={[
          'rounded-2xl px-5 py-4 shadow-sm border',
          'flex items-start justify-between gap-4',

          isDark ? 'bg-[#2D2D2D] ' + 'border-[#2D2D2D]' : 'bg-white ' + 'border-gray-100',
        ].join(' ')}>
        <div className="min-w-0">
          <div className={isDark ? 'text-white' : 'text-gray-900'}>
            <span className="text-3xl font-semibold leading-none">{item.value}</span>

            <span className={['ml-2 text-sm font-medium', isDark ? 'text-white/60' : 'text-gray-500'].join(' ')}>
              {item.unit}
            </span>
          </div>

          <div className={['mt-1 text-sm', isDark ? 'text-white/60' : 'text-gray-500'].join(' ')}>{item.label}</div>
        </div>

        <div
          className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: item.iconBg,
          }}>
          <item.Icon
            style={{
              fontSize: 20,
              color: item.iconColor,
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="py-2">
      <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-4 lg:grid-cols-4 gap-4">
        {cardData.map((item, index) => (
          <Card key={`${item.label}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
}

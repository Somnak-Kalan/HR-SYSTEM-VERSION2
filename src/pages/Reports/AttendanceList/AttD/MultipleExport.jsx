import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
} from 'react';

import dayjs from 'dayjs';

import ExportExcelFile from '../../../../utils/MultipleExport';

const ConbineDataExport =
  forwardRef(
    (
      {
        attendance,
        filterMonth,
        filterDepartment,
        isListExport = false,
      },
      ref,
    ) => {
      // =================================================
      // DATA
      // =================================================

      const list = Array.isArray(
        attendance,
      )
        ? attendance
        : [];

      const detailData =
        list?.[0] || null;

      const info =
        detailData?.info || {};

      const days =
        Array.isArray(
          detailData?.days,
        )
          ? detailData.days
          : [];

      // =================================================
      // RANGE LABEL
      // =================================================

      const label =
        useMemo(() => {
          const range =
            filterMonth
              ?.date_attendance;

          if (
            Array.isArray(
              range,
            ) &&
            range.length === 2
          ) {
            const from =
              dayjs(range[0]);

            const to =
              dayjs(range[1]);

            if (
              from.isValid() &&
              to.isValid()
            ) {
              if (
                from.format(
                  'YYYY-MM',
                ) ===
                to.format(
                  'YYYY-MM',
                )
              ) {
                return from.format(
                  'MMMM YYYY',
                );
              }

              return `${from.format(
                'MMM YYYY',
              )} To ${to.format(
                'MMM YYYY',
              )}`;
            }
          }

          return '';
        }, [
          filterMonth,
        ]);

      // =================================================
      // TIME
      // =================================================

      const formatTime =
        useCallback(
          (value) => {
            if (!value) {
              return '';
            }

            const text =
              String(
                value,
              ).trim();

            const parsed =
              dayjs(text);

            return parsed.isValid()
              ? parsed.format(
                'hh:mm A',
              )
              : text;
          },
          [],
        );

      // =================================================
      // NOTE
      // =================================================

      const noteLabel =
        useCallback(
          (item) => {
            if (
              item?.value ===
              'S'
            ) {
              return 'OK';
            }

            if (
              item?.value ===
              'L'
            ) {
              return 'Late In';
            }

            if (
              item?.value ===
              'MS'
            ) {
              return 'MS';
            }

            if (
              item?.value ===
              'AL'
            ) {
              const status =
                item
                  ?.date_leave?.[0]
                  ?.status_request;

              if (
                status ===
                'morning' ||
                status ===
                'afternoon'
              ) {
                return 'AL1/2';
              }

              return 'AL';
            }

            if (
              item?.value ===
              'UL'
            ) {
              return 'Unpaid';
            }

            if (
              item?.value ===
              'A'
            ) {
              return 'Absent';
            }

            return (
              item?.value ||
              ''
            );
          },
          [],
        );

      // =================================================
      // LIST HEADERS
      // =================================================

      const listHeaders =
        useMemo(
          () => [
            {
              header: 'No',
              key: 'no',
              width: 8,
            },

            {
              header:
                'EMPLOYEE ID',
              key: 'employee_id',
              width: 18,
            },

            {
              header: 'FULL NAME',
              key: 'name',
              width: 28,
            },

            {
              header:
                'DEPARTMENT',
              key: 'department',
              width: 25,
            },

            {
              header: 'POSITION',
              key: 'position',
              width: 25,
            },

            {
              header: 'MONTH',
              key: 'month',
              width: 18,
            },

            {
              header:
                'WORKING DAY',
              key: 'working_day',
              width: 15,
            },

            {
              header: 'AL',
              key: 'al',
              width: 10,
            },

            {
              header:
                'DAY OFF',
              key: 'day_off',
              width: 12,
            },

            {
              header:
                'UNPAID LEAVE',
              key: 'unpaid_leave',
              width: 16,
            },

            {
              header: 'LATE',
              key: 'late',
              width: 12,
            },

            {
              header: 'ABSENT',
              key: 'absent',
              width: 12,
            },
          ],
          [],
        );

      // =================================================
      // DETAIL HEADERS
      // =================================================

      const detailHeaders =
        useMemo(
          () => [
            {
              header: 'Nº',
              key: 'no',
              width: 8,
            },

            {
              header: 'ID',
              key: 'employee_id',
              width: 18,
            },

            {
              header: 'NAME',
              key: 'name',
              width: 28,
            },

            {
              header: 'DAY',
              key: 'day',
              width: 10,
            },

            {
              header: 'DATE',
              key: 'date',
              width: 18,
            },

            {
              header:
                'CLOCK IN',
              key: 'time_check_in',
              width: 15,
            },

            {
              header:
                'CLOCK OUT',
              key: 'time_check_out',
              width: 15,
            },

            {
              header: 'NOTED',
              key: 'value',
              width: 15,
            },

            {
              header: 'REASON',
              key: 'note',
              width: 40,
            },

            {
              header: 'AL',
              key: 'al',
              width: 10,
            },

            {
              header:
                'DAY OFF',
              key: 'day_off',
              width: 12,
            },

            {
              header:
                'UNPAID LEAVE',
              key: 'unpaid_leave',
              width: 16,
            },

            {
              header: 'LATE',
              key: 'late',
              width: 10,
            },
          ],
          [],
        );

      // =================================================
      // LIST ROWS
      // =================================================

      const listRows =
        useMemo(() => {
          return list.map(
            (
              item,
              index,
            ) => {
              const itemInfo =
                item?.info ||
                {};

              return {
                no:
                  index + 1,

                employee_id:
                  itemInfo?.employee_id ||
                  item?.employee_id ||
                  '',

                name:
                  itemInfo?.name ||
                  itemInfo?.nameLatin ||
                  '',

                department:
                  item?.department_name ||
                  item?.department ||
                  '',

                position:
                  item?.position_name ||
                  item?.position ||
                  '',

                month:
                  item?.month ||
                  label,

                working_day:
                  item?.working_days ??
                  item?.working_day ??
                  0,

                al:
                  item?.al ??
                  0,

                day_off:
                  item?.day_off ??
                  0,

                unpaid_leave:
                  item?.unpaid_leave ??
                  0,

                late:
                  item?.late ??
                  0,

                absent:
                  item?.absent ??
                  item?.count_a ??
                  0,
              };
            },
          );
        }, [
          list,
          label,
        ]);

      // =================================================
      // DETAIL ROWS
      // =================================================

      const detailRows =
        useMemo(() => {
          return days.map(
            (
              item,
              index,
            ) => {
              const al =
                item?.value ===
                  'AL'
                  ? item
                    ?.date_leave?.[0]
                    ?.status_request ===
                    'morning' ||
                    item
                      ?.date_leave?.[0]
                      ?.status_request ===
                    'afternoon'
                    ? 0.5
                    : 1
                  : 0;

              const dayOff =
                item?.value ===
                  'DayOff' ||
                  item?.value ===
                  'Day Off'
                  ? 0.5
                  : 0;

              const unpaid =
                item?.value ===
                  'UL'
                  ? 0.5
                  : 0;

              const late =
                item?.value ===
                  'L'
                  ? 1
                  : 0;

              return {
                no:
                  index + 1,

                employee_id:
                  info?.employee_id ||
                  '',

                name:
                  info?.name ||
                  [
                    info?.first_name ||
                    '',
                    info?.last_name ||
                    '',
                  ]
                    .filter(
                      Boolean,
                    )
                    .join(' ')
                    .trim(),

                day:
                  item?.day ||
                  '',

                date:
                  item?.date ||
                  '',

                time_check_in:
                  formatTime(
                    item?.time_check_in,
                  ),

                time_check_out:
                  formatTime(
                    item?.time_check_out,
                  ),

                value:
                  noteLabel(
                    item,
                  ),

                note:
                  String(
                    item?.reason ||
                    item?.note ||
                    '',
                  )
                    .trim()
                    .toString(),

                al,

                day_off:
                  dayOff,

                unpaid_leave:
                  unpaid,

                late,
              };
            },
          );
        }, [
          days,
          info,
          formatTime,
          noteLabel,
        ]);

      // =================================================
      // EXPORT
      // =================================================

      const exportExcel =
        useCallback(() => {
          if (
            isListExport
          ) {
            if (
              !listRows.length
            ) {
              return;
            }

            ExportExcelFile({
              headers:
                listHeaders,

              data:
                listRows,

              fileName:
                'attendance_list_report',

              form_name_date: {
                date_name:
                  label,

                name:
                  'Attendance Report',
              },

              department:
                filterDepartment ||
                '',

              isMultiDepartment:
                true,
            });

            return;
          }

          if (
            !detailRows.length
          ) {
            return;
          }

          ExportExcelFile({
            headers:
              detailHeaders,

            data:
              detailRows,

            fileName:
              'attendance_detail_report',

            form_name_date: {
              date_name:
                label,

              name:
                `${info?.first_name || ''} ${info?.last_name || ''
                  }`.trim() ||
                info?.name ||
                '',
            },

            department:
              filterDepartment ||
              detailData?.department_name ||
              detailData?.department ||
              info?.department_name ||
              info?.department ||
              '',
          });
        }, [
          isListExport,
          listRows,
          listHeaders,
          detailRows,
          detailHeaders,
          label,
          filterDepartment,
          info,
          detailData,
        ]);

      useImperativeHandle(
        ref,
        () => ({
          exportExcel,
        }),
        [exportExcel],
      );

      return null;
    },
  );

export default ConbineDataExport;
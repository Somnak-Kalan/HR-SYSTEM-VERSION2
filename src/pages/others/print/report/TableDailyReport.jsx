import dayjs from 'dayjs';
import { forwardRef } from 'react';
const PrintableTable = forwardRef(({ data, count_report, current_month }, ref) => (
  <div
    ref={ref}
    style={{
      visibility: 'visible',
      position: 'absolute',
      left: 0,
      top: '0cm',
      bottom: '3cm',
      width: '21cm',
      height: ' 29.7cm',
      paddingLeft: '1cm',
      paddingRight: '1cm',
      fontFamily: 'Times New Roman',
    }}>
    <style>
      {`
        @media print {
          @page {
            margin: 1cm;
            size: A4;
          }
          .page-break {
            page-break-before: always;
          }
          th, td {
            font-size: 10px;
          }
          th {
            background: #AACC92;
          }
          .summary-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 0px;
          }
          .summary-table td {
            border: solid 1px black;
            padding: 4px;
          }
          thead {
            display: table-row-group;
          }
        
        }
      `}
    </style>

    <div
      style={{
        background: '#AACC92',
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
        fontSize: '10px',
      }}
      className="text-center py-2 font-bold">
      <span>FINGER PRINT </span>
      <span>{current_month?.date_name}</span>
    </div>

    <table className="min-w-full  " style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
      <thead style={{ background: '#AACC92' }}>
        <tr>
          <th
            style={{
              border: '1px solid black',
              fontSize: '10px',
              width: '4%',
            }}
            scope="col"
            className=" py-2	 tracking-wider font-bold  uppercase">
            Nº
          </th>
          <th
            style={{
              border: '1px solid black',
              fontSize: '10px',
              width: '9%',
            }}
            scope="col"
            className="	py-2 tracking-wider font-bold  uppercase">
            ID
          </th>
          <th
            style={{
              border: '1px solid black',
              fontSize: '10px',
              width: '20%',
            }}
            scope="col"
            className="	py-2 tracking-wider font-bold  uppercase"

            // className=' py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'
          >
            NAME
          </th>
          <th
            style={{
              border: '1px solid black',
              fontSize: '10px',
              width: '5%',
            }}
            scope="col"
            className="py-2	 tracking-wider font-bold  uppercase"

            // className=' py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'
          >
            DAY
          </th>
          <th
            className="py-2	 tracking-wider font-bold  uppercase"
            style={{
              border: '1px solid black',
              fontSize: '10px',
              width: '10%',
            }}
            scope="col"

            // className=' py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'
          >
            DATE
          </th>
          <th
            className="py-2	 tracking-wider font-bold  uppercase"
            style={{
              border: '1px solid black',
              fontSize: '10px',
              width: '10%',
            }}
            scope="col"
            // className=' py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'
          >
            CLOCK IN
          </th>
          <th
            className="py-2	 tracking-wider font-bold  uppercase"
            style={{
              border: '1px solid black',
              fontSize: '10px',
              width: '10%',
            }}
            scope="col"

            // className=' py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'
          >
            CLOCK OUT
          </th>
          <th
            className="	py-2 tracking-wider font-bold  uppercase"
            style={{
              border: '1px solid black',
              fontSize: '10px',
              width: '10%',
            }}
            scope="col"
            // className=' py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'
          >
            NOTE
          </th>
          <th
            className="	py-2 tracking-wider font-bold  uppercase"
            style={{
              border: '1px solid black',
              fontSize: '10px',
              width: '30%',
            }}
            scope="col"
            // className=' py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'
          >
            REASON
          </th>
        </tr>
      </thead>
      <tbody className="bg-white ">
        {data && data?.data && Array.isArray(data?.data?.days)
          ? data?.data?.days?.map((item, index) => (
              <tr key={index} style={{ background: item?.day === 'Sun' ? '#FFFD38' : '' }}>
                <td
                  style={{ border: '1px solid black', fontSize: '11px' }}
                  className="px-1 py-1 whitespace-nowrap text-center">
                  {index + 1}
                </td>
                <td
                  style={{ border: '1px solid black', fontSize: '11px' }}
                  className="px-0 py-1  whitespace-nowrap	 text-center">
                  {data?.data?.info?.employee_id}
                </td>
                <td
                  style={{ border: '1px solid black', fontSize: '11px' }}
                  className="px-0 py-1 whitespace-nowrap	text-center ">
                  {data?.data?.info?.first_name + ' ' + data?.data?.info?.last_name}
                </td>
                <td style={{ border: '1px solid black', fontSize: '11px' }} className="px-0 py-1 text-center ">
                  {item?.day}
                </td>
                <td style={{ border: '1px solid black', fontSize: '11px' }} className="px-0 py-1 text-center ">
                  {item?.date}
                </td>
                <td
                  style={{
                    border: '1px solid black',
                    fontSize: '11px',
                    background: item?.value === 'H' ? '#1AAF54' : '',

                    color: item?.value === 'L' ? 'red' : '',
                  }}
                  className="px-0 py-1  text-center whitespace-nowrap">
                  {item?.time_check_in === undefined || item?.time_check_in === null || item?.time_check_in === ''
                    ? ''
                    : dayjs(item?.time_check_in).isValid()
                      ? dayjs(item?.time_check_in).format('hh:mm A')
                      : ''}
                </td>
                <td
                  style={{
                    border: '1px solid black',
                    fontSize: '11px',
                    background: item?.value === 'H' ? '#1AAF54' : '',
                    color: item?.value === 'L' ? 'red' : '',
                  }}
                  className="px-0 py-1  text-center whitespace-nowrap ">
                  {item?.time_check_out === undefined || item?.time_check_out === '' || item?.time_check_out === null
                    ? ''
                    : dayjs(item?.time_check_out).isValid()
                      ? dayjs(item?.time_check_out).format('hh:mm A')
                      : ''}
                </td>
                <td
                  style={{
                    border: '1px solid black',
                    fontSize: '11px',
                    background: item?.value === 'H' ? '#1AAF54' : '',
                  }}
                  className="px-0 py-1  whitespace-nowrap text-center	whitespace-nowrap">
                  {item?.value === 'S'
                    ? 'OK'
                    : item?.date_leave?.[0]?.status_request === 'afternoon' ||
                        item?.date_leave?.[0]?.status_request === 'morning'
                      ? 'AL1/2'
                      : item?.value === 'L'
                        ? 'Late In'
                        : item?.value}{' '}
                </td>
                <td
                  style={{
                    border: '1px solid black',
                    fontSize: '11px',
                    color: item?.value === 'H' || (item?.day === 'Sun' && item?.value === 'Sh') ? '#FF0000' : '',
                  }}
                  className="px-0 py-1 text-center ">
                  {item?.day === 'Sun' && item?.value === 'Sh' ? 'Sunday' : item?.value === 'S' ? '' : item?.note}
                </td>
              </tr>
            ))
          : ''}
      </tbody>
    </table>
    <div className="flex justify-between py-5">
      <div>
        <p className="text-center">ផ្នែករដ្ផបាលនិងធនធានមនុស្ស</p>
        <p className="text-center my-5">ឈ្មោះ....................................</p>
      </div>
      <table
        // className='flex justify-end my-8'
        style={{ borderCollapse: 'collapse' }}>
        <tbody className="" style={{ width: '30%', background: '#F6CAAE' }}>
          <tr>
            <td style={{ border: 'solid 1px black', width: '50%' }} className="py-1 px-4">
              <div className="flex justify-between p-0 p-0">
                <p className="p-0 m-0">Absent</p>
                <p className="p-0 m-0">:</p>
              </div>
            </td>
            <td style={{ border: 'solid 1px black', width: '15%' }} className="py-1 px-4">
              {count_report ? count_report.count_a : 0}
            </td>
            <td style={{ border: 'solid 1px black', width: '20%' }} className="py-1 px-4">
              days
            </td>
          </tr>
          <tr>
            <td style={{ border: 'solid 1px black', width: '50%' }} className="py-1 px-4">
              <div className="flex justify-between p-0 m-0">
                <p className="p-0 m-0">Missed Scan</p>
                <p className="p-0 m-0">:</p>
              </div>
            </td>
            <td style={{ border: 'solid 1px black', width: '15%' }} className="py-1 px-4">
              {count_report ? count_report?.count_ms : 0}
            </td>
            <td style={{ border: 'solid 1px black', width: '20%' }} className="py-1 px-4">
              times
            </td>
          </tr>
          <tr>
            <td style={{ border: 'solid 1px black', width: '50%' }} className="py-1 px-4">
              <div className="flex justify-between p-0 m-0">
                <p className="p-0 m-0">Late</p>
                <p className="p-0 m-0">:</p>
              </div>
            </td>
            <td style={{ border: 'solid 1px black', width: '15%' }} className="py-1 px-4">
              {count_report ? count_report.count_l : 0}
            </td>
            <td style={{ border: 'solid 1px black', width: '20%' }} className="py-1 px-4">
              times
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
));

// Setting the display name for the component to avoid ESLint warning
PrintableTable.displayName = 'PrintableTable';

export default PrintableTable;

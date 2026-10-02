import { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
//
// components
//
import { Card, Breadcrumb } from 'antd';
// icons
import { HomeOutlined } from '@ant-design/icons';
//
import GroupBtn from 'components/GroupBtn';
//
import printAirData from './data/print-air.json';
import dayjs from 'dayjs';
//
//
// change the component name here and export default at the below too
const TableAir = () => {
  const { collapsed } = useOutletContext();
  const navigate = useNavigate();

  const [dataTablePrintAir, setDateTablePrintAir] = useState([]);

  useEffect(() => {
    setDateTablePrintAir(printAirData);
    console.log(dataTablePrintAir);
  }, []);

  return (
    <div>
      {/* fixed group button */}
      <GroupBtn collapsed={collapsed} showBackBtn backBtn />
      <Breadcrumb
        style={{
          position: 'fixed',
          top: '80px',
          right: '16px',
        }}
        items={[
          {
            title: (
              <HomeOutlined
                onClick={() => {
                  navigate('/');
                }}
              />
            ),
          },
          {
            title: 'Sample',
          },
        ]}
      />
      {/* card */}
      <Card title="Sample" style={{ marginTop: '100px' }}>
        <h4>广州空运-Guangzhou ផ្លូវអាកាស 2023-11-04 Arrived Phnom Penh</h4>
        <h3 style={{ textAlign: 'center' }}>AIR</h3>
        {/* code here */}

        <table
          style={{
            border: '1px solid',
            borderCollapse: 'collapse',
            textAlign: 'center',
            width: '100%',
          }}>
          <thead>
            <tr style={{ border: '1px solid' }}>
              <th style={{ border: '1px solid', padding: 8 }}>Customer name</th>
              <th style={{ border: '1px solid', padding: 8 }}>Customer ID</th>
              <th style={{ border: '1px solid', padding: 8 }}>QTY</th>
              <th style={{ border: '1px solid', padding: 8 }}>Volume Weight</th>
              <th style={{ border: '1px solid', padding: 8 }}>Act Weight</th>
              <th style={{ border: '1px solid', padding: 8 }}>Commodity</th>
              <th style={{ border: '1px solid', padding: 8 }}>Tracking number</th>
              <th style={{ border: '1px solid', padding: 8 }}>Received date</th>
            </tr>
          </thead>
          <tbody>
            {dataTablePrintAir.map((item, index) => {
              return item.sub_data.map((sub_item, sub_index) => {
                return (
                  <tr key={[index + '-' + sub_index]}>
                    <td style={{ border: '1px solid', padding: 8 }}>{sub_item.name}</td>

                    <td style={{ border: '1px solid', padding: 8 }}>{sub_item.code_id}</td>

                    <td style={{ border: '1px solid', padding: 8 }}>{sub_item.quantity}</td>
                    <td style={{ border: '1px solid', padding: 8 }}>{sub_item.cbm_m3}</td>
                    <td style={{ border: '1px solid', padding: 8 }}>{sub_item.weight}</td>
                    <td style={{ border: '1px solid', padding: 8 }}>{sub_item.commodity}</td>
                    <td
                      style={{
                        border: '1px solid',
                        padding: 8,
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                      }}>
                      <div
                        style={{
                          width: '100%',
                          overflow: 'hidden',
                        }}>
                        <span>{sub_item.tracking_number}</span>
                      </div>
                    </td>
                    <td style={{ border: '1px solid', padding: 8 }}>{dayjs(sub_item.in_date).format('YYYY-MM-DD')}</td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
// change the component name here too
export default TableAir;

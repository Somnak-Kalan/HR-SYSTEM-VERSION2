import React, { useEffect, useState } from 'react';
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
import printExpData from './data/print-exp.json';
import dayjs from 'dayjs';
//
//
// change the component name here and export default at the below too
const TableExp = () => {
  const { collapsed } = useOutletContext();
  const navigate = useNavigate();
  const [dataTablePrintExp, setDateTablePrintExp] = useState([]);

  useEffect(() => {
    setDateTablePrintExp(printExpData);
    console.log(dataTablePrintExp);
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
        <h4>佛山-Foshan 2023-10-28A Arrived Phnom Penh</h4>
        <h3 style={{ textAlign: 'center' }}>EXPRESS</h3>
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
              <th style={{ border: '1px solid' }}>
                代码
                <br />
                Customer code
              </th>
              <th style={{ border: '1px solid' }}>
                件数 <br />
                Qty
              </th>
              <th style={{ border: '1px solid' }}>
                单号 <br />
                Tracking number
              </th>
              <th style={{ border: '1px solid' }}>
                重量kg <br />
                Weight
              </th>
              <th style={{ border: '1px solid' }}>
                货物 <br />
                Commodity
              </th>
              <th style={{ border: '1px solid' }}>
                入仓日期 <br />
                Received date
              </th>
            </tr>
          </thead>
          <tbody>
            {dataTablePrintExp.map((item, index) => {
              return item.sub_data.map((sub_item, sub_index) => {
                return (
                  <tr key={[index + '-' + sub_index]}>
                    <td style={{ border: '1px solid', padding: 8 }}>{sub_item.code_id}</td>

                    <td style={{ border: '1px solid', padding: 8 }}>{sub_item.quantity}</td>

                    <td
                      style={{
                        border: '1px solid',
                        padding: 8,
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                      }}>
                      <div
                        style={{
                          overflow: 'hidden',
                        }}>
                        <span>{sub_item.tracking_number}</span>
                      </div>
                    </td>

                    <td style={{ border: '1px solid', padding: 8 }}>{sub_item.weight}</td>
                    <td style={{ border: '1px solid', padding: 8 }}>{sub_item.commodity}</td>

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
export default TableExp;

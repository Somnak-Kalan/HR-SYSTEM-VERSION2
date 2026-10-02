import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
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
import printLcLData from './data/print-lcl.json';
//
//
// change the component name here and export default at the below too
const TableLcl = () => {
  const { collapsed } = useOutletContext();
  const navigate = useNavigate();
  const [dataTablePrintLcL, setDateTablePrintLcL] = useState([]);

  useEffect(() => {
    setDateTablePrintLcL(printLcLData);
    console.log(dataTablePrintLcL);
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
        <h4>广州海运-Guangzhou ផ្លូវទឹក 2023-11-06B Waiting Departure</h4>
        <h3 style={{ textAlign: 'center' }}>LCl</h3>
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
                客户及电话 <br />
                Customer name
              </th>
              <th style={{ border: '1px solid' }}>
                货物 <br />
                Commodity
              </th>
              <th style={{ border: '1px solid' }}>
                代码 <br />
                Code ID
              </th>
              <th style={{ border: '1px solid' }}>
                长m <br />
                Length
              </th>
              <th style={{ border: '1px solid' }}>
                宽m <br />
                Width
              </th>
              <th style={{ border: '1px solid' }}>
                高m <br />
                Height
              </th>
              <th style={{ border: '1px solid' }}>
                件数 <br />
                Qty
              </th>
              <th style={{ border: '1px solid' }}>
                体积m3 <br />
                CBM
              </th>
              <th style={{ border: '1px solid' }}>
                重量kg <br />
                Weight
              </th>
              <th style={{ border: '1px solid' }}>
                备注 <br />
                Remark
              </th>
              <th style={{ border: '1px solid' }}>
                单号 <br />
                Tracking number
              </th>
              <th style={{ border: '1px solid' }}>
                入仓日期 <br />
                Received date
              </th>
            </tr>
          </thead>
          <tbody>
            {dataTablePrintLcL.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  {item.sub_data.map((sub_item, sub_index) => {
                    return (
                      <tr key={[index + '-' + sub_index]}>
                        <td style={{ border: '1px solid', padding: 8 }}>{sub_item.name}</td>
                        <td style={{ border: '1px solid', padding: 8 }}>{sub_item.commodity}</td>
                        <td style={{ border: '1px solid', padding: 8 }}>{sub_item.code_id}</td>
                        <td style={{ border: '1px solid', padding: 8 }}>{sub_item.length}</td>
                        <td style={{ border: '1px solid', padding: 8 }}>{sub_item.width}</td>
                        <td style={{ border: '1px solid', padding: 8 }}>{sub_item.height}</td>
                        <td style={{ border: '1px solid', padding: 8 }}>{sub_item.quantity}</td>
                        <td style={{ border: '1px solid', padding: 8 }}>{sub_item.cbm_m3}</td>
                        <td style={{ border: '1px solid', padding: 8 }}>{sub_item.weight}</td>
                        <td
                          style={{
                            border: '1px solid',
                            padding: 8,
                            whiteSpace: 'nowrap',
                          }}>
                          <div style={{ width: '160px', overflow: 'hidden' }}>{sub_item.remark}</div>
                        </td>
                        <td
                          style={{
                            border: '1px solid',
                            padding: 8,
                            whiteSpace: 'nowrap',
                          }}>
                          <div
                            style={{
                              width: '160px',
                              overflow: 'hidden',
                            }}>
                            {sub_item.tracking_number}
                          </div>
                        </td>
                        <td style={{ border: '1px solid', padding: 8 }}>
                          {dayjs(sub_item.in_date).format('YYYY-MM-DD')}
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td style={{ border: '1px solid', padding: 8 }} colSpan={6}></td>
                    <td style={{ border: '1px solid', padding: 8 }}>
                      <b style={{ color: '#ff0000' }}>{item.quantity}</b>
                    </td>
                    <td style={{ border: '1px solid', padding: 8 }}>
                      <b style={{ color: '#ff0000' }}>{item.cbm_m3}</b>
                    </td>
                    <td style={{ border: '1px solid', padding: 8 }}>
                      <b style={{ color: '#ff0000' }}>{item.weight}</b>
                    </td>
                    <td style={{ border: '1px solid', padding: 8 }}></td>
                    <td style={{ border: '1px solid', padding: 8 }}></td>
                    <td style={{ border: '1px solid', padding: 8 }}></td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
// change the component name here too
export default TableLcl;

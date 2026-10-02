import { useEffect, useState } from 'react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
//
// components
//
import { Card, Breadcrumb, Tabs } from 'antd';
// icons
import { HomeOutlined } from '@ant-design/icons';
//
import SearchCostumerCode from './test-tab/SearchCustomerCode';
import SearchTracking from './test-tab/SearchTracking';
import SearchContainer from './test-tab/SearchContainer';
//

//
//
// change the component name here and export default at the below too
const TestTabRoute = () => {
  const { collapsed } = useOutletContext();
  const navigate = useNavigate();
  const { keyTab } = useParams();
  //
  const [items, setItems] = useState([
    {
      label: 'Search Customer Code',
      key: 'search-customer-code',
      children: null,
    },
    {
      label: 'Search Tracking',
      key: 'search-tracking',
      children: null,
    },
    {
      label: 'Search Container',
      key: 'search-container',
      children: null,
    },
  ]);
  const [tabName, setTabName] = useState(keyTab);
  //
  useEffect(() => {
    console.log('keyTab', keyTab);
    if (!keyTab) {
      console.log(items[0].key);
      if (items[0].key === 'search-customer-code') items[0].children = <SearchCostumerCode />;
      else if (items[0].key === 'search-tracking') items[0].children = <SearchTracking />;
      else if (items[0].key === 'search-container') items[0].children = <SearchContainer />;
    } else {
      items.forEach((item) => {
        if (item.key === keyTab && keyTab === 'search-customer-code') {
          return (item.children = <SearchCostumerCode />);
        } else if (item.key === keyTab && keyTab === 'search-tracking') {
          return (item.children = <SearchTracking />);
        } else if (item.key === keyTab && keyTab === 'search-container') {
          return (item.children = <SearchContainer />);
        } else {
          return (item.children = null);
        }
      });
    }
    //
  }, [keyTab]);
  //
  useEffect(() => {
    console.log('tabName', tabName);
    // console.log(items.find(item => item.key === tabName))
    const temp = items.find((item) => item.key === tabName);
    console.log(temp);
    if (!temp) navigate('/test-tab');
  }, [tabName]);
  //

  return (
    <div>
      {/* card */}
      <Card title="Test Tab Route" style={{ marginTop: '100px' }}>
        <Tabs
          defaultActiveKey={tabName}
          type="card"
          items={items}
          size="small"
          onChange={(val) => navigate(`/test-tab/${val}`)}
        />
        {/* code here */}
      </Card>
    </div>
  );
};
// change the component name here too
export default TestTabRoute;

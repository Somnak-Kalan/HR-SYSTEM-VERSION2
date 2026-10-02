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
//
// change the component name here and export default at the below too
const SampleTitle = () => {
  const { collapsed } = useOutletContext();
  const navigate = useNavigate();

  return (
    <div>
      {/* fixed group button */}
      <GroupBtn collapsed={collapsed} showBackBtn backBtn />
      <Breadcrumb
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
      <Card title="Sample">
        <h1>Sample</h1>
        {/* code here */}
      </Card>
    </div>
  );
};
// change the component name here too
export default SampleTitle;

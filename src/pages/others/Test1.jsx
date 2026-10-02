// import { useContext, useEffect, useState } from 'react'
// import { SearchOutlined } from '@ant-design/icons'
// import { AuthContext } from '../../contexts/AuthContext'
// import DepartmentOptionService from '../../services/options/department'
// import CustomSelect from '../../components/config/Select' // Import the styled component

// const App = () => {
//   const [departmentOtp, setDepartmentOtp] = useState([])
//   const { access_token } = useContext(AuthContext)

//   const handleChange = value => {
//     console.log(`change ${value}`)
//   }

//   const handleSelect = value => {
//     console.log(`Selected: ${value}`)
//   }

//   const Get_Department_Otp = () => {
//     DepartmentOptionService.Get_Department_Option({ access_token }).then(
//       res => {
//         setDepartmentOtp(res)
//       }
//     )
//   }

//   useEffect(() => {
//     Get_Department_Otp()
//   }, [access_token])

//   const filterOption = (input, option) => {
//     const normalizedInput = input.replace(/\s+/g, '').toLowerCase()
//     const normalizedLabel = option.label.replace(/\s+/g, '').toLowerCase()
//     return normalizedLabel.includes(normalizedInput)
//   }

//   return (
//     <>
//       <div
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           borderRadius: '5px',
//           padding: '0 0px',
//           border: '1px solid #d9d9d9',
//           background: 'white',
//         }}
//         className='flex mt-16 '
//       >
//         <SearchOutlined
//           style={{ fontSize: '18px', paddingLeft: '12px', color: '#1890ff' }}
//         />
//         <CustomSelect
//           mode='tags'
//           style={{
//             flex: 1,
//             marginLeft: '0px',
//           }}
//           onChange={handleChange}
//           onSelect={handleSelect}
//           tokenSeparators={[',']}
//           placeholder='Search By department name'
//           options={departmentOtp.map(dept => ({
//             value: dept.value,
//             label: dept.label,
//           }))}
//           filterOption={filterOption}
//           dropdownRender={menu => <div>{menu}</div>}
//         />
//       </div>
//     </>
//   )
// }

// export default App
import { useContext, useEffect, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { AuthContext } from '../../contexts/AuthContext';
import DepartmentOptionService from '../../services/options/department';
import CustomSelect from '../../components/config/Select'; // Import the styled component
import EmployeeService from '../../services/setup/employee';

const App = () => {
  const [departmentOtp, setDepartmentOtp] = useState([]);
  const { access_token } = useContext(AuthContext);

  // Fetch department options when the component mounts or access_token changes
  useEffect(() => {
    const fetchDepartmentOptions = async () => {
      try {
        // await EmployeeService.Get_Employee({ access_token }).then(res => {
        //   setListEmployeeFilter(res.data)
        //   console.log(res)
        // })
        const res = await EmployeeService.Get_Employee({
          access_token,
        });
        // console.log(res, 'test')
        setDepartmentOtp(res?.data);
      } catch (error) {
        console.error('Error fetching department options:', error);
      }
    };

    fetchDepartmentOptions();
  }, [access_token]);

  const handleChange = (value) => {
    console.log(`Change: ${value}`);
  };

  const handleSelect = (value) => {
    console.log(`Selected: ${value}`);
  };

  // Custom filter for the select options
  const filterOption = (input, option) => {
    if (!input || !option || !option.label) {
      return false;
    }
    const normalizedInput = input.replace(/\s+/g, '').toLowerCase();
    const normalizedLabel = option.label.replace(/\s+/g, '').toLowerCase();
    return normalizedLabel.includes(normalizedInput);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: '5px',
        padding: '0 0px',
        border: '1px solid #d9d9d9',
        background: 'white',
      }}
      className="flex mt-16">
      <SearchOutlined style={{ fontSize: '18px', paddingLeft: '12px', color: '#1890ff' }} />
      <CustomSelect
        showSearch
        style={{
          flex: 1,
          marginLeft: '0px',
        }}
        onChange={handleChange}
        onSelect={handleSelect}
        placeholder="Search By department name"
        allowClear
        options={departmentOtp?.map((dept) => ({
          value: dept.id,
          label: dept.employee_id,
        }))}
        filterOption={filterOption}
        dropdownRender={(menu) => <div>{menu}</div>}
      />
    </div>
  );
};

export default App;

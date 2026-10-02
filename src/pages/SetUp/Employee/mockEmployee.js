export const mockEmployees = [
  {
    id: '1',
    employee_id: 'VTS-0001',

    name: 'សកលកណា',
    name_latin: 'Sakalin Kim',

    gender: 'Male',

    company: 'VTS Logistics Co.,Ltd.',

    department: 'FCL - ACCOUNTING',

    position: 'Junior Accountant',

    join_date: '2026-09-16',

    probation_date: '2026-12-16',

    passed_probation: 'Passed',

    identity_card_id: '010203040',

    dob: '2004-09-11',

    phone_number: '056253674',

    emergency_phone: '012345678',

    status: 'active',

    resignation_date: null,
  },

  {
    id: '2',
    employee_id: 'VTS-0002',

    name: 'យ៉ានី លីន',
    name_latin: 'Yanin Lim',

    gender: 'Male',

    company: 'VTS Logistics Co.,Ltd.',

    department: 'UX UI',

    position: 'UX UI Designer',

    join_date: '2026-09-10',

    probation_date: '2026-12-10',

    passed_probation: 'Passed',

    identity_card_id: '010203041',

    dob: '2004-05-11',

    phone_number: '066578897',

    emergency_phone: '012456789',

    status: 'active',

    resignation_date: null,
  },

  {
    id: '3',
    employee_id: 'VTS-0003',

    name: 'tt tt',
    name_latin: 'draft tt',

    gender: 'Male',

    company: 'VTS Logistics Co.,Ltd.',

    department: 'UX UI',

    position: 'UX UI Designer',

    join_date: '2026-09-11',

    probation_date: '2026-12-11',

    passed_probation: 'Probation',

    identity_card_id: '010203042',

    dob: '2006-09-11',

    phone_number: '432423432',

    emergency_phone: '',

    status: 'pending',

    resignation_date: null,
  },

  {
    id: '4',

    employee_id: 'VTS-0004',

    name: 'DRAFT DRAFT',

    name_latin: 'DRAFT DRAFT',

    gender: 'Male',

    company: 'VTS Logistics Co.,Ltd.',

    department: 'FCL - INFORMATION TECHNOLOGY',

    position: 'Back-End Developer',

    join_date: '2026-06-30',

    probation_date: '2026-06-30',

    passed_probation: 'Passed',

    identity_card_id: '010203043',

    dob: '2006-09-11',

    phone_number: '123456789',

    emergency_phone: '',

    status: 'active',

    resignation_date: null,
  },

  {
    id: '5',

    employee_id: 'VTS-0005',

    name: 'Chanbomrey RA',

    name_latin: 'Chanbomrey RA',

    gender: 'Male',

    company: 'VTS Logistics Co.,Ltd.',

    department: 'UX UI',

    position: 'Tester',

    join_date: '2026-07-24',

    probation_date: '2026-08-24',

    passed_probation: 'Passed',

    identity_card_id: '010203044',

    dob: '2003-09-11',

    phone_number: '784415521',

    emergency_phone: '',

    status: 'active',

    resignation_date: null,
  },

  {
    id: '6',

    employee_id: 'VTS-0006',

    name: 'Dara Sok',

    name_latin: 'Dara Sok',

    gender: 'Male',

    company: 'VTS Logistics Co.,Ltd.',

    department: 'TEST-USER',

    position: 'TEST-USER',

    join_date: '2026-07-07',

    probation_date: '2026-10-07',

    passed_probation: 'Passed',

    identity_card_id: '010203045',

    dob: '2000-09-11',

    phone_number: '012345678',

    emergency_phone: '',

    status: 'active',

    resignation_date: null,
  },

  {
    id: '7',

    employee_id: 'VTS-0007',

    name: 'Test Test',

    name_latin: 'Test Test',

    gender: 'Male',

    company: 'VTS Logistics Co.,Ltd.',

    department: 'FCL - INFORMATION TECHNOLOGY',

    position: 'Web Developer',

    join_date: '2026-07-23',

    probation_date: '2026-10-23',

    passed_probation: 'Failed',

    identity_card_id: '010203046',

    dob: '2001-09-11',

    phone_number: '012345678',

    emergency_phone: '',

    status: 'inactive',

    resignation_date: null,
  },

  {
    id: '8',

    employee_id: 'VTS-0008',

    name: 'Chhorn Thida',

    name_latin: 'Chhorn Thida',

    gender: 'Female',

    company: 'VTS Logistics Co.,Ltd.',

    department: 'LCL ACCOUNTING',

    position: 'Cashier',

    join_date: '2025-10-20',

    probation_date: '2026-01-19',

    passed_probation: 'Probation',

    identity_card_id: '010203047',

    dob: '2003-09-11',

    phone_number: '092230669',

    emergency_phone: '',

    status: 'pending',

    resignation_date: null,
  },
];

export const mockProbation = [
  {
    id: 'p1',
    employee: 'VTS-0252 - ឈិន សុភា',
    gender: 'M',
    department: 'Information Technology',
    position: 'Mobile Developer',
    joining_date: '2025-01-05',
    duration: '3 mon',
    probation_due: '2025-04-05',
    status: 'Set Probation',
    remaining: '-4 day',
    color: 'red',
  },

  {
    id: 'p2',
    employee: 'VTS-0252 - Sun Vireak - ស៊ុន វីរៈ',
    gender: 'M',
    department: 'Information Technology',
    position: 'Mobile Developer',
    joining_date: '2025-01-16',
    duration: '3 mon',
    probation_due: '2025-04-16',
    status: 'Set Probation',
    remaining: '8 day',
    color: 'orange',
  },

  {
    id: 'p3',
    employee: 'VTS-0252 - Sin Dyna - សិន ដាយណា',
    gender: 'M',
    department: 'Information Technology',
    position: 'Mobile Developer',
    joining_date: '2025-01-17',
    duration: '3 mon',
    probation_due: '2025-04-17',
    status: 'Set Probation',
    remaining: '11 day',
    color: 'orange',
  },

  {
    id: 'p4',
    employee: 'VTS-0252 - Van Theara - វ៉ាន់ ធារ៉ា',
    gender: 'M',
    department: 'Information Technology',
    position: 'Mobile Developer',
    joining_date: '2025-02-16',
    duration: '3 mon',
    probation_due: '2025-06-16',
    status: 'Set Probation',
    remaining: '11 day',
    color: 'blue',
  },

  {
    id: 'p5',
    employee: 'VTS-0252 - Pheak Sokvanita - ភាគ សុវណ្ណារីតា',
    gender: 'M',
    department: 'Information Technology',
    position: 'Mobile Developer',
    joining_date: '2025-02-14',
    duration: '4 mon',
    probation_due: '2025-07-14',
    status: 'Set Probation',
    remaining: '24 day',
    color: 'blue',
  },
];

export const mockResignEmployees = mockEmployees
  .filter((e) => e.id === '3' || e.id === '7')
  .map((e) => ({
    ...e,
    resignation_date: '2026-09-28',
  }));

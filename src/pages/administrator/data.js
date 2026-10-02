export const users = [
  ['missel', 'VTS-0470', 'No Missel', 'UX/UI', 'QA Tester', 'Active', '2026-06-03'],
  ['toem paly', 'VTS-0604', 'Paly Toem', 'Kh Review', 'Data entry', 'Active', '2026-05-11'],
  ['lowin techie', 'LOWIN168', 'LO WIN', 'IT', 'IT', 'Active', '2026-03-17'],
  ['huy 01', 'Huy01', 'huy lim', 'NA', 'NA', 'Active', '2026-02-11'],
  ['limvongvibol', 'vibol', 'vongvibol lim', 'Kh Review', 'Assistance', 'Active', '2026-01-19'],
  ['huy lim', 'Jh', 'Huy lim', 'KH Review', 'Operation Manager', 'Active', '2026-01-16'],
  ['leng', 'Boss', 'Kim Leng', 'Manager', 'General Manager', 'Active', '2025-12-30'],
  ['panha', 'VTS-0339', 'Srean Sokhapanha', 'IT', 'Assistant', 'Active', '2025-10-01'],
  ['sokun', 'KH-002', 'Sokun Heng', 'Operation', 'Operation', 'Active', '2025-10-01'],
  ['sovanna', 'KH-001', 'Sovanna Him', 'Operation', 'Operation', 'Inactive', '2025-10-01'],
].map((x, i) => ({
  key: i + 1,
  no: i + 1,
  user: x[0],
  staffCode: x[1],
  fullName: x[2],
  department: x[3],
  position: x[4],
  status: x[5],
  createdAt: x[6],
}));

export const roles = [
  { key: 1, no: 1, title: 'KH-Review', userName: 'sokun', company: 'VTS' },
  { key: 2, no: 2, title: 'UX/UI Designer', userName: 'chetra', company: 'VTS' },
];

export const modules = [
  { key: 'it', no: 1, title: 'IT Dev', department: 'IT', company: 'VTS' },
  { key: 'operation', no: 2, title: 'Operation', department: 'Operation', company: 'Kh Review' },
  { key: 'ux', no: 3, title: 'UX-UI', department: 'UX-UI Team', company: 'VTS' },
];

export const moduleOptions = [
  { value: 'operation', label: 'Operation' },
  { value: 'it', label: 'IT Dev' },
  { value: 'blank', label: 'Crud Blank Page' },
  { value: 'management', label: 'Management' },
];

export const modulePermissions = {
  operation: [
    'Tours Management',
    'All Property Management',
    'Follow Up Management',
    'Hashtags Management',
    'Manage Employee',
    'App User Management',
    'Moment Management',
    'Manage Partner',
    'Assigned User',
    'Additional Service Management',
    'Category Management',
    'Sub Category Management',
    'Service Management',
    'Review Import Management',
    'Module List',
    'Home Page Management',
    'Province Management',
    'Type Management',
    'Feature Management',
    'Role List',
    'Keyword Management',
    'Privacy Management',
    'Amenity Management',
    'Activity Management',
    'Promotion & Event Management',
    'User List',
  ],
  it: [
    'Feature Management',
    'Category Management',
    'Hashtags Management',
    'Privacy Management',
    'Amenity Management',
    'Activity Management',
    'Keyword Management',
    'Province Management',
    'Sub Category Management',
    'Type Management',
  ],
  blank: ['Crud Blank Page', 'blank Page'],
  management: ['Home Page Management'],
};

export const assignedRolePermission = {
  operation: ['Tours Management', 'All Property Management', 'Follow Up Management'],
  it: ['Feature Management', 'Category Management'],
};

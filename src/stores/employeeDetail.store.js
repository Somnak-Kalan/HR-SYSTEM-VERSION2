import { create } from 'zustand';
import EmployeeService from '../services/setup/employee';
import LeaveTypeService from '../services/setup/LeaveType';

const clean = (v) => {
  if (v === '' || v === 'undefined' || v === null || v === undefined) return undefined;
  return v;
};

const unwrapEmployeeDetail = (res) => {
  if (!res) return null;

  // API response: { message: 'Ok', data: { ...employee } }
  if (res?.data?._id) return res.data;

  // API response: { data: { data: { ...employee } } }
  if (res?.data?.data?._id) return res.data.data;

  // Direct employee object
  if (res?._id) return res;

  return null;
};

const normalizeEmployeeDetail = (employee) => {
  const detail = employee || {};

  return {
    id: detail._id,

    personal_info: detail.personal_info || undefined,
    company_info: detail.company_info || undefined,
    other_info: detail.other_info || undefined,
    status: detail?.status || undefined,

    shift_management_id: clean(detail.shift_management_id),
    shift: detail.shift_management || detail.shift || detail.schedule || detail.shift_data || undefined,

    profile_photo: clean(detail.profile_photo),

    id_card_file: clean(detail.id_card),
    cv_file: clean(detail.cv),
    driver_license_file: clean(detail.driver_license),
    others_file: Array.isArray(detail.others) ? detail.others : clean(detail.others),

    leave_type_data: Array.isArray(detail.leaveTypeData)
      ? detail.leaveTypeData
      : Array.isArray(detail.leave_type_data)
        ? detail.leave_type_data
        : [],

    leave_type: Array.isArray(detail.leave_type) ? detail.leave_type : detail.leave_type || undefined,
  };
};

const initialState = {
  loading: false,
  id: undefined,

  personal_info: undefined,
  company_info: undefined,
  other_info: undefined,

  shift: undefined,
  shift_management_id: undefined,

  profile_photo: undefined,

  cv_file: undefined,
  id_card_file: undefined,
  driver_license_file: undefined,
  others_file: undefined,

  leave_type_data: [],
  leave_type: undefined,
  leave_type_list: [],
};

export const useEmployeeDetailStore = create((set, get) => ({
  ...initialState,

  resetDetail: () => {
    set({
      ...initialState,
      leave_type_list: get().leave_type_list,
    });
  },

  fetchDetail: async ({ id, access_token, force = false }) => {
    if (!id || !access_token) return false;

    set({
      loading: true,
      id,
    });

    try {
      const res = await EmployeeService.Get_Employee_Detail({
        id,
        doc: { id },
        access_token,
      });

      const employee = unwrapEmployeeDetail(res);

      if (!employee) {
        console.log('Employee detail not found:', res);
        return false;
      }

      set({
        ...normalizeEmployeeDetail(employee),
      });

      return true;
    } catch (e) {
      console.error('fetchDetail error:', e);
      return false;
    } finally {
      set({
        loading: false,
      });
    }
  },
  updateProfileImage: async ({ id, imagesFile, username, access_token }) => {
    if (!id || !access_token) return false;

    set({ loading: true });

    const formData = new FormData();
    formData.append('user', username || '');

    if (imagesFile) {
      formData.append('images', imagesFile);
    }

    try {
      await EmployeeService.Update_Profile_Image({
        id,
        doc: formData,
        access_token,
      });

      await get().fetchDetail({
        id,
        access_token,
        force: true,
      });

      return true;
    } catch (e) {
      console.error('updateProfileImage error:', e);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updatePersonalInfo: async ({ doc, access_token }) => {
    if (!doc?.id || !access_token) return false;

    set({ loading: true });

    try {
      await EmployeeService.Update_Personal_Info({
        doc,
        access_token,
      });

      await get().fetchDetail({
        id: doc.id,
        access_token,
        force: true,
      });

      return true;
    } catch (e) {
      console.error('updatePersonalInfo error:', e);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateCompanyInfo: async ({ id, access_token, doc }) => {
    if (!id || !access_token) return false;

    set({ loading: true });

    try {
      await EmployeeService.Update_Company_Info({
        doc,
        access_token,
      });

      await get().fetchDetail({
        id,
        access_token,
        force: true,
      });

      return true;
    } catch (e) {
      console.error('updateCompanyInfo error:', e);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateOtherInfo: async ({ id, access_token, doc }) => {
    if (!id || !access_token) return false;

    set({ loading: true });

    try {
      await EmployeeService.Update_Other_Info({
        doc,
        access_token,
      });

      await get().fetchDetail({
        id,
        access_token,
        force: true,
      });

      return true;
    } catch (e) {
      console.error('updateOtherInfo error:', e);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateShiftManagement: async ({ id, doc, access_token }) => {
    if (!id || !access_token) return false;

    set({ loading: true });

    try {
      await EmployeeService.Update_Shift_Management({
        doc,
        access_token,
      });

      await get().fetchDetail({
        id,
        access_token,
        force: true,
      });

      return true;
    } catch (e) {
      console.error('updateShiftManagement error:', e);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateEmployeeFile: async ({ id, access_token, username, fileType, fileList }) => {
    if (!id || !access_token) return false;

    set({ loading: true });

    try {
      const formData = new FormData();
      // formData.append('id', id)
      // formData.append('user', username || '')

      const list = Array.isArray(fileList) ? fileList : [];
      const pickSingle = (arr) => arr?.[0]?.originFileObj;

      if (fileType === 'id_card') {
        const file = pickSingle(list);
        if (file) formData.append('id_card', file);

        await EmployeeService.Update_ID_Card({
          doc: { formData, id },
          access_token,
        });
      }

      if (fileType === 'cv') {
        const file = pickSingle(list);
        if (file) formData.append('cv', file);

        await EmployeeService.Update_Employee_CV({
          doc: { formData, id },
          access_token,
        });
      }

      if (fileType === 'driver_license') {
        const file = pickSingle(list);
        if (file) formData.append('driver_license', file);

        await EmployeeService.Update_Drive_License({
          doc: { formData, id },
          access_token,
        });
      }

      if (fileType === 'others') {
        list.forEach((item) => {
          if (item?.originFileObj) {
            formData.append('others', item.originFileObj);
          }
        });

        await EmployeeService.Update_Others({
          doc: { formData, id },
          access_token,
        });
      }

      await get().fetchDetail({
        id,
        access_token,
        force: true,
      });

      return true;
    } catch (e) {
      console.error('updateEmployeeFile error:', e);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  fetchLeaveTypeList: async ({ access_token }) => {
    if (!access_token) return false;

    try {
      const res = await LeaveTypeService.Get_Leave_Type({
        access_token,
      });

      set({
        leave_type_list: Array.isArray(res) ? res : [],
      });

      return true;
    } catch (e) {
      console.error('fetchLeaveTypeList error:', e);

      set({
        leave_type_list: [],
      });

      return false;
    }
  },

  updateEmployeeLeaveType: async ({ id, leave_type, username, access_token }) => {
    if (!id || !access_token) return false;
    set({ loading: true });
    const doc = {
      id,
      formData: {
        leave_type,
      },
    };

    try {
      await EmployeeService.Update_Employee_Leave_Type({
        doc,
        access_token,
      });

      await get().fetchDetail({
        id,
        access_token,
        force: true,
      });

      return true;
    } catch (e) {
      console.error('updateEmployeeLeaveType error:', e);
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));

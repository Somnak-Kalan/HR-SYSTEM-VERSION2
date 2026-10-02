import { create } from 'zustand';

import RulePolicyService from '../../services/setup/RulePolicy';

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.msg ||
  error?.response?.data?.error ||
  error?.message ||
  fallback;

const getId = (item) => {
  if (typeof item === 'string') {
    return item;
  }

  return item?._id || item?.id || '';
};

const extractPayload = (response) => {
  if (response?.data?.data !== undefined) {
    return response.data.data;
  }

  if (response?.data !== undefined) {
    return response.data;
  }

  return response;
};

const extractList = (response) => {
  const payload = extractPayload(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.list)) {
    return payload.list;
  }

  if (Array.isArray(payload?.rows)) {
    return payload.rows;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  return [];
};

const extractObject = (response) => {
  const payload = extractPayload(response);

  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    return payload;
  }

  return null;
};

export const useRulePolicyStore = create((set, get) => ({
  list: [],
  total: 0,
  search: '',

  loading: false,
  buttonLoading: false,
  currentLoading: false,

  error: '',

  current: null,
  selected: null,
  selectedRowKeys: [],

  setSelected: (item) => {
    const id = getId(item);

    set({
      selected: item || null,
      selectedRowKeys: id ? [id] : [],
    });
  },

  clearSelection: () => {
    set({
      selected: null,
      selectedRowKeys: [],
    });
  },

  clearCurrent: () => {
    set({
      current: null,
    });
  },

  fetchRulePolicies: async ({ access_token, search = '' } = {}) => {
    if (!access_token) {
      throw new Error('Access token is missing');
    }

    const keyword = String(search || '').trim();

    set({
      loading: true,
      error: '',
      search: keyword,
    });

    try {
      const response = await RulePolicyService.List_Rule_Policy({
        access_token,
        doc: {
          search: keyword,
        },
      });

      const list = extractList(response);

      set({
        list,
        total: Number(response?.total ?? response?.data?.total ?? list.length),
      });

      const selectedId = getId(get().selected);

      if (selectedId) {
        const selectedItem = list.find((item) => String(getId(item)) === String(selectedId));

        if (selectedItem) {
          get().setSelected(selectedItem);
        } else {
          get().clearSelection();
        }
      }

      return response;
    } catch (error) {
      set({
        error: getErrorMessage(error, 'Cannot get rule policies'),
      });

      throw error;
    } finally {
      set({
        loading: false,
      });
    }
  },

  fetchRulePolicyById: async ({ access_token, id, _id } = {}) => {
    const policyId = id || _id;

    if (!access_token) {
      throw new Error('Access token is missing');
    }

    if (!policyId) {
      throw new Error('Rule policy ID is required');
    }

    set({
      currentLoading: true,
      error: '',
    });

    try {
      const response = await RulePolicyService.Get_Rule_Policy_By_Id({
        access_token,
        id: policyId,
      });

      const current = extractObject(response);

      set({
        current,
      });

      return current;
    } catch (error) {
      set({
        error: getErrorMessage(error, 'Cannot get rule policy'),
      });

      throw error;
    } finally {
      set({
        currentLoading: false,
      });
    }
  },

  createRulePolicy: async ({ access_token, doc } = {}) => {
    if (!access_token) {
      throw new Error('Access token is missing');
    }

    if (!doc) {
      throw new Error('Rule policy data is required');
    }

    set({
      buttonLoading: true,
      error: '',
    });

    try {
      const response = await RulePolicyService.Create_Rule_Policy({
        access_token,
        doc,
      });

      await get().fetchRulePolicies({
        access_token,
        search: get().search,
      });

      return response;
    } catch (error) {
      set({
        error: getErrorMessage(error, 'Cannot create rule policy'),
      });

      throw error;
    } finally {
      set({
        buttonLoading: false,
      });
    }
  },

  updateRulePolicy: async ({ access_token, id, _id, doc } = {}) => {
    const policyId = id || _id || doc?.id || doc?._id || getId(get().selected);

    if (!access_token) {
      throw new Error('Access token is missing');
    }

    if (!policyId) {
      throw new Error('Rule policy ID is required');
    }

    if (!doc) {
      throw new Error('Rule policy data is required');
    }

    set({
      buttonLoading: true,
      error: '',
    });

    try {
      const response = await RulePolicyService.Update_Rule_Policy({
        access_token,
        id: policyId,
        doc,
      });

      await get().fetchRulePolicies({
        access_token,
        search: get().search,
      });

      get().clearCurrent();
      get().clearSelection();

      return response;
    } catch (error) {
      set({
        error: getErrorMessage(error, 'Cannot update rule policy'),
      });

      throw error;
    } finally {
      set({
        buttonLoading: false,
      });
    }
  },

  removeRulePolicy: async ({ access_token, id, _id } = {}) => {
    const policyId = id || _id || getId(get().selected);

    if (!access_token) {
      throw new Error('Access token is missing');
    }

    if (!policyId) {
      throw new Error('Rule policy ID is required');
    }

    set({
      buttonLoading: true,
      error: '',
    });

    try {
      const response = await RulePolicyService.Remove_Rule_Policy({
        access_token,
        id: policyId,
      });

      await get().fetchRulePolicies({
        access_token,
        search: get().search,
      });

      get().clearCurrent();
      get().clearSelection();

      return response;
    } catch (error) {
      set({
        error: getErrorMessage(error, 'Cannot remove rule policy'),
      });

      throw error;
    } finally {
      set({
        buttonLoading: false,
      });
    }
  },

  checkRulePolicyName: async ({ access_token, policyId, policyName } = {}) => {
    if (!access_token) {
      throw new Error('Access token is missing');
    }

    return RulePolicyService.Check_Rule_Policy_Name({
      access_token,
      doc: {
        policyId: policyId || undefined,
        policyName,
      },
    });
  },

  resetStore: () => {
    set({
      list: [],
      total: 0,
      search: '',
      loading: false,
      buttonLoading: false,
      currentLoading: false,
      error: '',
      current: null,
      selected: null,
      selectedRowKeys: [],
    });
  },
}));

export default useRulePolicyStore;

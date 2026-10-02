import { create } from 'zustand';
import PositionService from '../services/setup/position';

const toArray = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.list)) return res.list;
  if (Array.isArray(res?.data?.list)) return res.data.list;
  if (Array.isArray(res?.docs)) return res.docs;
  if (Array.isArray(res?.data?.docs)) return res.data.docs;
  if (Array.isArray(res?.rows)) return res.rows;
  if (Array.isArray(res?.data?.rows)) return res.data.rows;
  if (Array.isArray(res?.results)) return res.results;

  return [];
};

const toObject = (res) => {
  if (!res) return null;

  if (res?.data?.data && typeof res.data.data === 'object') {
    return res.data.data;
  }

  if (res?.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
    return res.data;
  }

  if (typeof res === 'object' && !Array.isArray(res)) {
    return res;
  }

  return null;
};

const getTotal = (res) => {
  return (
    res?.total ||
    res?.data?.total ||
    res?.totalDocs ||
    res?.data?.totalDocs ||
    res?.count ||
    res?.data?.count ||
    toArray(res).length
  );
};

export const usePositionStore = create((set, get) => ({
  positions: [],
  loading: false,
  error: null,

  positionTotal: 0,
  positionQuery: {
    search: '',
    page: 1,
    size: 10,
  },

  positionById: null,
  positionByIdLoading: false,

  Get_Position: async ({ access_token, doc = {}, force = false }) => {
    const query = {
      search: doc?.search || '',
      page: doc?.page || 1,
      size: doc?.size || 10,
    };

    const { positions, positionQuery } = get();

    const sameQuery =
      positionQuery?.search === query.search &&
      Number(positionQuery?.page) === Number(query.page) &&
      Number(positionQuery?.size) === Number(query.size);

    if (!force && sameQuery && Array.isArray(positions) && positions.length > 0) {
      return {
        data: positions,
        total: get().positionTotal,
        fromCache: true,
      };
    }

    try {
      set({
        loading: true,
        error: null,
        positionQuery: query,
      });

      const res = await PositionService.Get_Position({
        access_token,
        doc: query,
      });

      const list = toArray(res);
      const total = getTotal(res);

      set({
        positions: list,
        positionTotal: total,
        loading: false,
      });

      return res;
    } catch (error) {
      set({
        loading: false,
        error,
      });

      throw error;
    }
  },

  Get_Position_By_Id: async ({ doc, access_token }) => {
    try {
      const id = doc?.id || doc?._id;

      if (!id) {
        throw new Error('Position id is required');
      }

      set({
        positionByIdLoading: true,
        positionById: null,
        error: null,
      });

      const res = await PositionService.Get_Position_By_Id({
        access_token,
        doc: {
          id,
        },
      });

      const data = toObject(res);

      set({
        positionById: data,
        positionByIdLoading: false,
      });

      return data;
    } catch (error) {
      set({
        positionByIdLoading: false,
        error,
      });

      throw error;
    }
  },

  Create_Position: async ({ doc, access_token }) => {
    try {
      set({
        error: null,
      });

      const res = await PositionService.Create_Position({
        doc,
        access_token,
      });

      if (res) {
        const currentQuery = get().positionQuery || {
          search: '',
          page: 1,
          size: 10,
        };

        await get().Get_Position({
          access_token,
          doc: currentQuery,
          force: true,
        });
      }

      return res;
    } catch (error) {
      set({
        error,
      });

      throw error;
    }
  },

  Update_Position: async ({ doc, access_token }) => {
    try {
      set({
        error: null,
      });

      const res = await PositionService.Update_Position({
        doc,
        access_token,
      });

      if (res) {
        const currentQuery = get().positionQuery || {
          search: '',
          page: 1,
          size: 10,
        };

        await get().Get_Position({
          access_token,
          doc: currentQuery,
          force: true,
        });
      }

      return res;
    } catch (error) {
      set({
        error,
      });

      throw error;
    }
  },

  Remove_Position: async ({ doc, access_token }) => {
    try {
      set({
        error: null,
      });

      const res = await PositionService.Remove_Position({
        doc,
        access_token,
      });

      if (res) {
        const currentQuery = get().positionQuery || {
          search: '',
          page: 1,
          size: 10,
        };

        await get().Get_Position({
          access_token,
          doc: currentQuery,
          force: true,
        });
      }

      return res;
    } catch (error) {
      set({
        error,
      });

      throw error;
    }
  },

  Clear_Position_Cache: () => {
    set({
      positions: [],
      positionTotal: 0,
      positionById: null,
      positionQuery: {
        search: '',
        page: 1,
        size: 10,
      },
      error: null,
    });
  },
}));

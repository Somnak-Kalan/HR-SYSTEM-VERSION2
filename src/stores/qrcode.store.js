import { create } from 'zustand';
import QRCodeServices from '../services/setup/qrCode';

const defaultListDoc = {
  search: '',
};

const getRowId = (row) => row?._id || row?.id;

const normalizeQRCode = (item) => {
  if (!item) return null;

  return {
    ...item,
    id: item?._id || item?.id,
    _id: item?._id || item?.id,
    title: item?.title || '',
    round: item?.round,
    latitude: item?.latitude ?? item?.Latitude,
    longitude: item?.longitude ?? item?.Longitude,
    status: item?.status,
    createdAt: item?.createdAt || item?.created_at,
    updatedAt: item?.updatedAt || item?.updated_at,
  };
};

const normalizeQRCodes = (res) => {
  const list = Array.isArray(res?.data)
    ? res.data
    : Array.isArray(res?.users)
      ? res.users
      : Array.isArray(res?.qrCodes)
        ? res.qrCodes
        : Array.isArray(res)
          ? res
          : [];

  return list.map(normalizeQRCode).filter(Boolean);
};

const normalizeDetail = (res) => {
  const rec = res?.rec || res?.data || res?.qrCode || res;
  return normalizeQRCode(rec);
};

export const useQRCodeStore = create((set, get) => ({
  loading: false,
  btn_loading: false,
  detail_loading: false,

  qr_list: [],
  selectedRowKeys: [],
  selected: null,

  qrFetchedAt: 0,
  lastQrDoc: defaultListDoc,
  lastQrDocKey: '',

  setSelectedRowKeys: (keys) => set({ selectedRowKeys: keys }),

  setSelected: (row) => {
    set({
      selected: normalizeQRCode(row),
    });
  },

  clearSelection: () => {
    set({
      selected: null,
      selectedRowKeys: [],
    });
  },

  fetchQRCodes: async ({ access_token, doc = defaultListDoc, force = false }) => {
    if (!access_token) return false;

    const listDoc = {
      ...defaultListDoc,
      ...(doc || {}),
    };

    const key = JSON.stringify(listDoc);
    const { lastQrDocKey } = get();

    if (!force && lastQrDocKey === key) {
      return true;
    }

    try {
      set({
        loading: true,
        lastQrDoc: listDoc,
        lastQrDocKey: key,
      });

      const res = await QRCodeServices.Get_QR_Code({
        access_token,
        doc: listDoc,
      });

      set({
        qr_list: normalizeQRCodes(res),
        qrFetchedAt: Date.now(),
      });

      return true;
    } catch (e) {
      console.log(e);
      set({ qr_list: [] });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  getQRCodeById: async ({ access_token, id }) => {
    if (!access_token || !id) return null;

    try {
      set({ detail_loading: true });

      const res = await QRCodeServices.Get_QR_Code_By_ID({
        access_token,
        id,
      });

      const rec = normalizeDetail(res);

      if (rec) {
        set({
          selected: rec,
          selectedRowKeys: [getRowId(rec)],
        });
      }

      return rec;
    } catch (e) {
      console.log(e);
      return null;
    } finally {
      set({ detail_loading: false });
    }
  },

  addQRCode: async ({ access_token, doc }) => {
    if (!access_token || !doc) return null;

    try {
      set({ btn_loading: true });

      const res = await QRCodeServices.Add_QR_Code({
        access_token,
        doc,
      });

      await get().fetchQRCodes({
        access_token,
        doc: get().lastQrDoc || defaultListDoc,
        force: true,
      });

      return res;
    } catch (e) {
      console.log(e);
      return null;
    } finally {
      set({ btn_loading: false });
    }
  },

  updateQRCode: async ({ access_token, id, doc }) => {
    if (!access_token || !id || !doc) return null;

    try {
      set({ btn_loading: true });

      const res = await QRCodeServices.Update_QR({
        access_token,
        id,
        doc,
      });

      await get().fetchQRCodes({
        access_token,
        doc: get().lastQrDoc || defaultListDoc,
        force: true,
      });

      return res;
    } catch (e) {
      console.log(e);
      return null;
    } finally {
      set({ btn_loading: false });
    }
  },

  removeQRCode: async ({ access_token, id }) => {
    if (!access_token || !id) return false;

    try {
      set({ btn_loading: true });

      await QRCodeServices.Remove_QR({
        access_token,
        id,
      });

      await get().fetchQRCodes({
        access_token,
        doc: get().lastQrDoc || defaultListDoc,
        force: true,
      });

      set({
        selected: null,
        selectedRowKeys: [],
      });

      return true;
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      set({ btn_loading: false });
    }
  },
}));

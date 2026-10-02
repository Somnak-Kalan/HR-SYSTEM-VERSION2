import { create } from 'zustand';
import DocumentService from '../services/setup/document';

const normalizeDocs = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.documents)) return res.documents;
  if (Array.isArray(res?.data?.documents)) return res.data.documents;
  if (Array.isArray(res?.docs)) return res.docs;
  if (Array.isArray(res?.data?.docs)) return res.data.docs;
  if (Array.isArray(res?.rows)) return res.rows;
  if (Array.isArray(res?.data?.rows)) return res.data.rows;

  return [];
};

const normalizeObject = (res) => {
  if (!res) return null;
  if (res?.data?.data && typeof res.data.data === 'object') return res.data.data;
  if (res?.data && typeof res.data === 'object' && !Array.isArray(res.data)) return res.data;
  if (res?.document && typeof res.document === 'object') return res.document;
  if (typeof res === 'object' && !Array.isArray(res)) return res;

  return null;
};

export const useDocumentStore = create((set, get) => ({
  loading: false,
  btn_loading: false,
  error: null,

  documents: [],
  documentById: null,
  documentByIdLoading: false,

  selectedRowKeys: [],
  selected: null,

  documentsFetchedAt: 0,
  documentQuery: {
    search: '',
  },

  setSelectedRowKeys: (keys) => set({ selectedRowKeys: keys }),
  setSelected: (doc) => set({ selected: doc }),

  resetSelection: () =>
    set({
      selectedRowKeys: [],
      selected: null,
    }),

  fetchDocuments: async ({ access_token, doc = {}, force = false }) => {
    if (!access_token) return false;

    const search = doc?.search || '';
    const { documents, documentQuery } = get();

    const sameSearch = documentQuery?.search === search;

    if (!force && sameSearch && Array.isArray(documents) && documents.length > 0) {
      return true;
    }

    try {
      set({
        loading: true,
        error: null,
        documentQuery: {
          search,
        },
      });

      const res = await DocumentService.Get_Document({
        access_token,
        doc: {
          search,
        },
      });

      const docs = normalizeDocs(res);

      set({
        documents: docs,
        documentsFetchedAt: Date.now(),
        loading: false,
      });

      return true;
    } catch (error) {
      set({
        loading: false,
        error,
      });

      return false;
    }
  },

  getDocumentById: async ({ access_token, doc }) => {
    try {
      const id = doc?.id || doc?._id;

      if (!id) {
        throw new Error('Document id is required');
      }

      set({
        documentByIdLoading: true,
        documentById: null,
        error: null,
      });

      const res = await DocumentService.Get_Document_By_Id({
        access_token,
        doc: {
          id,
        },
      });

      const data = normalizeObject(res);

      set({
        documentById: data,
        documentByIdLoading: false,
      });

      return data;
    } catch (error) {
      set({
        documentByIdLoading: false,
        error,
      });

      throw error;
    }
  },

  createDocument: async ({ formData, access_token }) => {
    if (!access_token || !formData) return null;

    try {
      set({
        btn_loading: true,
        error: null,
      });

      const res = await DocumentService.Create_Document({
        formData,
        access_token,
      });

      const currentQuery = get().documentQuery || { search: '' };

      await get().fetchDocuments({
        access_token,
        doc: currentQuery,
        force: true,
      });

      return res;
    } catch (error) {
      console.log(error);
      set({ error });
      return null;
    } finally {
      set({
        btn_loading: false,
      });
    }
  },

  updateDocument: async ({ id, formData, access_token }) => {
    if (!access_token || !id || !formData) return null;

    try {
      set({
        btn_loading: true,
        error: null,
      });

      const res = await DocumentService.Update_Document({
        id,
        formData,
        access_token,
      });

      const currentQuery = get().documentQuery || { search: '' };

      await get().fetchDocuments({
        access_token,
        doc: currentQuery,
        force: true,
      });

      return res;
    } catch (error) {
      console.log(error);
      set({ error });
      return null;
    } finally {
      set({
        btn_loading: false,
      });
    }
  },

  removeDocument: async ({ id, access_token }) => {
    if (!access_token || !id) return null;

    try {
      set({
        btn_loading: true,
        error: null,
      });

      const res = await DocumentService.Remove_Document({
        doc: {
          id,
        },
        access_token,
      });

      const currentQuery = get().documentQuery || { search: '' };

      await get().fetchDocuments({
        access_token,
        doc: currentQuery,
        force: true,
      });

      get().resetSelection();

      return res;
    } catch (error) {
      console.log(error);
      set({ error });
      return null;
    } finally {
      set({
        btn_loading: false,
      });
    }
  },
}));

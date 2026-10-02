// src/stores/comapny.store.js
import { create } from 'zustand';
import CompanyService from '../services/setup/company';

export const useCompanyStore = create((set, get) => ({
  company: [],
  loading: false,
  error: null,
  companyFetchedAt: 0,

  Get_Company: async ({ access_token, force = false }) => {
    const { company } = get();

    if (!force && Array.isArray(company) && company.length > 0) {
      return { data: company, fromCache: true };
    }

    try {
      set({ loading: true, error: null });

      const res = await CompanyService.Get_Company({ access_token });

      set({
        company: res?.data || [],
        companyFetchedAt: Date.now(),
        loading: false,
      });

      return res;
    } catch (error) {
      set({ loading: false, error });
      throw error;
    }
  },

  // Create (auto refetch)
  Create_Company: async (payload) => {
    try {
      set({ error: null });

      const res = await CompanyService.Create_Company(payload);

      if (res) {
        await get().Get_Company({
          access_token: payload.access_token,
          force: true,
        });
      }

      return res;
    } catch (error) {
      set({ error });
      throw error;
    }
  },

  // Update (auto refetch)
  Update_Company: async (payload) => {
    try {
      set({ error: null });

      const res = await CompanyService.Update_Company(payload);

      if (res) {
        await get().Get_Company({
          access_token: payload.access_token,
          force: true,
        });
      }

      return res;
    } catch (error) {
      set({ error });
      throw error;
    }
  },

  // Remove (auto refetch)
  Remove_Company: async (payload) => {
    try {
      set({ error: null });
      const res = await CompanyService.Remove_Company(payload);

      if (res) {
        await get().Get_Company({
          access_token: payload.access_token,
          force: true,
        });
      }

      return res;
    } catch (error) {
      set({ error });
      throw error;
    }
  },
}));

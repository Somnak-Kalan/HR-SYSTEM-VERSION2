import { create } from 'zustand';

export const useContentStore = create((set) => ({
  content: null,
  setContent: (content) => set({ content }),
}));

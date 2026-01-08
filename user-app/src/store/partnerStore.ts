import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface PartnerState {
  storeId: string | null;
  setStore: (id: string) => void;
  logout: () => void;
}

export const usePartnerStore = create<PartnerState>((set) => ({
  storeId: null,

  setStore: async (id: string) => {
    try {
      // Save to phone storage so login persists on restart
      await AsyncStorage.setItem("partner_store_id", id);
      set({ storeId: id });
    } catch (e) {
      console.error("Failed to save store ID", e);
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem("partner_store_id");
      set({ storeId: null });
    } catch (e) {
      console.error("Failed to logout", e);
    }
  },

  // Optional: Function to load ID when app starts
  loadFromStorage: async () => {
    const id = await AsyncStorage.getItem("partner_store_id");
    if (id) set({ storeId: id });
  },
}));

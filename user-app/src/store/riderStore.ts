import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface RiderState {
  riderId: string | null;
  preferredStoreId: string | null; // <--- NEW

  setRider: (id: string) => void;
  setStorePreference: (storeId: string) => void; // <--- NEW
  logout: () => void;
}

export const useRiderStore = create<RiderState>((set) => ({
  riderId: null,
  preferredStoreId: null,

  setRider: async (id) => {
    await AsyncStorage.setItem("rider_id", id);
    set({ riderId: id });
  },

  // Save which store the rider is working at
  setStorePreference: async (storeId) => {
    await AsyncStorage.setItem("rider_store_pref", storeId);
    set({ preferredStoreId: storeId });
  },

  logout: async () => {
    await AsyncStorage.removeItem("rider_id");
    await AsyncStorage.removeItem("rider_store_pref");
    set({ riderId: null, preferredStoreId: null });
  },
}));

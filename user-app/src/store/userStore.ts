import { create } from "zustand";

interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

interface UserState {
  location: Location | null;
  activeStore: any | null; // The Dark Store ID serving this location
  setLocation: (loc: Location) => void;
  setStore: (store: any) => void;
}

export const useUserStore = create<UserState>((set) => ({
  location: null,
  activeStore: null,
  setLocation: (loc) => set({ location: loc }),
  setStore: (store) => set({ activeStore: store }),
}));

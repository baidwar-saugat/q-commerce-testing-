import { create } from "zustand";

interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface UserState {
  location: Location | null;
  activeStore: any | null;
  cart: CartItem[]; // <--- New Cart Array

  setLocation: (loc: Location) => void;
  setStore: (store: any) => void;
  addToCart: (item: CartItem) => void; // <--- The missing property
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  location: null,
  activeStore: null,
  cart: [],

  setLocation: (loc) => set({ location: loc }),
  setStore: (store) => set({ activeStore: store }),

  addToCart: (item) =>
    set((state) => {
      const existing = state.cart.find((i) => i.productId === item.productId);
      if (existing) {
        return {
          cart: state.cart.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        cart: [...state.cart, { ...item, quantity: 1 }],
      };
    }),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((i) => i.productId !== id),
    })),

  clearCart: () => set({ cart: [] }),
}));

"use client"

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  type?: string;
};

type CartStore = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],

      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find((p) => p.id === item.id);
          if (existing) {
            return {
              cart: state.cart.map((p) =>
                p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
              ),
            };
          }
          return { cart: [...state.cart, { ...item, quantity: 1 }] };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((p) => p.id !== id),
        })),

      clearCart: () =>
        set({
          cart: [],
        }),

      increaseQuantity: (id) =>
        set((state) => ({
          cart: state.cart.map((p) => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p)),
        })),

      decreaseQuantity: (id) =>
        set((state) => ({
          cart: state.cart.map((p) =>
            p.id === id ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p
          )
        })),
    }),
    {
      name: "planttflix-cart-storage", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage
    }
  )
);

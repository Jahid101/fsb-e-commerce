"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  stock: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      quantity: Math.min(
                        i.quantity + quantity,
                        Math.max(i.stock, 1)
                      ),
                    }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                ...item,
                quantity: Math.min(quantity, Math.max(item.stock, 1)),
              },
            ],
          };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id
              ? {
                  ...i,
                  quantity: Math.max(
                    0,
                    Math.min(quantity, Math.max(i.stock, 1))
                  ),
                }
              : i
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "shophub-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export function useCartItemCount(): number {
  return useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
}

export function useCartSubtotal(): number {
  return useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );
}
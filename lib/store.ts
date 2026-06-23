import { create } from "zustand";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  size: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: number, size: number) => void;
  updateQty: (id: number, size: number, qty: number) => void;
  total: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  addItem: (item) => set((s) => {
    const exists = s.items.find(i => i.id === item.id && i.size === item.size);
    if (exists) return { items: s.items.map(i => i.id === item.id && i.size === item.size ? { ...i, quantity: i.quantity + item.quantity } : i) };
    return { items: [...s.items, item] };
  }),
  removeItem: (id, size) => set((s) => ({ items: s.items.filter(i => !(i.id === id && i.size === size)) })),
  updateQty: (id, size, qty) => set((s) => ({ items: s.items.map(i => i.id === id && i.size === size ? { ...i, quantity: qty } : i) })),
  total: () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
}));

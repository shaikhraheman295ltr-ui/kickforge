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

/* ── Auth Store ─────────────────────────────────────────────── */
interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (_email, _password) => {
    await new Promise(r => setTimeout(r, 1200));
    set({ isAuthenticated: true, user: { name: _email.split("@")[0], email: _email } });
    if (typeof window !== "undefined") localStorage.setItem("kf-auth", JSON.stringify({ name: _email.split("@")[0], email: _email }));
    return true;
  },
  signup: async (name, email, _password) => {
    await new Promise(r => setTimeout(r, 1400));
    set({ isAuthenticated: true, user: { name, email } });
    if (typeof window !== "undefined") localStorage.setItem("kf-auth", JSON.stringify({ name, email }));
    return true;
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
    if (typeof window !== "undefined") localStorage.removeItem("kf-auth");
  },
  checkSession: () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("kf-auth");
      if (raw) try { const u = JSON.parse(raw); set({ isAuthenticated: true, user: u }); } catch { /* ignore */ }
    }
  },
}));

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

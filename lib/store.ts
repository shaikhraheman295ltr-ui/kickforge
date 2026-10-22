import { create } from "zustand";
import {
  clearAuthCookie,
  readAuthCookie,
  writeAuthCookie,
  type SessionUser,
} from "./authCookie";

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

/* Keep localStorage and the middleware cookie in step. */
function persistSession(user: SessionUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("kf-auth", JSON.stringify(user));
  writeAuthCookie(user);
}

function dropSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("kf-auth");
  clearAuthCookie();
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (_email, _password) => {
    await new Promise(r => setTimeout(r, 1200));
    const user = { name: _email.split("@")[0], email: _email };
    set({ isAuthenticated: true, user });
    persistSession(user);
    return true;
  },
  signup: async (name, email, _password) => {
    await new Promise(r => setTimeout(r, 1400));
    const user = { name, email };
    set({ isAuthenticated: true, user });
    persistSession(user);
    return true;
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
    dropSession();
  },
  checkSession: () => {
    if (typeof window === "undefined") return;

    /* The cookie is what the middleware gates on, so trust it first. */
    const fromCookie = readAuthCookie();
    if (fromCookie) {
      set({ isAuthenticated: true, user: fromCookie });
      localStorage.setItem("kf-auth", JSON.stringify(fromCookie));
      return;
    }

    /* Sessions created before the cookie existed: adopt them and write the
       cookie back, otherwise the middleware would bounce this browser to
       /login while the client insists it is signed in. */
    const raw = localStorage.getItem("kf-auth");
    if (!raw) return;
    try {
      const user = JSON.parse(raw) as SessionUser;
      if (typeof user?.name === "string" && typeof user?.email === "string") {
        set({ isAuthenticated: true, user });
        writeAuthCookie(user);
      }
    } catch { /* ignore malformed payloads */ }
  },
}));

/* ── Login Modal Store ──────────────────────────────────────── */
interface LoginModalStore {
  isOpen: boolean;
  pendingItem: CartItem | null;
  openLogin: (item?: CartItem) => void;
  closeLogin: () => void;
}

export const useLoginModalStore = create<LoginModalStore>((set) => ({
  isOpen: false,
  pendingItem: null,
  openLogin: (item) => set({ isOpen: true, pendingItem: item ?? null }),
  closeLogin: () => set({ isOpen: false, pendingItem: null }),
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

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  addLineToShopifyCart,
  createShopifyCart,
  removeLineFromShopifyCart,
  syncCartCheck,
  updateShopifyCartLine,
} from "@/lib/shopify";
import type { CatalogProduct } from "@/lib/catalog";

export interface CartItem {
  lineId: string | null;
  product: CatalogProduct;
  variantId: string;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isOpen: boolean;
  isLoading: boolean;
  isSyncing: boolean;
  setOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, "lineId">) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  getCheckoutUrl: () => string | null;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isOpen: false,
      isLoading: false,
      isSyncing: false,

      setOpen: (open) => set({ isOpen: open }),

      addItem: async (item) => {
        const { items, cartId, clearCart } = get();
        const existing = items.find((i) => i.variantId === item.variantId);
        set({ isLoading: true });
        try {
          if (!cartId) {
            const result = await createShopifyCart({ ...item, lineId: null });
            if (result) {
              set({
                cartId: result.cartId,
                checkoutUrl: result.checkoutUrl,
                items: [{ ...item, lineId: result.lineId }],
                isOpen: true,
              });
            }
          } else if (existing) {
            const newQty = existing.quantity + item.quantity;
            if (!existing.lineId) return;
            const result = await updateShopifyCartLine(cartId, existing.lineId, newQty);
            if (result.success) {
              const cur = get().items;
              set({
                items: cur.map((i) =>
                  i.variantId === item.variantId ? { ...i, quantity: newQty } : i,
                ),
                isOpen: true,
              });
            } else if (result.cartNotFound) {
              clearCart();
            }
          } else {
            const result = await addLineToShopifyCart(cartId, { ...item, lineId: null });
            if (result.success) {
              const cur = get().items;
              set({
                items: [...cur, { ...item, lineId: result.lineId ?? null }],
                isOpen: true,
              });
            } else if (result.cartNotFound) {
              clearCart();
            }
          }
        } catch (e) {
          console.error("addItem", e);
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) return get().removeItem(variantId);
        const { items, cartId, clearCart } = get();
        const item = items.find((i) => i.variantId === variantId);
        if (!item?.lineId || !cartId) return;
        set({ isLoading: true });
        try {
          const result = await updateShopifyCartLine(cartId, item.lineId, quantity);
          if (result.success) {
            const cur = get().items;
            set({
              items: cur.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
            });
          } else if (result.cartNotFound) {
            clearCart();
          }
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (variantId) => {
        const { items, cartId, clearCart } = get();
        const item = items.find((i) => i.variantId === variantId);
        if (!item?.lineId || !cartId) return;
        set({ isLoading: true });
        try {
          const result = await removeLineFromShopifyCart(cartId, item.lineId);
          if (result.success) {
            const cur = get().items;
            const next = cur.filter((i) => i.variantId !== variantId);
            if (next.length === 0) clearCart();
            else set({ items: next });
          } else if (result.cartNotFound) {
            clearCart();
          }
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: () => set({ items: [], cartId: null, checkoutUrl: null }),

      getCheckoutUrl: () => get().checkoutUrl,

      syncCart: async () => {
        const { cartId, isSyncing, clearCart } = get();
        if (!cartId || isSyncing) return;
        set({ isSyncing: true });
        try {
          const data = await syncCartCheck(cartId);
          if (!data) return;
          const cart = data?.data?.cart;
          if (!cart || cart.totalQuantity === 0) clearCart();
        } catch (e) {
          console.error("syncCart", e);
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: "kjk-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items, cartId: s.cartId, checkoutUrl: s.checkoutUrl }),
    },
  ),
);

import { RestaurantArticle } from "@/types/RestaurantArticle";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Define the structure of a cart item
export interface CartItem {
  article: RestaurantArticle;
  quantity: number;
  // You can add other relevant properties like image, etc.
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (article: RestaurantArticle) => void;
  removeItem: (itemId: number) => void;
  clearItem: (itemId: number) => void;
  clearCart: () => void;
  updateItemQuantity: (itemId: number, quantity: number) => void;
  getItemsByRestaurant: (restaurantId: number) => CartItem[];
  getTotalItemsByRestaurantId: (restaurantId: number) => number;
  clearCartForRestaurant: (restaurantId: number) => void;
}

// Create the store with persistence in localStorage
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      addItem: (article) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (cartItem) => cartItem.article.id === article.id
          );

          if (existingItemIndex !== -1) {
            const updatedItems = state.items.map((cartItem) =>
              cartItem.article.id === article.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            );
            const newTotalItems = updatedItems.reduce(
              (sum, cartItem) => sum + cartItem.quantity,
              0
            );
            const newTotalPrice = updatedItems.reduce(
              (sum, cartItem) =>
                sum + cartItem.article.price * cartItem.quantity,
              0
            );
            return {
              items: updatedItems,
              totalItems: newTotalItems,
              totalPrice: newTotalPrice,
            };
          } else {
            const newItem = { article, quantity: 1 };
            const updatedItems = [...state.items, newItem];
            const newTotalItems = updatedItems.reduce(
              (sum, cartItem) => sum + cartItem.quantity,
              0
            );
            const newTotalPrice = updatedItems.reduce(
              (sum, cartItem) =>
                sum + cartItem.article.price * cartItem.quantity,
              0
            );
            return {
              items: updatedItems,
              totalItems: newTotalItems,
              totalPrice: newTotalPrice,
            };
          }
        });
      },
      removeItem: (itemId) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (cartItem) => cartItem.article.id === itemId
          );

          if (existingItemIndex !== -1) {
            const existingItem = state.items[existingItemIndex];
            if (existingItem.quantity > 1) {
              const updatedItems = state.items.map((cartItem) =>
                cartItem.article.id === itemId
                  ? { ...cartItem, quantity: cartItem.quantity - 1 }
                  : cartItem
              );
              const newTotalItems = updatedItems.reduce(
                (sum, cartItem) => sum + cartItem.quantity,
                0
              );
              const newTotalPrice = updatedItems.reduce(
                (sum, cartItem) =>
                  sum + cartItem.article.price * cartItem.quantity,
                0
              );
              return {
                items: updatedItems,
                totalItems: newTotalItems,
                totalPrice: newTotalPrice,
              };
            } else {
              const updatedItems = state.items.filter(
                (cartItem) => cartItem.article.id !== itemId
              );
              const newTotalItems = updatedItems.reduce(
                (sum, cartItem) => sum + cartItem.quantity,
                0
              );
              const newTotalPrice = updatedItems.reduce(
                (sum, cartItem) =>
                  sum + cartItem.article.price * cartItem.quantity,
                0
              );
              return {
                items: updatedItems,
                totalItems: newTotalItems,
                totalPrice: newTotalPrice,
              };
            }
          }
          return state; // Return the current state if the item doesn't exist
        });
      },
      clearItem: (itemId) => {
        set((state) => {
          const updatedItems = state.items.filter(
            (cartItem) => cartItem.article.id !== itemId
          );
          const newTotalItems = updatedItems.reduce(
            (sum, cartItem) => sum + cartItem.quantity,
            0
          );
          const newTotalPrice = updatedItems.reduce(
            (sum, cartItem) => sum + cartItem.article.price * cartItem.quantity,
            0
          );
          return {
            items: updatedItems,
            totalItems: newTotalItems,
            totalPrice: newTotalPrice,
          };
        });
      },
      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 });
      },
      updateItemQuantity: (itemId, quantity) => {
        set((state) => {
          const updatedItems = state.items.map(
            (cartItem) =>
              cartItem.article.id === itemId
                ? { ...cartItem, quantity: Math.max(1, quantity) }
                : cartItem // Ensure quantity is at least 1
          );
          const newTotalItems = updatedItems.reduce(
            (sum, cartItem) => sum + cartItem.quantity,
            0
          );
          const newTotalPrice = updatedItems.reduce(
            (sum, cartItem) => sum + cartItem.article.price * cartItem.quantity,
            0
          );
          return {
            items: updatedItems,
            totalItems: newTotalItems,
            totalPrice: newTotalPrice,
          };
        });
      },
      getItemsByRestaurant: (restaurantId: number) => {
        return get().items.filter(
          (item) => item.article.restaurantId === restaurantId
        );
      },
      getTotalItemsByRestaurantId: (restaurantId: number) => {
        // Implémentation de la nouvelle fonction
        return get()
          .items.filter((item) => item.article.restaurantId === restaurantId)
          .reduce((sum, item) => sum + item.quantity, 0);
      },
      clearCartForRestaurant: (restaurantId: number) => {
        set((state) => {
          const updatedItems = state.items.filter(
            (item) => item.article.restaurantId !== restaurantId
          );
          const newTotalItems = updatedItems.reduce(
            (sum, cartItem) => sum + cartItem.quantity,
            0
          );
          const newTotalPrice = updatedItems.reduce(
            (sum, cartItem) => sum + cartItem.article.price * cartItem.quantity,
            0
          );
          return {
            items: updatedItems,
            totalItems: newTotalItems,
            totalPrice: newTotalPrice,
          };
        });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
    }
  )
);

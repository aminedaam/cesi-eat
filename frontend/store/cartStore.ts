import { Article } from "@/types/Articles";
import { Menu } from "@/types/Menu";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Define the structure for items in the articles array
export interface ArticleCartItem {
  item: Article;
  quantity: number;
}

// Define the structure for items in the menus array
export interface MenuCartItem {
  item: Menu;
  quantity: number;
}

// Helper function to calculate totals from separate arrays
const calculateTotals = (
  articles: ArticleCartItem[],
  menus: MenuCartItem[]
) => {
  let totalItems = 0;
  let totalPrice = 0;

  articles.forEach((articleItem) => {
    // Basic safety check for item and price
    if (articleItem?.item?.price) {
      totalItems += articleItem.quantity;
      totalPrice += articleItem.item.price * articleItem.quantity;
    } else {
      console.warn(
        "Skipping invalid article item in total calculation:",
        articleItem
      );
    }
  });

  menus.forEach((menuItem) => {
    // Basic safety check for item and price
    if (menuItem?.item?.priceMenu) {
      totalItems += menuItem.quantity;
      totalPrice += menuItem.item.priceMenu * menuItem.quantity;
    } else {
      console.warn(
        "Skipping invalid menu item in total calculation:",
        menuItem
      );
    }
  });

  return { totalItems, totalPrice };
};

interface CartState {
  articles: ArticleCartItem[]; // Separate array for articles
  menus: MenuCartItem[]; // Separate array for menus
  totalItems: number;
  totalPrice: number;
  addArticle: (article: Article) => void;
  addMenu: (menu: Menu) => void;
  // Keep itemType in signatures to know which array to target
  removeItem: (itemId: number, itemType: "article" | "menu") => void;
  clearItem: (itemId: number, itemType: "article" | "menu") => void;
  clearCart: () => void;
  updateItemQuantity: (
    itemId: number,
    quantity: number,
    itemType: "article" | "menu"
  ) => void;
  // This function signature might need adjustment depending on desired output
  getItemsByRestaurant: (
    restaurantId: number
  ) => (ArticleCartItem | MenuCartItem)[]; // Combine results
  getTotalItemsByRestaurantId: (restaurantId: number) => number;
  clearCartForRestaurant: (restaurantId: number) => void;
}

// Create the store with persistence in localStorage
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      articles: [], // Initialize articles array
      menus: [], // Initialize menus array
      totalItems: 0,
      totalPrice: 0,

      addArticle: (article) => {
        set((state) => {
          // Safety check for the article being added
          if (!article || typeof article.id === "undefined") {
            console.error("Attempted to add invalid article:", article);
            return state;
          }
          console.log("Adding article to cart:", article);
          const existingItemIndex = state.articles.findIndex(
            (articleItem) => articleItem.item.id === article.id
          );

          let updatedArticles: ArticleCartItem[];

          if (existingItemIndex !== -1) {
            // Item exists, increment quantity
            updatedArticles = state.articles.map((articleItem, index) =>
              index === existingItemIndex
                ? { ...articleItem, quantity: articleItem.quantity + 1 }
                : articleItem
            );
          } else {
            // Item does not exist, add new item
            const newItem: ArticleCartItem = { item: article, quantity: 1 };
            updatedArticles = [...state.articles, newItem];
          }

          const { totalItems, totalPrice } = calculateTotals(
            updatedArticles,
            state.menus
          );
          return {
            articles: updatedArticles, // Update only articles
            menus: state.menus, // Keep menus as is
            totalItems,
            totalPrice,
          };
        });
      },

      addMenu: (menu) => {
        set((state) => {
          // Safety check for the menu being added
          if (!menu || typeof menu.id === "undefined") {
            console.error("Attempted to add invalid menu:", menu);
            return state;
          }
          console.log("Adding menu to cart:", menu);
          const existingItemIndex = state.menus.findIndex(
            (menuItem) => menuItem.item.id === menu.id
          );

          let updatedMenus: MenuCartItem[];

          if (existingItemIndex !== -1) {
            // Item exists, increment quantity
            updatedMenus = state.menus.map((menuItem, index) =>
              index === existingItemIndex
                ? { ...menuItem, quantity: menuItem.quantity + 1 }
                : menuItem
            );
          } else {
            // Item does not exist, add new item
            const newItem: MenuCartItem = { item: menu, quantity: 1 };
            updatedMenus = [...state.menus, newItem];
          }

          const { totalItems, totalPrice } = calculateTotals(
            state.articles,
            updatedMenus
          );
          return {
            articles: state.articles, // Keep articles as is
            menus: updatedMenus, // Update only menus
            totalItems,
            totalPrice,
          };
        });
      },

      removeItem: (itemId, itemType) => {
        set((state) => {
          let updatedArticles = state.articles;
          let updatedMenus = state.menus;
          let itemFound = false;

          if (itemType === "article") {
            const existingItemIndex = state.articles.findIndex(
              (item) => item.item.id === itemId
            );
            if (existingItemIndex !== -1) {
              itemFound = true;
              const existingItem = state.articles[existingItemIndex];
              if (existingItem.quantity > 1) {
                updatedArticles = state.articles.map((item, index) =>
                  index === existingItemIndex
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
                );
              } else {
                updatedArticles = state.articles.filter(
                  (_, index) => index !== existingItemIndex
                );
              }
            }
          } else {
            // itemType === 'menu'
            const existingItemIndex = state.menus.findIndex(
              (item) => item.item.id === itemId
            );
            if (existingItemIndex !== -1) {
              itemFound = true;
              const existingItem = state.menus[existingItemIndex];
              if (existingItem.quantity > 1) {
                updatedMenus = state.menus.map((item, index) =>
                  index === existingItemIndex
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
                );
              } else {
                updatedMenus = state.menus.filter(
                  (_, index) => index !== existingItemIndex
                );
              }
            }
          }

          if (!itemFound) return state; // Do nothing if item wasn't found

          const { totalItems, totalPrice } = calculateTotals(
            updatedArticles,
            updatedMenus
          );
          return {
            articles: updatedArticles,
            menus: updatedMenus,
            totalItems,
            totalPrice,
          };
        });
      },

      clearItem: (itemId, itemType) => {
        set((state) => {
          let updatedArticles = state.articles;
          let updatedMenus = state.menus;
          let changed = false;

          if (itemType === "article") {
            const initialLength = state.articles.length;
            updatedArticles = state.articles.filter(
              (item) => item.item.id !== itemId
            );
            if (updatedArticles.length !== initialLength) changed = true;
          } else {
            // itemType === 'menu'
            const initialLength = state.menus.length;
            updatedMenus = state.menus.filter(
              (item) => item.item.id !== itemId
            );
            if (updatedMenus.length !== initialLength) changed = true;
          }

          if (!changed) return state; // No change, return current state

          const { totalItems, totalPrice } = calculateTotals(
            updatedArticles,
            updatedMenus
          );
          return {
            articles: updatedArticles,
            menus: updatedMenus,
            totalItems,
            totalPrice,
          };
        });
      },

      clearCart: () => {
        // Clear both arrays and reset totals
        set({ articles: [], menus: [], totalItems: 0, totalPrice: 0 });
      },

      updateItemQuantity: (itemId, quantity, itemType) => {
        set((state) => {
          const newQuantity = Math.max(1, quantity); // Ensure quantity is at least 1
          let updatedArticles = state.articles;
          let updatedMenus = state.menus;
          let itemFoundAndUpdated = false;

          if (itemType === "article") {
            updatedArticles = state.articles.map((item) => {
              if (item.item.id === itemId) {
                if (item.quantity !== newQuantity) {
                  itemFoundAndUpdated = true;
                  return { ...item, quantity: newQuantity };
                }
                itemFoundAndUpdated = true; // Mark as found even if quantity didn't change
              }
              return item;
            });
          } else {
            // itemType === 'menu'
            updatedMenus = state.menus.map((item) => {
              if (item.item.id === itemId) {
                if (item.quantity !== newQuantity) {
                  itemFoundAndUpdated = true;
                  return { ...item, quantity: newQuantity };
                }
                itemFoundAndUpdated = true;
              }
              return item;
            });
          }

          // Only recalculate if an item was actually found (and potentially updated)
          if (!itemFoundAndUpdated) {
            return state;
          }

          const { totalItems, totalPrice } = calculateTotals(
            updatedArticles,
            updatedMenus
          );
          return {
            articles: updatedArticles,
            menus: updatedMenus,
            totalItems,
            totalPrice,
          };
        });
      },

      // Returns a combined array of article and menu items for the specific restaurant
      getItemsByRestaurant: (restaurantId: number) => {
        const state = get(); // Get current state { articles, menus }

        const restaurantArticles = state.articles.filter(
          (articleItem) => articleItem.item?.restaurant?.id === restaurantId
        );

        const restaurantMenus = state.menus.filter(
          (menuItem) => menuItem.item?.restaurant?.id === restaurantId
        );

        // Combine the results into a single array
        // Note: The elements will have different types (ArticleCartItem | MenuCartItem)
        return [...restaurantArticles, ...restaurantMenus];
      },

      // Calculates total quantity of items (articles + menus) for a specific restaurant
      getTotalItemsByRestaurantId: (restaurantId: number) => {
        const state = get();
        let count = 0;

        state.articles.forEach((item) => {
          if (item.item?.restaurant?.id === restaurantId) {
            count += item.quantity;
          }
        });
        state.menus.forEach((item) => {
          if (item.item?.restaurant?.id === restaurantId) {
            count += item.quantity;
          }
        });
        return count;

        // Alternative using the combined array from getItemsByRestaurant:
        // return get().getItemsByRestaurant(restaurantId).reduce((sum, item) => sum + item.quantity, 0);
      },

      // Clears both articles and menus belonging to a specific restaurant
      clearCartForRestaurant: (restaurantId: number) => {
        set((state) => {
          const initialArticleCount = state.articles.length;
          const initialMenuCount = state.menus.length;

          const updatedArticles = state.articles.filter(
            (item) => item.item?.restaurant?.id !== restaurantId
          );
          const updatedMenus = state.menus.filter(
            (item) => item.item?.restaurant?.id !== restaurantId
          );

          // Only update state if items actually changed in either array
          if (
            updatedArticles.length === initialArticleCount &&
            updatedMenus.length === initialMenuCount
          ) {
            return state;
          }

          const { totalItems, totalPrice } = calculateTotals(
            updatedArticles,
            updatedMenus
          );
          return {
            articles: updatedArticles,
            menus: updatedMenus,
            totalItems,
            totalPrice,
          };
        });
      },
    }),
    {
      name: "cart-storage", // Make sure persistence still works as expected
      storage: createJSONStorage(() => localStorage),
      // You might need a custom merge function if you migrate existing localStorage data
      // from the old 'items' structure to the new 'articles'/'menus' structure.
      // For a fresh start, this is fine.
    }
  )
);

import { login } from "@/utils/apiUser";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useCartStore } from "./cartStore";
import { useUserStore } from "./userStore";

// Interface defining the state structure and actions
interface AuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the store with persistence in localStorage
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      isLoggedIn: false,
      accessToken: null,
      setAccessToken: (token: string) => set({ accessToken: token }),

      // Action to handle login
      login: async (email: string, password: string) => {
        try {
          const token = await login(email, password);

          if (token) {
            set({
              isLoggedIn: true,
              accessToken: token,
            });
            // Optionally, you could set Axios default headers here if needed
            // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          } else {
            // Handle cases where login succeeds but no token is returned (if possible)
            console.warn("Login successful but no token received.");
            // Optionally clear state if this is considered an error case
            // set({ isLoggedIn: false, accessToken: null });
          }
        } catch (error) {
          console.error("Login failed:", error);
          set({ isLoggedIn: false, accessToken: null });
          throw error;
        }
      },

      logout: () => {
        set({ isLoggedIn: false, accessToken: null });
        const clearCart = useCartStore.getState().clearCart;
        clearCart();
        const clearUser = useUserStore.getState().clearUser;
        clearUser();

        // Optionally, remove the token from Axios default headers
        // delete axios.defaults.headers.common['Authorization'];
        // Perform other cleanup actions if necessary.
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
    }
  )
);

import { login } from "@/utils/apiUser";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import { useCartStore } from "./cartStore";

// Interface defining the state structure and actions
interface AuthState {
  email: string | null;
  role: string | null;
  isLoggedIn: boolean;
  accessToken: string | null;
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
      email: null,
      role: null,

      // Action to handle login
      login: async (email: string, password: string) => {
        try {
          const token = await login(email, password);

          if (token) {
            const decoded = jwtDecode<{ sub: string; role: string }>(token);
            set({
              isLoggedIn: true,
              accessToken: token,
              email: decoded.sub,
              role: decoded.role,
            });
            console.log(decoded.sub);
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
        set({ isLoggedIn: false, accessToken: null, email: null });
        const clearCart = useCartStore.getState().clearCart;
        clearCart();

        
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
import { login } from "@/utils/api";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Interface defining the state structure and actions
interface AuthState {
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

      // Action to handle login
      login: async (email: string, password: string) => {
        try {
          const token = await login(email, password);
          if (email === "test@gmail.com") {
            set({ isLoggedIn: false, accessToken: null });
            throw new Error("Unvalid username or password.");
          }

          if (token) {
            set({ isLoggedIn: true, accessToken: token });
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

// --- How to use this store ---
/*
import { useAuthStore } from './path/to/useAuthStore';
import { useState } from 'react';

function LoginComponent() {
  const login = useAuthStore((state) => state.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Use the actual login function from the store
      await login(username, password);
      // On success, Zustand state updates automatically.
      // Redirect user or update UI here.
      console.log('Login successful!');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error(err); // Log the actual error from the API/store
    } finally {
      setLoading(false);
    }
  };

  // ... JSX for the login form using username, password, handleLoginSubmit, loading, error
}

function UserProfile() {
  const { isLoggedIn, accessToken } = useAuthStore((state) => ({
    isLoggedIn: state.isLoggedIn,
    accessToken: state.accessToken,
  }));
  const logout = useAuthStore((state) => state.logout);

  if (!isLoggedIn) {
    return <p>Please log in.</p>;
  }

  return (
    <div>
      <p>Welcome! Your token: {accessToken?.substring(0, 10)}...</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
*/

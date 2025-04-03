// utils/api.tsx
import { User } from "@/types/User";
import axios from "axios";

// Créez l'instance Axios avec la bonne baseURL
const apiClient = axios.create({
  // Assurez-vous que la baseURL est correcte et complète
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://172.16.10.12:4000", // Utiliser une variable d'env est préférable
  timeout: 5000, // Garder le timeout
});

export const register = async (userData: User) => {
  try {
    const response = await apiClient.post("/users/create", userData);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la création de l'utilisateur:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la création de l'utilisateur:",
        error
      );
    }
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post("/users/login", { email, password });
    return response.data.token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la connexion de l'utilisateur:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la connexion de l'utilisateur:",
        error
      );
    }
    throw error;
  }
};

export const getMe = async (token : string) => {
  try {
      const response = await apiClient.get('/users/me', {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      return response.data;
  } catch (error) {
      console.error('Erreur lors de la récupération des données de l\'utilisateur', error);
      throw error;
  }
};

// Vous pouvez garder l'ancienne fonction si elle sert ailleurs, sinon supprimez-la
/*
export const register = async () => {
    try {
      const response = await apiClient.get("/user/create"); // Ceci était incorrect pour la création
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
      throw error;
    }
  };
*/

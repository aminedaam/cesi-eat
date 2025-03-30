// utils/api.tsx
import { User } from "@/types/User";
import axios from "axios";

// Créez l'instance Axios avec la bonne baseURL
const apiClient = axios.create({
  // Assurez-vous que la baseURL est correcte et complète
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://172.16.10.12:4001", // Utiliser une variable d'env est préférable
  timeout: 5000, // Garder le timeout
  headers: {
    "Content-Type": "application/json", // Définir le header par défaut ici
  },
});

// Renommer la fonction et la corriger pour utiliser POST et accepter des données
export const register = async (userData: User) => {
  try {
    // Utiliser apiClient.post avec l'URL relative et les données utilisateur
    const response = await apiClient.post("/user/create", userData);
    // Retourner les données de la réponse en cas de succès
    return response.data;
  } catch (error) {
    // Log l'erreur spécifique d'Axios si possible
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
    // Re-lancer l'erreur pour que le composant appelant puisse la gérer (par exemple, afficher un message à l'utilisateur)
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post("/user/login", { email, password });
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

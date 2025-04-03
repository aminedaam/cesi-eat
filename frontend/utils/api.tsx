// utils/api.tsx
import { User } from "@/types/User";
import axios from "axios";

// Créez l'instance Axios avec la bonne baseURL
const serverURL = "http://172.16.10.12:4001/users/";

const apiUser = axios.create({
  baseURL: serverURL,
  timeout: 5000,
});

export const register = async (userData: User) => {
  try {
    const response = await apiUser.post("/create", userData);
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
    const response = await apiUser.post("/login", { email, password });
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

export const getMe = async (token: string) => {
  try {
    console.log(token);
    const response = await apiUser.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la récupération des données de l'utilisateur:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la récupération des données de l'utilisateur:",
        error
      );
    }
    throw error;
  }
};

export const updateUser = async (
  userId: number,
  userData: Partial<User>,
  token: string
) => {
  try {
    const response = await apiUser.put(`/update/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la mise à jour de l'utilisateur:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la mise à jour de l'utilisateur:",
        error
      );
    }
    throw error;
  }
};

export const updatePassword = async (
  userId: number,
  newPassword: string,
  token: string
) => {
  try {
    const response = await apiUser.put(
      `/update-password/${userId}`,
      { password: newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la mise à jour du mot de passe de l'utilisateur:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la mise à jour du mot de passe de l'utilisateur:",
        error
      );
    }
    throw error;
  }
};

export const deleteUser = async (userId: number, token: string) => {
  try {
    const response = await apiUser.delete(`/delete/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la suppression de l'utilisateur:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la suppression de l'utilisateur:",
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

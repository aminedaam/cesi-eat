// utils/api.tsx
import { User } from "@/types/User";
import axios from "axios";
import { serverURL } from "./serverURL";

const apiUser = axios.create({
  baseURL: serverURL + "/users/",
  timeout: 5000,
});

export const register = async (userData: User) => {
  try {
    const response = await apiUser.post("/create", userData);
    console.log("Utilisateur créé avec succès:", response);
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
  email: number,
  userData: Partial<User>,
  token: string
) => {
  try {
    const response = await apiUser.put(`/update-profil/${email}`, userData, {
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
  id: number,
  oldPassword: string,
  newPassword: string,
  token: string
) => {
  try {
    const response = await apiUser.put(
      `/update-password/${id}`,
      { oldPassword: oldPassword, newPassword: newPassword },
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

export const deleteUser = async (email: string, token: string) => {
  try {
    console.log("email!", email)
    const response = await apiUser.delete(`delete/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Utilisateur supprimé avec succès:", response);
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

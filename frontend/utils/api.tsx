// utils/api.tsx
import { User } from "@/types/User";
import axios from "axios";

// Créez l'instance Axios avec la bonne baseURL
const serverURL = "http://localhost:4001";

const apiUser = axios.create({
  baseURL: serverURL,
  timeout: 5000,
});

export const register = async (userData: User) => {
  try {
    const response = await apiUser.post("/users/create", userData);
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
    const response = await apiUser.post("/users/login", { email, password });
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
    const response = await apiUser.get("users/me", {
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
  email: string,
  userData: Partial<User>,
  token: string
) => {
  try {
    const response = await apiUser.put(`/update/${email}`, userData, {
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
  email: string,
  oldPassword: string,
  newPassword: string,
  token: string
) => {
  try {
    const response = await apiUser.put(
      `/updatePassword/${email}`,
      { oldPassword: newPassword, newPassword: oldPassword },
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
    const response = await apiUser.delete(`/delete/${email  }`, {
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

import axios from "axios";
import { serverURL } from "./serverURL";
import { Article } from "@/types/Articles";
import { Menu } from "@/types/Menu";

const apiStatistics = axios.create({
  baseURL: serverURL + "/statistiques/",
  timeout: 5000,
});

export const getTotalCommandes = async (
  restaurantId: number,
  token: string
) => {
  try {
    const response = await apiStatistics.get(`totalCommandes/${restaurantId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la récupération du total des commandes:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la récupération du total des commandes:",
        error
      );
    }
    throw error;
  }
};

export const getRecette = async (restaurantId: number, token: string) => {
  try {
    const response = await apiStatistics.get(`recette/${restaurantId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la récupération de la recette:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la récupération de la recette:",
        error
      );
    }
    throw error;
  }
};

export const getBestArticle = async (
  restaurantId: number,
  token: string
): Promise<Article> => {
  try {
    const response = await apiStatistics.get(`bestArticle/${restaurantId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la récupération du meilleur article:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la récupération du meilleur article:",
        error
      );
    }
    throw error;
  }
};

export const getBestMenu = async (
  restaurantId: number,
  token: string
): Promise<Menu> => {
  try {
    const response = await apiStatistics.get(`bestMenu/${restaurantId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la récupération du meilleur menu:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la récupération du meilleur menu:",
        error
      );
    }
    throw error;
  }
};

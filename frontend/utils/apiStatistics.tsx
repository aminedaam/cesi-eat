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

export const getWorstMenu = async (
  restaurantId: number,
  token: string
): Promise<Menu> => {
  try {
    const response = await apiStatistics.get(`worstMenu/${restaurantId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la récupération du pire menu:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la récupération du pire menu:",
        error
      );
    }
    throw error;
  }
};

export const getWorstArticle = async (
  restaurantId: number,
  token: string
): Promise<Article> => {
  try {
    const response = await apiStatistics.get(`worstArticle/${restaurantId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la récupération du pire article:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la récupération du pire article:",
        error
      );
    }
    throw error;
  }
};

export const getCountArticles = async (
  restaurantId: number,
  articleId: string,
  token: string
): Promise<number> => {
  try {
    const response = await apiStatistics.get(
      `getCountArticles/restaurant/${restaurantId}/article/${articleId}`,
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
        "Erreur API lors de la récupération du nombre d'articles:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la récupération du nombre d'articles:",
        error
      );
    }
    throw error;
  }
};

export const getCountMenus = async (
  restaurantId: number,
  menuId: string,
  token: string
): Promise<number> => {
  try {
    const response = await apiStatistics.get(
      `getCountMenus/restaurant/${restaurantId}/menu/${menuId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la récupération du nombre de menus:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la récupération du nombre de menus:",
        error
      );
    }
    throw error;
  }
};

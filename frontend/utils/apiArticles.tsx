import { Article } from "@/types/Articles";
import axios from "axios";
import { serverURL } from "./serverURL";
import { RestaurantCategory } from "@/types/RestaurantCategory";

const apiArticle = axios.create({
  baseURL: serverURL + "/articles",
  timeout: 5000,
});

export const getAllArticles = async (): Promise<Article[]> => {
  try {
    const response = await apiArticle.get("/all", {});
    const articles: Article[] = response.data;
    console.log("Données des articles récupérées:", articles);
    return articles;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la récupération des données des articles:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la récupération des données des articles :",
        error
      );
    }
    throw error;
  }
};

export const getArticleById = async (
  id: number,
  token: string
): Promise<Article> => {
  try {
    console.log(apiArticle.defaults.baseURL);
    const response = await apiArticle.get(`/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const article: Article = response.data;
    console.log("Données de l'article récupérées:", article);
    return article;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la récupération des données de l'article:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la récupération des données de l'article :",
        error
      );
    }
    throw error;
  }
};

export const createArticle = async (
  article: Article,
  token: string
): Promise<Article> => {
  try {
    console.log("Création de l'article:", article);
    const response = await apiArticle.post("/create", article, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const createdArticle: Article = response.data;
    console.log("Article créé avec succès:", createdArticle);
    return createdArticle;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la création de l'article:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la création de l'article :",
        error
      );
    }
    throw error;
  }
};

//update article
export const updateArticle = async (
  article: Article,
  token: string
): Promise<Article> => {
  try {
    const response = await apiArticle.put(`/update/${article.id}`, article, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const updatedArticle: Article = response.data;
    console.log("Article mis à jour avec succès:", updatedArticle);
    return updatedArticle;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la mise à jour de l'article:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la mise à jour de l'article :",
        error
      );
    }
    throw error;
  }
};

// delete article
export const deleteArticle = async (
  id: number,
  token: string
): Promise<void> => {
  try {
    await apiArticle.delete(`/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Article supprimé avec succès");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la suppression de l'article:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la suppression de l'article :",
        error
      );
    }
    throw error;
  }
};

export const getArticlesByRestaurantName = async (
  name: string
): Promise<Article[]> => {
  try {
    const response = await apiArticle.get(`/restaurantName/${name}`);
    const articles: Article[] = response.data;
    console.log("Articles récupérés par nom de restaurant:", articles);
    return articles;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la récupération des articles par nom de restaurant:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la récupération des articles par nom de restaurant :",
        error
      );
    }
    throw error;
  }
};

export const getArticlesByRestaurantId = async (
  restaurantId: number,
  token: string
): Promise<Article[]> => {
  try {
    const response = await apiArticle.get(`/restaurantId/${restaurantId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const articles: Article[] = response.data;
    console.log("Données des articles récupérées:", response.data);
    for (let i = 0; i < response.data.length; i++) {
      if (!response.data[i].menu) {
        articles[i].menuId = null; // ou une autre valeur par défaut
      } else {
        articles[i].menuId = response.data[i].menu.id;
      }

      // Ajouter la propriété restaurant à chaque article
      if (!articles[i].restaurant) {
        articles[i].restaurant = {
          id: restaurantId,
          name: "",
          categorie: RestaurantCategory.BURGER,
          address: "",
          codePostal: "",
          country: "",
          city: "",
          latitude: 0,
          longitude: 0,
          imagePath: "",
          description: "",
          delevryCost: 0,
          email: "",
          closingTime: "",
          phoneNumber: "",
          averageRate: 0,
          nbRate: 0,
          createdAt: new Date(),
        };
      }
    }

    console.log("Articles récupérés par ID de restaurant:", articles);
    return articles;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la récupération des articles par ID de restaurant:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la récupération des articles par ID de restaurant :",
        error
      );
    }
    throw error;
  }
};

export const getArticlesByMenuId = async (
  menuId: number,
  token: string
): Promise<Article[]> => {
  try {
    const response = await apiArticle.get(`/menu/${menuId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Articles for menu id : ", response.data);
    const articles: Article[] = response.data;

    console.log("Articles récupérés par ID de menu:", articles);
    return articles;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la récupération des articles par ID de menu:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la récupération des articles par ID de menu :",
        error
      );
    }
    throw error;
  }
};

export const getArticlesByProduit = async (
  typeProduit: string
): Promise<Article[]> => {
  try {
    const response = await apiArticle.get(`/produit/${typeProduit}`);
    const articles: Article[] = response.data;
    console.log("Articles récupérés par type de produit:", articles);
    return articles;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la récupération des articles par type de produit:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la récupération des articles par type de produit :",
        error
      );
    }
    throw error;
  }
};

export const getArticlesByProduitAndRestaurantId = async (
  typeProduit: string,
  restaurantId: number
): Promise<Article[]> => {
  try {
    const response = await apiArticle.get(
      `/produit/${typeProduit}/restaurant/${restaurantId}`
    );
    const articles: Article[] = response.data;
    console.log(
      "Articles récupérés par type de produit et ID de restaurant:",
      articles
    );
    return articles;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la récupération des articles par type de produit et ID de restaurant:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la récupération des articles par type de produit et ID de restaurant :",
        error
      );
    }
    throw error;
  }
};

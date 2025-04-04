// import { Restaurant } from "@/types/Restaurants";
// import { RestaurantArticle } from "@/types/RestaurantArticle";
import axios from "axios";
import { serverURL } from "./serverURL";

const apiRestaurant = axios.create({
  baseURL: serverURL + "restaurant/",
  timeout: 5000,
});

export const getRestaurantById = async (id: number, token: string) => {
  try {
    const response = await apiRestaurant.get(`/${id}`, {
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

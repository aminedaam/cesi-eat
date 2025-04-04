// import { Restaurant } from "@/types/Restaurants";
// import { RestaurantArticle } from "@/types/RestaurantArticle";
import axios from "axios";
import { serverURL } from "./serverURL";
import { Restaurant } from "@/types/Restaurants";

const apiRestaurant = axios.create({
  baseURL: serverURL + "/restaurants",
  timeout: 5000,
});

export const getAllRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const response = await apiRestaurant.get("/all", {});
    const restaurants: Restaurant[] = response.data;
    console.log("Données des restaurants récupérées:", restaurants);
    return restaurants;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la récupération des données des restaurants:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la récupération des données des restaurants :",
        error
      );
    }
    throw error;
  }
};

export const getRestaurantById = async (id: number): Promise<Restaurant> => {
  try {
    console.log(apiRestaurant.defaults.baseURL);
    const response = await apiRestaurant.get(`/${id}`, {});
    const restaurant: Restaurant = response.data;
    console.log("Données du restaurant récupérées:", restaurant);
    return restaurant;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la récupération des données du restaurant:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la récupération des données du restaurant :",
        error
      );
    }
    throw error;
  }
};

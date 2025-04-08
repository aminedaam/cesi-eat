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

export const getRestaurantById = async (
  id: number,
  token: string
): Promise<Restaurant> => {
  try {
    console.log(apiRestaurant.defaults.baseURL);
    const response = await apiRestaurant.get(`/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
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

export const createRestaurant = async (
  restaurant: Restaurant,
  token: string
): Promise<Restaurant> => {
  try {
    console.log("Restaurant : ", restaurant);

    const response = await apiRestaurant.post("/create", restaurant, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const createdRestaurant: Restaurant = response.data;
    console.log("Restaurant créé avec succès:", createdRestaurant);
    return createdRestaurant;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la création du restaurant:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la création du restaurant :",
        error
      );
    }
    throw error;
  }
};

//update restaurant
export const updateRestaurant = async (
  restaurant: Restaurant,
  token: string
): Promise<Restaurant> => {
  try {
    const response = await apiRestaurant.put(
      `/update/${restaurant.id}`,
      restaurant,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const updatedRestaurant: Restaurant = response.data;
    console.log("Restaurant mis à jour avec succès:", updatedRestaurant);
    return updatedRestaurant;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la mise à jour du restaurant:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la mise à jour du restaurant :",
        error
      );
    }
    throw error;
  }
};

// delete restaurant
export const deleteRestaurant = async (
  id: number,
  token: string
): Promise<void> => {
  try {
    await apiRestaurant.delete(`/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Restaurant supprimé avec succès");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la suppression du restaurant:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la suppression du restaurant :",
        error
      );
    }
    throw error;
  }
};


// ajoute cette route myRestaurants
export const getMyRestaurants = async (token: string): Promise<Restaurant[]> => {
  try {
    const response = await apiRestaurant.get("/myRestaurants", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur API lors de la récupération de mes restaurants:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erreur inattendue lors de la récupération de mes restaurants:",
        error
      );
    }
    throw error;
  }
};


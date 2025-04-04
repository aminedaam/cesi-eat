import { Position } from "@/types/Position";
import { Restaurant } from "@/types/Restaurants";
import { calculateDistance } from "./calculateDistance";

export async function orderRestaurantsByDistance(
    restaurants: Restaurant[],
    location: Position
  ): Promise<{ restaurant: Restaurant; distance: number }[]> {
    const distances = await Promise.all(
      restaurants.map(async (restaurant) => {
        const distance = await calculateDistance(location, restaurant.position);
        return { restaurant, distance };
      })
    );
  
    return distances.sort((a, b) => a.distance - b.distance);
  }
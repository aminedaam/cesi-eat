import { Restaurant } from "@/types/Restaurants";
import { Position } from "@/types/Position";
import { calculateDistance } from "./calculateDistance"; // Assurez-vous que le chemin est correct

export async function orderRestaurantsByDistance(
  restaurants: Restaurant[],
  location: Position
): Promise<Restaurant[]> {
  const restaurantsWithDistances = await Promise.all(
    restaurants.map(async (restaurant) => {
      if (!restaurant.latitude || !restaurant.longitude) {
        return { ...restaurant, distanceFromUser: Infinity };
      }
      const distance = await calculateDistance(
        location.latitude,
        location.longitude,
        restaurant.latitude,
        restaurant.longitude
      );
      return { ...restaurant, distanceFromUser: distance };
    })
  );

  return restaurantsWithDistances.sort(
    (a, b) =>
      (a.distanceFromUser || Infinity) - (b.distanceFromUser || Infinity)
  );
}

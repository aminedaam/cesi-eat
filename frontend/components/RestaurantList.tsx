import Image from "next/image";
import { CustomButton } from "./helper-components/CustomButton";
import { Restaurant } from "@/types/Restaurants";
import { useEffect, useState } from "react";
import LoadingSpinner from "./helper-components/LoadingSpinner";
import { Position } from "@/types/Position";
import { useLocation } from "@/context/locationContext";

interface RestaurantListProps {
  restaurants: Restaurant[];
  filter: string;
}

// Le cache reste tel quel
const restaurantDistanceCache: {
  [key: string]: { restaurant: Restaurant; distance: number }[];
} = {};

export const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants,
  filter,
}) => {
  const { location, loading, error } = useLocation();

  const [orderedRestaurantsWithDistances, setOrderedRestaurantsWithDistances] =
    useState<{ restaurant: Restaurant; distance: number }[] | null>(null);

  const filteredRestaurants = orderedRestaurantsWithDistances?.filter((item) =>
    item.restaurant.name.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    if (
      location &&
      (!orderedRestaurantsWithDistances ||
        orderedRestaurantsWithDistances[0]?.restaurant.id !==
          restaurants[0]?.id)
    ) {
      const cacheKey = `${location.latitude}-${location.longitude}`;
      if (restaurantDistanceCache[cacheKey]) {
        console.log("Using cache for distances");
        setOrderedRestaurantsWithDistances(restaurantDistanceCache[cacheKey]);
      } else {
        console.log("Calculating distances...");
        orderRestaurantsByDistance(restaurants, location).then((result) => {
          console.log("Distances calculated, updating state and cache");
          restaurantDistanceCache[cacheKey] = result;
          setOrderedRestaurantsWithDistances(result);
        });
      }
    }
  }, [location, restaurants, orderedRestaurantsWithDistances]); // Ajout de orderedRestaurantsWithDistances pour la condition interne

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center">
        <LoadingSpinner />
        <p>Localisation en cours...</p>
      </div>
    );
  }

  if (error) {
    return <p>Erreur lors de la localisation: {error.message}</p>;
  }

  if (!location) {
    return <p>En attente de la localisation...</p>; // Ou un autre indicateur
  }

  if (
    !orderedRestaurantsWithDistances ||
    orderedRestaurantsWithDistances.length === 0
  ) {
    if (restaurants.length === 0) {
      return <p>Aucun restaurant à afficher.</p>;
    }
    return (
      <div className="w-full flex flex-col items-center">
        <LoadingSpinner />
        <p>Recherche des restaurants à proximité...</p>
      </div>
    );
  }

  if (!filteredRestaurants || !filteredRestaurants.length) {
    return (
      <p>
        Aucun restaurant trouvé correspondant au filtre &quot;{filter}&quot;
      </p>
    );
  }

  return (
    <ul className="list-none p-0">
      {filteredRestaurants.map((item, index) => (
        <RestaurantItem
          key={item.restaurant.id || index}
          restaurant={item.restaurant}
          distance={item.distance}
        />
      ))}
    </ul>
  );
};

interface RestaurantItemProps {
  restaurant: Restaurant;
  distance: number;
}

const RestaurantItem: React.FC<RestaurantItemProps> = ({
  restaurant,
  distance,
}) => (
  <li className="flex items-start mb-10">
    <Image
      src={restaurant.image}
      alt={restaurant.name}
      width={120}
      height={120}
      className="mr-3.5"
    />
    <div className="flex flex-col">
      <span className="font-bold text-xl mb-1">{restaurant.name}</span>
      <div className="mb-1.5 flex flex-col">
        <span className="text-gray-600">
          Frais de livraisons : {restaurant.deliveryCosts}€
        </span>
        <span className="text-gray-600">
          Distance : {distance.toFixed(2)} km
        </span>
      </div>
      <CustomButton
        className="w-30 text-black button-primary-50 rounded-xl text-sm"
        onClick={() => console.log("Je commande !")}
      >
        Je commande !
      </CustomButton>
    </div>
  </li>
);

async function orderRestaurantsByDistance(
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

async function calculateDistance(position1: Position, position2: Position) {
  const url = `http://router.project-osrm.org/route/v1/driving/${position1.longitude},${position1.latitude};${position2.longitude},${position2.latitude}?overview=false`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.routes && data.routes.length > 0) {
    return data.routes[0].distance / 1000; // Distance in km
  }
  return 0;
}

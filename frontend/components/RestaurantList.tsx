import Image from "next/image";
import { CustomButton } from "./helper-components/CustomButton";
import { Restaurant } from "@/types/Restaurants";
import { useEffect, useState } from "react";
import LoadingSpinner from "./helper-components/LoadingSpinner";
import { useGeolocation } from "@uidotdev/usehooks";
import { useLocationStore } from "@/store/locationStore";
import { Position } from "@/types/Position";

interface RestaurantListProps {
  restaurants: Restaurant[];
  filter: string;
}

const restaurantDistanceCache: {
  [key: string]: { restaurant: Restaurant; distance: number }[];
} = {};

export const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants,
  filter,
}) => {
  const { loading, latitude, longitude, error } = useGeolocation();
  const location = useLocationStore((state) => state.location);
  console.log("Location", location);

  const updateLocation = useLocationStore.getState().updateLocation;
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      updateLocation({
        latitude: latitude,
        longitude: longitude,
      });
    }
  }, [latitude, longitude, updateLocation]);
  const [orderedRestaurantsWithDistances, setOrderedRestaurantsWithDistances] =
    useState<{ restaurant: Restaurant; distance: number }[] | null>(null);

  const filteredRestaurants = orderedRestaurantsWithDistances?.filter((item) =>
    item.restaurant.name.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    if (location) {
      const cacheKey = `${location.latitude}-${location.longitude}`;
      if (restaurantDistanceCache[cacheKey]) {
        setOrderedRestaurantsWithDistances(restaurantDistanceCache[cacheKey]);
      } else {
        orderRestaurantsByDistance(restaurants, location).then((result) => {
          restaurantDistanceCache[cacheKey] = result;
          setOrderedRestaurantsWithDistances(result);
        });
      }
    }
  }, [location, restaurants]);

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center">
        <LoadingSpinner />
        <p>Localisation en cours...</p>
      </div>
    );
  }

  if (error) {
    return <p>Erreur lors de la local isation</p>;
  }

  if (
    !orderedRestaurantsWithDistances ||
    orderedRestaurantsWithDistances.length === 0
  ) {
    return (
      <div className="w-full flex flex-col items-center">
        <LoadingSpinner />
        <p>Recherche des restaurants à proximite...</p>
      </div>
    );
  }

  if (!filteredRestaurants || !filteredRestaurants.length) {
    return <p>Aucun restaurant trouvé</p>;
  }

  return (
    <ul className="list-none p-0">
      {filteredRestaurants.map((item, index) => (
        <RestaurantItem
          key={index}
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

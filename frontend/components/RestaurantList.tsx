import Image from "next/image";
import { CustomButton } from "./helper-components/CustomButton";
import { Restaurant } from "@/types/Restaurants";
import { useLocationStore } from "@/store/locationStore";
import { Position } from "@/types/Position";

interface RestaurantListProps {
  restaurants: Restaurant[];
}

export const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants,
}) => {
  const location = useLocationStore((state) => state.location);

  if (!location) {
    return <p>Chargement...</p>;
  }

  const orderedRestaurants = orderRestaurantsByDistance(restaurants, location);

  return (
    <ul className="list-none p-0">
      {orderedRestaurants.map((restaurant, index) => (
        <RestaurantItem
          key={index}
          restaurant={restaurant}
          userLocation={location}
        />
      ))}
    </ul>
  );
};

interface RestaurantItemProps {
  restaurant: Restaurant;
  userLocation: Position;
}

const RestaurantItem: React.FC<RestaurantItemProps> = ({
  restaurant,
  userLocation,
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
          À {calculateDistance(userLocation, restaurant.position)} km
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

function orderRestaurantsByDistance(
  restaurants: Restaurant[],
  location: Position
) {
  return restaurants.sort((a, b) => {
    const distanceA = calculateDistance(location, a.position);
    const distanceB = calculateDistance(location, b.position);
    return distanceA - distanceB;
  });
}

function calculateDistance(position1: Position, position2: Position) {
  const R = 6371e3; // metres
  const φ1 = (position1.latitude * Math.PI) / 180; // φ, λ in radians
  const φ2 = (position2.latitude * Math.PI) / 180;
  const Δφ = ((position2.latitude - position1.latitude) * Math.PI) / 180;
  const Δλ = ((position2.longitude - position1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceInMeters = R * c;
  const distanceInKm = distanceInMeters / 1000;

  return Math.round(distanceInKm * 10) / 10; // rounded to one decimal place
}

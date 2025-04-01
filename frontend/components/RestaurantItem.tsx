import { Restaurant } from "@/types/Restaurants";
import { CustomButton } from "./helper-components/CustomButton";
import Image from "next/image";

interface RestaurantItemProps {
  restaurant: Restaurant;
  distance: number;
}

export const RestaurantItem: React.FC<RestaurantItemProps> = ({
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
        <span className="text-gray-600">Distance : {distance.toFixed(2)} km</span>
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
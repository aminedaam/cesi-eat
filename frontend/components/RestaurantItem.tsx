import { Restaurant } from "@/types/Restaurants";
import Image from "next/image";
import { CustomButton } from "./helper-components/CustomButton";
import Link from "next/link";

interface RestaurantItemProps {
  restaurant: Restaurant;
  distance?: number;
}

export const RestaurantItem: React.FC<RestaurantItemProps> = ({
  restaurant,
  distance,
}) => (
  <div className="flex flex-col h-full">
    <div className="relative w-full aspect-[4/3]">
      <Image
        src={restaurant.imagePath ?? "/burger.png"}
        alt={restaurant.name}
        fill
        className="object-cover"
      />
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="font-bold text-xl mb-2 line-clamp-1">{restaurant.name}</h3>
      <div className="space-y-1 mb-4">
        <p className="text-gray-600 text-sm">
          Frais de livraison : {restaurant.delevryCost}€
        </p>
        {distance !== undefined && distance !== null && (
          <p className="text-gray-600 text-sm">
            Distance : {distance.toFixed(1)} km
          </p>
        )}
      </div>
      <div className="mt-auto">
        <Link href={`/restaurants/${restaurant.id}`} className="block">
          <CustomButton
            className="w-full text-black button-primary-50 rounded-xl text-sm py-2"
            onClick={() => console.log("Je commande !")}
          >
            Je commande !
          </CustomButton>
        </Link>
      </div>
    </div>
  </div>
);

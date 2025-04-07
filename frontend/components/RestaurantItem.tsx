import { Restaurant } from "@/types/Restaurants";
import Image from "next/image";
import { CustomButton } from "./helper-components/CustomButton";
import Link from "next/link";

interface RestaurantItemProps {
  restaurant: Restaurant;
  distance: number | undefined;
}

export const RestaurantItem: React.FC<RestaurantItemProps> = ({
  restaurant,
  distance,
}) => (
  <li className="flex items-start mb-10">
    <div className="w-[120px] h-[120px] relative mr-3.5 rounded-2xl shadow-md">
      <Image
        src={restaurant.imagePath ?? "/burger.png"}
        alt={restaurant.name}
        fill
        className="object-cover rounded-2xl"
      />
    </div>
    <div className="flex flex-col">
      <span className="font-bold text-xl mb-1">{restaurant.name}</span>
      <div className="mb-1.5 flex flex-col">
        <span className="text-gray-600">
          Frais de livraisons : {restaurant.delevryCost}€
        </span>
        {distance !== undefined && distance !== null && (
          <span className="text-gray-600">
            Distance : {distance.toFixed(2)} km
          </span>
        )}
      </div>
      <Link href={`/restaurants/${restaurant.id}`}>
        <CustomButton
          className="w-30 text-black button-primary-50 rounded-xl text-sm"
          onClick={() => console.log("Je commande !")}
        >
          Je commande !
        </CustomButton>
      </Link>
    </div>
  </li>
);

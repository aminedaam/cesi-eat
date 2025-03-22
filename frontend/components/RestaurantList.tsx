import Image from "next/image";
import { CustomButton } from "./helper-components/CustomButton";

export interface Restaurant {
  name: string;
  deliveryCosts: number;
  image: string;
}

interface RestaurantListProps {
  restaurants: Restaurant[];
}

export const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants,
}) => (
  <ul className="list-none p-0">
    {restaurants.map((restaurant, index) => (
      <li key={index} className="flex items-start mb-10">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          width="120"
          height="120"
          className="mr-3.5"
        />
        <div className="flex flex-col">
          <span className="font-bold text-xl mb-1.5">{restaurant.name}</span>
          <span className="text-gray-600 mb-1.5">
            Frais de livraisons : {restaurant.deliveryCosts}€
          </span>
          <CustomButton
            className="w-30 text-black button-primary-50 rounded-xl text-sm"
            onClick={() => console.log("Je commande !")}
          >
            Je commande !
          </CustomButton>
        </div>
      </li>
    ))}
  </ul>
);

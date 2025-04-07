import { Restaurant } from "./Restaurants";
import { TypeProduit } from "./TypeProduits";

export interface Article {
  id: number | undefined; // undefined on creation
  name: string;
  description?: string;
  imagePath?: string;
  restaurant: Restaurant;
  price: number;
  createdAt?: string;
  typeProd: TypeProduit;
  menuId?: number | null;
}

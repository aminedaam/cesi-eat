import { Restaurant } from "./Restaurants";
import { User } from "./User";

export interface Commande {
  id?: number;
  createdAt?: string;
  prixTotal: number;
  status: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "DELIVERED" | "CANCELLED";
  client: User;
  article: CommandeArticle[];
  menu: CommandeMenu[];
  restaurant: Restaurant;
}

export interface CommandeArticle {
  id?: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  restaurantId: string;
  TypeProd: string;
}

export interface CommandeMenu {
  id?: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  restaurantId: string;
}

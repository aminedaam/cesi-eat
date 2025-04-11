import { Restaurant } from "./Restaurants";
import { User } from "./User";

export interface Commande {
  id?: string;
  createdAt?: string;
  prixTotal: number;
  status: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "DELIVERED" | "CANCELLED";
  client: User;
  article: CommandeArticle[];
  menu: CommandeMenu[];
  restaurant: Restaurant;
  deliveryCosts: number;
  servicesFees: number;
  promotion: boolean;
  sousTotal: number;
  livreur?: User;
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

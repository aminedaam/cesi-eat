import { Restaurant } from "./Restaurants";

export interface Menu {
  id?: number;
  name: string;
  restaurant?: Restaurant;
  description?: string;
  priceMenu: number;
}

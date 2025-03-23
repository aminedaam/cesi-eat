import { Restaurant } from "./Restaurants";

export interface Order {
  id: number;
  restaurant: Restaurant;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: string;
  orderDate: Date;
}

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

import RestaurantCategory from "./RestaurantCategory";

export interface Restaurant {
  id: number | null; // null when creating a new restaurant
  name: string;
  categorie: RestaurantCategory;
  address: string;
  postalCode: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  imagePath: string;
  description: string;
  delevryCost: number;
  email: string;
  closingTime: string;
  phoneNumber: string;
  averageRate: number;
  nbRate: number;
  createdAt: Date;
  distanceFromUser?: number; // Optional property to store distance from user
}

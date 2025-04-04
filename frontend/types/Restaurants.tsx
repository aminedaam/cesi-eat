export interface Restaurant {
  id: number;
  name: string;
  categorie: string;
  address: string;
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
  distanceFromUser?: number; // Optional property to store distance from user
}

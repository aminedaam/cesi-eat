export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  password: string;
  role: "CLIENT" | "RESTAURATEUR" | "LIVREUR";
  createdAt: Date;
  updatedAt: Date;
  latitude?: number;
  longitude?: number;
}

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  password: string;
  role: "CLIENT" | "RESTAURATEUR" | "LIVREUR";
  createdAt: Date;
  latitude?: number;
  longitude?: number;
}

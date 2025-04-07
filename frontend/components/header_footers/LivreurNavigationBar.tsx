import Link from "next/link";
import { Home, Truck, MapPin, CircleUser } from "lucide-react";

export const LivreurNavigationBar = () => {
  return (
    <div className="w-full h-16 background-primary-50 items-center justify-around flex fixed bottom-0 z-50 rounded-t-lg">
      <Link href="/home" className="flex flex-col items-center w-1/4">
        <Home />
        <span style={{ fontSize: "14px" }}>Accueil</span>
      </Link>
      <Link href="/deliveries" className="flex flex-col items-center w-1/4">
        <Truck />
        <span style={{ fontSize: "14px" }}>Livraisons</span>
      </Link>
      <Link href="/map" className="flex flex-col items-center w-1/4">
        <MapPin />
        <span style={{ fontSize: "14px" }}>Carte</span>
      </Link>
      <Link href="/account" className="flex flex-col items-center w-1/4">
        <CircleUser />
        <span style={{ fontSize: "14px" }}>Mon compte</span>
      </Link>
    </div>
  );
};

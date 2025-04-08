import Link from "next/link";
import { Home, Truck, MapPin, CircleUser } from "lucide-react";

export const LivreurNavigationBar = ({ selectedPage }: { selectedPage?: string }) => {
  return (
    <div className="w-full h-16 bg-white items-center justify-around flex fixed bottom-0 z-50 border-t-2 border-gray-200">
      <Link href="/home" className="flex flex-col items-center w-1/4">
        <Home className={selectedPage === "home" ? "text-primary-50" : ""} />
        <span className={selectedPage === "home" ? "text-primary-50" : ""} style={{ fontSize: "14px" }}>Accueil</span>
      </Link>
      <Link href="/deliveries" className="flex flex-col items-center w-1/4">
        <Truck className={selectedPage === "deliveries" ? "text-primary-50" : ""} />
          <span className={selectedPage === "deliveries" ? "text-primary-50" : ""} style={{ fontSize: "14px" }}>Livraisons</span>
      </Link>
      <Link href="/map" className="flex flex-col items-center w-1/4">
        <MapPin className={selectedPage === "map" ? "text-primary-50" : ""} />
        <span className={selectedPage === "map" ? "text-primary-50" : ""} style={{ fontSize: "14px" }}>Carte</span>
      </Link>
      <Link href="/account" className="flex flex-col items-center w-1/4">
        <CircleUser className={selectedPage === "account" ? "text-primary-50" : ""} />
        <span className={selectedPage === "account" ? "text-primary-50" : ""} style={{ fontSize: "14px" }}>Mon compte</span>
      </Link>
    </div>
  );
};

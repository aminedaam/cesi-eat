import Link from "next/link";
import { Home, ShoppingBag, CircleUser } from "lucide-react";

export const ServiceCommercialNavigationBar = ({ selectedPage }: { selectedPage?: string }) => {
  return (
    <div className="w-full h-16 bg-white items-center justify-around flex fixed bottom-0 z-50 border-t-2 border-gray-200">
      <Link
        href="/home"
        className="flex flex-col items-center w-1/3 text-center"
      >
        <Home className={selectedPage === "home" ? "text-primary-50" : ""} />
        <span className={selectedPage === "home" ? "text-primary-50" : ""} style={{ fontSize: "14px" }}>Accueil</span>
      </Link>
      <Link
        href="/commandes"
        className="flex flex-col items-center w-1/3 text-center"
      >
        <ShoppingBag className={selectedPage === "commandes" ? "text-primary-50" : ""} />
        <span className={selectedPage === "commandes" ? "text-primary-50" : ""} style={{ fontSize: "14px" }}>Commandes</span>
      </Link>
      <Link
        href="/account"
        className="flex flex-col items-center w-1/3 text-center"
      >
        <CircleUser className={selectedPage === "account" ? "text-primary-50" : ""} />
        <span className={selectedPage === "account" ? "text-primary-50" : ""} style={{ fontSize: "14px" }}>Mon compte</span>
      </Link>
    </div>
  );
}; 
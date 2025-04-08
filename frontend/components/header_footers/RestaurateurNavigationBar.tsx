import Link from "next/link";
import { Home, CircleUser, Store, ChartNoAxesCombined } from "lucide-react";

export const RestaurateurNavigationBar = ({ selectedPage }: { selectedPage?: string }) => {
  return (
    <div className="w-full h-16 bg-white items-center justify-around flex fixed bottom-0 z-50 border-t-2 border-gray-200">
      <Link
        href="/home"
        className="flex flex-col items-center w-1/4 text-center"
      >
        <Home className={selectedPage === "home" ? "text-primary-50" : ""} />
        <span className={selectedPage === "home" ? "text-primary-50" : ""} style={{ fontSize: "14px" }}>Accueil</span>
      </Link>
      <Link
        href="/restaurants/my-restaurants/all"
        className="flex flex-col items-center w-1/4 text-center"
      >
        <Store className={selectedPage === "restaurants" ? "text-primary-50" : ""} />
        <span className={selectedPage === "restaurants" ? "text-primary-50" : ""} style={{ fontSize: "14px" }}>Restaurants</span>
      </Link>
      <Link
        href="/statistics"
        className="flex flex-col items-center w-1/4 text-center"
      >
        <ChartNoAxesCombined className={selectedPage === "statistics" ? "text-primary-50" : ""} />
        <span className={selectedPage === "statistics" ? "text-primary-50" : ""} style={{ fontSize: "14px" }}>Statistiques</span>
      </Link>
      <Link
        href="/account"
        className="flex flex-col items-center w-1/4 text-center"
      >
        <CircleUser className={selectedPage === "account" ? "text-primary-50" : ""} />
        <span className={selectedPage === "account" ? "text-primary-50" : ""} style={{ fontSize: "14px" }}>Mon compte</span>
      </Link>
    </div>
  );
};

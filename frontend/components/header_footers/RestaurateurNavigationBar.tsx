import Link from "next/link";
import { Home, CircleUser, Store, ChartNoAxesCombined } from "lucide-react";

export const RestaurateurNavigationBar = () => {
  return (
    <div className="w-full h-16 background-primary-50 items-center justify-around flex fixed bottom-0 z-50 rounded-t-lg">
      <Link
        href="/home"
        className="flex flex-col items-center w-1/4 text-center"
      >
        <Home />
        <span style={{ fontSize: "14px" }}>Accueil</span>
      </Link>
      <Link
        href="/restaurants/my-restaurants/all"
        className="flex flex-col items-center w-1/4 text-center"
      >
        <Store />
        <span style={{ fontSize: "14px" }}>Restaurants</span>
      </Link>
      <Link
        href="/statistics"
        className="flex flex-col items-center w-1/4 text-center"
      >
        <ChartNoAxesCombined />
        <span style={{ fontSize: "14px" }}>Statistiques</span>
      </Link>
      <Link
        href="/account"
        className="flex flex-col items-center w-1/4 text-center"
      >
        <CircleUser />
        <span style={{ fontSize: "14px" }}>Mon compte</span>
      </Link>
    </div>
  );
};

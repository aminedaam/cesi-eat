import Link from "next/link";
import { Home, Search, Bookmark, CircleUser } from "lucide-react";

export const NavigationBar = () => {
  return (
    <div className="w-full h-16 background-primary-50 items-center justify-around flex fixed bottom-0 z-50 rounded-t-xl">
      <Link href="/home" className="flex flex-col items-center w-1/4">
        <Home />
        Accueil
      </Link>
      <Link href="/browse" className="flex flex-col items-center w-1/4">
        <Search />
        Parcourir
      </Link>
      <Link href="/orders" className="flex flex-col items-center w-1/4">
        <Bookmark />
        Commandes
      </Link>
      <Link href="/account" className="flex flex-col items-center w-1/4">
        <CircleUser />
        Mon compte
      </Link>
    </div>
  );
};

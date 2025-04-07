import Link from "next/link";
import { Home, Search, Bookmark, CircleUser } from "lucide-react";

export const ClientNavigationBar = () => {
  return (
    <div className="w-full h-16 background-primary-50 items-center justify-around flex fixed bottom-0 z-50 rounded-t-lg">
      <Link href="/home" className="flex flex-col items-center w-1/4">
        <Home />
        <span style={{ fontSize: "14px" }}>Accueil</span>
      </Link>
      <Link href="/browse" className="flex flex-col items-center w-1/4">
        <Search />
        <span style={{ fontSize: "14px" }}>Parcourir</span>
      </Link>
      <Link href="/orders" className="flex flex-col items-center w-1/4">
        <Bookmark />
        <span style={{ fontSize: "14px" }}>Commandes</span>
      </Link>
      <Link href="/account" className="flex flex-col items-center w-1/4">
        <CircleUser />
        <span style={{ fontSize: "14px" }}>Mon compte</span>
      </Link>
    </div>
  );
};

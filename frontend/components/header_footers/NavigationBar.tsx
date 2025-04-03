"use client";
import Link from "next/link";
import { Bookmark, CircleUser, Home, Search } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export const NavigationBar = () => {
  const { isLoggedIn } = useAuthStore();
  return (
    <>
      {isLoggedIn ? (
        <div className="w-full h-16 background-primary-50 items-center justify-between flex fixed bottom-0 z-50 rounded-t-xl px-4">
          <Link href="/home">
            <div className="flex flex-col items-center w-24">
              <Home />
              Accueil
            </div>
          </Link>
          <Link href="/browse">
            <div className="flex flex-col items-center w-24">
              <Search />
              Parcourir
            </div>
          </Link>
          <Link href="/order">
            <div className="flex flex-col items-center w-24">
              <Bookmark />
              Commandes
            </div>
          </Link>
          <Link href="/account">
            <div className="flex flex-col items-center w-24">
              <CircleUser />
              Mon compte
            </div>
          </Link>
        </div>
      ) : null}
    </>
  );
};

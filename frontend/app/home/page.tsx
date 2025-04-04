"use client";
import BaseHeader from "@/components/header_footers/BaseHeader";
import SearchBar from "@/components/helper-components/SearchBar";
import { RestaurantList } from "@/components/RestaurantList";
import { useAuthStore } from "@/store/authStore";
import { Bell, MapPin, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const HomePage: React.FC = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  return (
    <div>
      <BaseHeader>
        <MapPin />
        <div className="flex-1 mx-4">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            className="text-black placeholder-neutral-800 py-1 pl-3 pr-12 rounded-2xl"
            placeHolder="Rechercher dans CesiEat..."
          />
        </div>
        <div className="flex flex-row space-x-3">
          <Bell />
          <Link href={"/cart"}>
            <ShoppingCart />
          </Link>
        </div>
      </BaseHeader>
      <div className="flex flex-col mx-4  my-16">
        <div className="w-full h-32 flex flex-row items-center justify-between">
          <div>
            <h1 className="font-bold text-xl">Passe ta commande !</h1>
            <h4 className="text-gray-500 text-base">
              À découvrir sur CesiEats
            </h4>
          </div>
          <Image src="/cesi-eat-logo.png" alt="Logo" width={120} height={80} />
        </div>
        <RestaurantList filter={searchTerm} />
      </div>
    </div>
  );
};

export default HomePage;

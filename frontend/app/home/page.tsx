"use client";
import BaseHeader from "@/components/header_footers/BaseHeader";
import SearchBar from "@/components/helper-components/SearchBar";
import { RestaurantList } from "@/components/RestaurantList";
import { useAuthStore } from "@/store/authStore";
import { Restaurant } from "@/types/Restaurants";
import { Bell, MapPin, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";


const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "Bagaaaa",
    deliveryCosts: 4.99,
    image: "/burger.png",
    position: {
      latitude: 43.652777998548956,
      longitude: 1.4394687613763628,
    },
  },
  {
    id: 2,
    name: "Valentinoo",
    deliveryCosts: 4.99,
    image: "/burger.png",
    position: {
      latitude: 43.60304364458921,
      longitude: 1.4363026245644699,
    },
  },
  {
    id: 3,
    name: "Tacos",
    deliveryCosts: 4.99,
    image: "/tacos.png",
    position: {
      latitude: 48.8606,
      longitude: 2.3376,
    },
  },
  {
    id: 4,
    name: "Pizza",
    deliveryCosts: 4.99,
    image: "/pizza.png",
    position: {
      latitude: 48.853,
      longitude: 2.3499,
    },
  },
  {
    id: 5,
    name: "Pizza",
    deliveryCosts: 4.99,
    image: "/pizza.png",
    position: {
      latitude: 43.50304364458921,
      longitude: 1.434,
    },
  },
];

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
        <div className="flex flex-row">
          <Bell />
          <ShoppingCart />
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
        <RestaurantList restaurants={restaurants} filter={searchTerm} />
      </div>
    </div>
  );
};

export default HomePage;

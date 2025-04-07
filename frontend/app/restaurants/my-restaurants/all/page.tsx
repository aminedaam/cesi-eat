"use client";
import BaseHeader from "@/components/header_footers/BaseHeader";
import { CustomButton } from "@/components/helper-components/CustomButton";
import SearchBar from "@/components/helper-components/SearchBar";
import { useMe } from "@/hooks/useMe";
import { useAuthStore } from "@/store/authStore";
import { Restaurant } from "@/types/Restaurants";
import { getAllRestaurants } from "@/utils/apiRestaurant";
import { Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const MyRestaurantsPage: React.FC = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { user } = useMe(accessToken ?? "");
  const role = user?.role;
  const [searchTerm, setSearchTerm] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);
  const filteredRestaurants = restaurants?.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const restaurantsList = await getAllRestaurants();
        setRestaurants(restaurantsList);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRestaurants();
  }, []);

  if (role !== "RESTAURATEUR") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-center">
          Vous n&apos;avez pas accès à cette page.
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <BaseHeader>
        <div className="flex-1 mx-4">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            className="text-black placeholder-neutral-800 py-1 pl-3 rounded-xl w-full border border-gray-700"
            placeHolder="Rechercher dans mes restaurants..."
          />
        </div>
        <div className="flex flex-row space-x-3">
          <Bell />
        </div>
      </BaseHeader>
      <div className="flex flex-col mx-4 my-20">
        <div className="flex flex-row justify-between items-center">
          <h1 className="font-bold text-2xl">Mes Restaurants</h1>
          <Link href="/restaurants/create">
            <CustomButton className="rounded-2xl bg-gray-50 py-1.5 px-3 text-sm shadow-sm border border-gray-600">
              Ajouter un restaurant
            </CustomButton>
          </Link>
        </div>
        <ul className="mt-4 space-y-4">
          {filteredRestaurants?.map((restaurant) => (
            <Link
              href={`/restaurants/my-restaurants/${restaurant.id}`}
              key={restaurant.id}
            >
              <li className="p-4 rounded-xl shadow-md bg-white border border-gray-400 mb-4 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center">
                  <Image
                  src={restaurant.imagePath ?? "/burger.png"}
                  alt={restaurant.name}
                  width={100}
                  height={100}
                  className="w-16 h-16 rounded-lg mr-4 object-cover"
                  />
                  <div>
                  <h2 className="text-xl font-semibold">{restaurant.name}</h2>
                  <p className="text-gray-600 line-clamp-1">
                    {restaurant.description}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Adresse: {restaurant.address}
                  </p>
                  </div>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyRestaurantsPage;

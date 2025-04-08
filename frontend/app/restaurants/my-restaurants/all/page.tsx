"use client";
import BaseHeader from "@/components/header_footers/BaseHeader";
import { CustomButton } from "@/components/helper-components/CustomButton";
import SearchBar from "@/components/helper-components/SearchBar";
import { useMe } from "@/hooks/useMe";
import { useAuthStore } from "@/store/authStore";
import { Restaurant } from "@/types/Restaurants";
import { getAllRestaurants } from "@/utils/apiRestaurant";
import { Bell, Plus, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const MyRestaurantsPage: React.FC = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { user } = useMe(accessToken ?? "");
  const role = user?.role;
  const [searchTerm, setSearchTerm] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const filteredRestaurants = restaurants?.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true);
        const restaurantsList = await getAllRestaurants();
        setRestaurants(restaurantsList);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  if (role !== "RESTAURATEUR") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Accès non autorisé
          </h1>
          <p className="text-gray-600">
            Vous n&apos;avez pas les permissions nécessaires pour accéder à cette page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BaseHeader>
        <div className="flex-1 mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              className="text-black placeholder-gray-500 py-2 pl-10 pr-4 rounded-xl w-full border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
              placeHolder="Rechercher dans mes restaurants..."
            />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Bell className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </BaseHeader>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mes Restaurants</h1>
            <p className="text-gray-600 mt-1">
              Gérez vos restaurants et leurs menus
            </p>
          </div>
          <Link href="/restaurants/create" className="mt-4 md:mt-0">
            <CustomButton className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus className="h-5 w-5" />
              <span>Ajouter un restaurant</span>
            </CustomButton>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredRestaurants && filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <Link
                href={`/restaurants/my-restaurants/${restaurant.id}`}
                key={restaurant.id}
                className="block"
              >
                <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 h-full">
                  <div className="relative h-48">
                    <Image
                      src={restaurant.imagePath ?? "/burger.png"}
                      alt={restaurant.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-200 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {restaurant.name}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {restaurant.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="line-clamp-1">{restaurant.address}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                Aucun restaurant trouvé
              </h3>
              <p className="mt-1 text-gray-500">
                {searchTerm
                  ? "Aucun restaurant ne correspond à votre recherche."
                  : "Vous n'avez pas encore créé de restaurant."}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Link href="/restaurants/create">
                    <CustomButton className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2">
                      <Plus className="h-5 w-5" />
                      <span>Créer votre premier restaurant</span>
                    </CustomButton>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyRestaurantsPage;

"use client";
import BaseHeader from "@/components/header_footers/BaseHeader";
import { CustomButton } from "@/components/helper-components/CustomButton";
import SearchBar from "@/components/helper-components/SearchBar";
import { useMe } from "@/hooks/useMe";
import { useAuthStore } from "@/store/authStore";
import { Restaurant } from "@/types/Restaurants";
import { getMyRestaurants } from "@/utils/apiRestaurant";
import { Bell, Plus, MapPin, Utensils } from "lucide-react";
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
        const restaurantsList = await getMyRestaurants(accessToken ?? "");
        setRestaurants(restaurantsList);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurants();
  }, [accessToken]);

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
    <div className="min-h-screen bg-gray-50 mt-16">
      <BaseHeader>
        <div className="flex-1 mx-4">
          <div className="relative">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              className="text-black placeholder-gray-500 py-2 rounded-xl w-full focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
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
            <CustomButton className="bg-primary-500 hover:bg-primary-600 text-black px-5 py-2.5 border border-gray-200 rounded-lg flex items-center space-x-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
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
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="line-clamp-1">{restaurant.address}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="max-w-md mx-auto px-4">
              <div className="bg-primary-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Utensils className="h-10 w-10 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {searchTerm ? "Aucun restaurant trouvé" : "Aucun restaurant"}
              </h3>
              <p className="text-gray-600 mb-8">
                {searchTerm
                  ? "Aucun restaurant ne correspond à votre recherche."
                  : "Vous n'avez pas encore créé de restaurant. Commencez par en ajouter un !"}
              </p>
              {!searchTerm && (
                <Link href="/restaurants/create">
                  <CustomButton className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    <Plus className="h-5 w-5" />
                    <span>Créer votre premier restaurant</span>
                  </CustomButton>
                </Link>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyRestaurantsPage;

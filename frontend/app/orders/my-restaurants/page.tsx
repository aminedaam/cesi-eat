"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useMe } from "@/hooks/useMe";
import { getMyRestaurants } from "@/utils/apiRestaurant";
import { Restaurant } from "@/types/Restaurants";
import BaseHeader from "@/components/header_footers/BaseHeader";
import { Bell, ShoppingCart, MapPin, History, Utensils } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CustomButton } from "@/components/helper-components/CustomButton";
import LoadingSpinner from "@/components/helper-components/LoadingSpinner";

const RestaurantOrdersPage: React.FC = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { user, loading: userLoading, error: userError } = useMe(accessToken ?? "");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [errorRestaurants, setErrorRestaurants] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!accessToken || !user || user.role !== "RESTAURATEUR") {
        setLoadingRestaurants(false);
        return;
      }

      try {
        setLoadingRestaurants(true);
        setErrorRestaurants(null);
        const fetchedRestaurants = await getMyRestaurants(accessToken);
        setRestaurants(fetchedRestaurants);
      } catch (err) {
        console.error("Erreur lors de la récupération des restaurants:", err);
        setErrorRestaurants("Impossible de charger vos restaurants.");
      } finally {
        setLoadingRestaurants(false);
      }
    };

    if (!userLoading && user) {
      fetchRestaurants();
    } else if (!userLoading && !user) {
      setLoadingRestaurants(false); // User not loaded or doesn't exist
    }
  }, [accessToken, user, userLoading]);

  if (userLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (userError || (!user && !userLoading)) {
     return (
       <div className="min-h-screen flex flex-col items-center justify-center p-4">
         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md text-center">
           <strong className="font-bold">Erreur!</strong>
           <span className="block sm:inline"> Impossible de charger les informations utilisateur ou vous n'êtes pas connecté.</span>
         </div>
       </div>
     );
  }


  if (user?.role !== "RESTAURATEUR") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Accès non autorisé
          </h1>
          <p className="text-gray-600">
            Vous devez être restaurateur pour accéder à cette page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      <BaseHeader>
        {/* Placeholder for potential search or actions */}
        <div className="flex-1"></div> 
        <div className="flex flex-row space-x-3">
          <Bell />
          <Link href={"/cart"}>
            <ShoppingCart />
          </Link>
        </div>
      </BaseHeader>

      <main className="flex flex-col mt-16 max-w-7xl mx-auto px-4 py-8">
        <div className="w-full flex flex-row items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Commandes par Restaurant
            </h1>
            <h4 className="text-gray-500 text-base">
              Consultez l'historique des commandes pour chacun de vos restaurants
            </h4>
          </div>
        </div>

        {loadingRestaurants ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : errorRestaurants ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
             <p className="text-red-600">{errorRestaurants}</p>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
             <div className="max-w-md mx-auto px-4">
              <div className="bg-primary-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Utensils className="h-10 w-10 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Aucun restaurant trouvé
              </h3>
              <p className="text-gray-600 mb-8">
                 Vous n'avez pas encore créé de restaurant. 
                 <Link href="/restaurants/create" className="text-primary-600 hover:underline ml-1">Créez-en un!</Link>
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full border border-gray-100"
              >
                <div className="relative h-40">
                  <Image
                    src={restaurant.imagePath ?? "/placeholder-image.png"} // Use a placeholder if no image
                    alt={restaurant.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                    {restaurant.name}
                  </h2>
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{restaurant.address}</span>
                  </div>
                  <div className="mt-auto pt-3 border-t border-gray-100">
                     <Link href={`/orders/my-restaurants/${restaurant.id}`} className="block w-full">
                        <CustomButton 
                          variant="outline" 
                          className="w-full text-sm py-2 px-3"
                        >
                          <History className="h-4 w-4 mr-2" />
                          Voir l'historique des commandes
                        </CustomButton>
                     </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RestaurantOrdersPage; 
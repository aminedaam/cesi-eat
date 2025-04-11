"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTotalCommandes, getRecette } from "@/utils/apiStatistics";
import { getAllRestaurants, getMyRestaurants } from "@/utils/apiRestaurant";
import { Store } from "lucide-react";
import { useMe } from "@/hooks/useMe";
import { useAuthStore } from "@/store/authStore";
import { Restaurant } from "@/types/Restaurants";
import BaseHeader from "@/components/header_footers/BaseHeader";
import { RestaurateurNavigationBar } from "@/components/header_footers/RestaurateurNavigationBar";
import Link from "next/link";

interface RestaurantStats {
  id: number;
  name: string;
  totalCommandes: number;
  recette: number;
}

export default function StatisticsPage() {
  const [restaurants, setRestaurants] = useState<RestaurantStats[]>([]);
  const accessToken = useAuthStore((state) => state.accessToken);
  const { user } = useMe(accessToken ?? "");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken || user?.role !== "RESTAURATEUR") {
        router.push("/login");
        return;
      }

      try {
        const restaurantsData = await getMyRestaurants(accessToken);
        console.log("restaurantsData", restaurantsData);
        const statsPromises = restaurantsData.map(
          async (restaurant: Restaurant) => {
            const [totalCommandes, recette] = await Promise.all([
              getTotalCommandes(restaurant.id!, accessToken),
              getRecette(restaurant.id!, accessToken),
            ]);

            return {
              id: restaurant.id,
              name: restaurant.name,
              totalCommandes,
              recette,
            };
          }
        );

        const stats = await Promise.all(statsPromises);
        setRestaurants(stats as RestaurantStats[]);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des statistiques:",
          error
        );
      }
    };

    fetchData();
  }, [accessToken, user, router]);

  return (
    <>
      <BaseHeader />
      <div className="container mx-auto py-8 px-4 mt-16 mb-20">
        <h1 className="text-3xl font-bold mb-8">
          Statistiques des Restaurants
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Link
              href={`/statistics/${restaurant.id}`}
              key={restaurant.id}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-transform hover:scale-105"
            >
              <div className="flex items-center mb-4">
                <Store className="w-6 h-6 mr-2 text-blue-600" />
                <h2 className="text-xl font-semibold">{restaurant.name}</h2>
              </div>
              <div className="space-y-4 mt-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500 mb-1">
                    Nombre total de commandes
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {restaurant.totalCommandes}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500 mb-1">Recette totale</p>
                  <p className="text-2xl font-bold text-green-600">
                    {restaurant.recette.toFixed(2)} €
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <RestaurateurNavigationBar selectedPage="statistics" />
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { getBestArticle, getBestMenu, ArticleStatistics, MenuStatistics } from "@/utils/apiStatistics";
import { getRestaurantById } from "@/utils/apiRestaurant";
import { getArticlesByMenuId } from "@/utils/apiArticles";
import { Restaurant } from "@/types/Restaurants";
import { Article } from "@/types/Articles";
import { Menu } from "@/types/Menu";
import { Store, Utensils, Pizza } from "lucide-react";
import { useMe } from "@/hooks/useMe";
import { useAuthStore } from "@/store/authStore";
import BaseHeader from "@/components/header_footers/BaseHeader";
import { RestaurateurNavigationBar } from "@/components/header_footers/RestaurateurNavigationBar";

interface RestaurantStats {
  restaurant: Restaurant;
  bestArticle: ArticleStatistics;
  bestMenu: MenuStatistics;
  menuArticles: Article[];
}

export default function RestaurantStatisticsPage() {
  const [stats, setStats] = useState<RestaurantStats | null>(null);
  const router = useRouter();
  const { id } = useParams();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { user } = useMe(accessToken ?? "");

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken || user?.role !== "RESTAURATEUR") {
        router.push("/login");
        return;
      }

      try {
        const restaurantId = Number(id);
        const [restaurant, bestArticle, bestMenu] = await Promise.all([
          getRestaurantById(restaurantId, accessToken),
          getBestArticle(restaurantId, accessToken),
          getBestMenu(restaurantId, accessToken),
        ]);

        const menuArticles = await getArticlesByMenuId(
          bestMenu.menu.id!,
          accessToken
        );

        setStats({
          restaurant,
          bestArticle,
          bestMenu,
          menuArticles,
        });
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des statistiques:",
          error
        );
      }
    };

    fetchData();
  }, [accessToken, user, router, id]);

  if (!stats) {
    return (
      <>
        <BaseHeader />
        <div className="container mx-auto py-8 px-4 mt-16 mb-20">
          <p>Chargement...</p>
        </div>
        <RestaurateurNavigationBar selectedPage="statistics" />
      </>
    );
  }

  return (
    <>
      <BaseHeader />
      <div className="container mx-auto py-8 px-4 mt-16 mb-20">
        <div className="flex items-center mb-8">
          <Store className="w-10 h-10 mr-4 text-blue-600" />
          <h1 className="text-3xl font-bold">
            Statistiques de {stats.restaurant.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Utensils className="w-6 h-6 mr-2 text-blue-600" />
              <h2 className="text-xl font-semibold">Meilleur Article</h2>
            </div>
            <div className="border-t border-gray-200 my-4"></div>
            <div className="flex items-start">
              {stats.bestArticle.article.imagePath && (
                <img
                  src={stats.bestArticle.article.imagePath}
                  alt={stats.bestArticle.article.name}
                  className="w-24 h-24 object-cover rounded-lg mr-4"
                />
              )}
              <div>
                <h3 className="text-lg font-medium">
                  {stats.bestArticle.article.name}
                </h3>
                <p className="text-gray-600 mt-1">
                  {stats.bestArticle.article.description}
                </p>
                <p className="text-blue-600 font-semibold mt-2">
                  {stats.bestArticle.article.price.toFixed(2)} €
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Pizza className="w-6 h-6 mr-2 text-blue-600" />
              <h2 className="text-xl font-semibold">Meilleur Menu</h2>
            </div>
            <div className="border-t border-gray-200 my-4"></div>
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-medium">{stats.bestMenu.menu.name}</h3>
                <p className="text-gray-600 mt-1">
                  {stats.bestMenu.menu.description}
                </p>
                <p className="text-blue-600 font-semibold mt-2">
                  {stats.bestMenu.menu.priceMenu.toFixed(2)} €
                </p>
              </div>

              <div className="mt-6">
                <h4 className="text-md font-medium mb-3">Articles du menu :</h4>
                <div className="space-y-4">
                  {stats.menuArticles.map((article) => (
                    <div key={article.id} className="flex items-start">
                      {article.imagePath && (
                        <img
                          src={article.imagePath}
                          alt={article.name}
                          className="w-16 h-16 object-cover rounded-lg mr-3"
                        />
                      )}
                      <div>
                        <h5 className="font-medium">{article.name}</h5>
                        <p className="text-sm text-gray-600">
                          {article.description}
                        </p>
                        <p className="text-sm text-blue-600 mt-1">
                          {article.price.toFixed(2)} €
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RestaurateurNavigationBar selectedPage="statistics" />
    </>
  );
}

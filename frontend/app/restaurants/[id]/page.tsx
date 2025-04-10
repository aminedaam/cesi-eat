"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { CustomButton } from "@/components/helper-components/CustomButton";
import { useParams } from "next/navigation";
import { getRestaurantById } from "@/utils/apiRestaurant";
import { Restaurant } from "@/types/Restaurants";
import { useAuthStore } from "@/store/authStore";
import { Article } from "@/types/Articles";
import {
  getArticlesByRestaurantId,
  getArticlesByMenuId,
} from "@/utils/apiArticles";
import { Star, ShoppingCart, ChevronDown, Plus } from "lucide-react"; // Assuming ArrowLeft is used elsewhere or can be removed
import LoadingSpinner from "@/components/helper-components/LoadingSpinner";
import { Menu } from "@/types/Menu";
import { getMenusByRestaurantId } from "@/utils/apiMenu";
// import { RestaurantCategory } from "@/types/RestaurantCategory"; // Keep if needed, wasn't used in snippet

function RestaurantPage() {
  const { id } = useParams();
  const params = useParams();
  console.log(params);
  const restaurantId = Number(id);

  // --- Cart Store Interactions ---
  // These function calls remain the same as their signatures haven't changed
  const addArticle = useCartStore((state) => state.addArticle);
  const addMenu = useCartStore((state) => state.addMenu);
  // This function now correctly sums from both articles and menus arrays in the store
  const totalItemsFromCurrentRestaurant = useCartStore((state) =>
    state.getTotalItemsByRestaurantId(restaurantId)
  );
  // ----------------------------

  const token = useAuthStore((state) => state.accessToken);
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [menus, setMenus] = useState<Menu[] | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedMenuId, setExpandedMenuId] = useState<number | null>(null);
  const [menuArticlesMap, setMenuArticlesMap] = useState<
    Record<number, Article[]>
  >({});

  // --- Data Fetching useEffects (No changes needed due to store refactor) ---
  useEffect(() => {
    async function fetchRestaurant() {
      console.log(params);
      if (!restaurantId || !token) {
        setError("Informations manquantes pour charger le restaurant.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const fetchedRestaurant = await getRestaurantById(restaurantId, token);
        setRestaurant(fetchedRestaurant);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement du restaurant:", err);
        setError("Impossible de charger les informations du restaurant.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchRestaurant();
  }, [restaurantId, token]);

  useEffect(() => {
    if (!restaurantId || !token) return; // Ensure prerequisites
    async function fetchArticles() {
      try {
        const fetchedArticles = await getArticlesByRestaurantId(
          restaurantId,
          token!
        );
        setArticles(fetchedArticles);
      } catch (err) {
        console.error("Erreur lors du chargement des articles:", err);
        // Optionally set an error state for articles
      }
    }
    fetchArticles();
  }, [restaurantId, token]);

  useEffect(() => {
    if (!restaurantId || !token) return; // Ensure prerequisites
    async function fetchMenus() {
      try {
        const fetchedMenus = await getMenusByRestaurantId(restaurantId, token!);
        setMenus(fetchedMenus);
      } catch (err) {
        console.error("Erreur lors du chargement des menus:", err);
        // Optionally set an error state for menus
      }
    }
    fetchMenus();
  }, [restaurantId, token]);

  useEffect(() => {
    if (!menus || !token) return; // Ensure prerequisites
    async function fetchMenuArticles() {
      const map: Record<number, Article[]> = {};
      // Use Promise.all for potentially faster fetching if API supports concurrent requests
      await Promise.all(
        menus!.map(async (menu) => {
          if (typeof menu.id !== "number") return; // Skip menus without valid ID
          try {
            const articlesForMenu = await getArticlesByMenuId(menu.id, token!);
            map[menu.id] = articlesForMenu;
          } catch (error) {
            console.error(
              `Error fetching articles for menu ID ${menu.id}:`,
              error
            );
            map[menu.id] = []; // Assign empty array on error? Or handle differently?
          }
        })
      );
      setMenuArticlesMap(map);
    }
    fetchMenuArticles();
  }, [menus, token]);
  // -----------------------------------------------------------------------

  const toggleMenuExpansion = (menuId: number) => {
    setExpandedMenuId(expandedMenuId === menuId ? null : menuId);
  };

  // --- Loading and Error States (No changes needed) ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Chargement du restaurant...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/">
            <CustomButton className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg">
              Retour à l&apos;accueil
            </CustomButton>
          </Link>
        </div>
      </div>
    );
  }
  // -----------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {" "}
      {/* Added padding-bottom */}
      {/* En-tête du restaurant (No changes needed) */}
      <div className="relative w-full h-64 md:h-80">
        {/* ... Image and Gradient ... */}
        <Image
          src={restaurant?.imagePath ?? "/burger.png"}
          alt="Restaurant Banner"
          layout="fill"
          objectFit="cover"
          className="brightness-75"
          priority // Add priority for LCP element
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {restaurant?.name}
            </h1>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="ml-1 font-semibold">
                  {restaurant?.averageRate?.toFixed(1) ?? "N/A"}{" "}
                  {/* Format rate */}
                </span>
              </div>
              <span className="text-white/80">
                ({restaurant?.nbRate ?? 0} avis)
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Description du restaurant (No changes needed) */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          {/* ... Description and Address ... */}
          <p className="text-gray-600">{restaurant?.description}</p>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <svg
              className="h-4 w-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />{" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />{" "}
            </svg>
            <span>{restaurant?.address}</span>
          </div>
        </div>

        {/* Section des Menus */}
        {/* --- Add Menu Button Modification --- */}
        {menus && menus.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Menus</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menus.map((menu) => (
                <div
                  key={menu.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col" // Added flex flex-col
                >
                  <div className="p-6 flex-grow">
                    {" "}
                    {/* Added flex-grow */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">
                          {menu.name}
                        </h3>
                        <p className="text-primary-600 font-medium">
                          {menu.priceMenu.toFixed(2)}€ {/* Format price */}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {" "}
                        {/* Added flex-shrink-0 */}
                        {/* --- Implement onClick for Add Menu --- */}
                        <CustomButton
                          aria-label={`Ajouter le menu ${menu.name} au panier`}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          onClick={() => {
                            console.log("Adding menu:", menu);
                            // Ensure menu object has needed fields if store requires more than id/price
                            // Assuming menu object from API is sufficient here
                            addMenu(menu);
                          }}
                        >
                          <Plus className="h-5 w-5" />{" "}
                          {/* Slightly larger icon */}
                        </CustomButton>
                        {/* -------------------------------------- */}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {menu.description}
                    </p>
                    {menu.id &&
                      menuArticlesMap[menu.id] &&
                      menuArticlesMap[menu.id].length > 0 && (
                        <button
                          onClick={() => toggleMenuExpansion(menu.id!)}
                          className="w-full flex items-center cursor-pointer justify-between text-sm text-gray-500 hover:text-gray-700 mt-auto pt-4 border-t border-gray-100" // Style adjustments
                        >
                          <span>
                            Voir les articles ({menuArticlesMap[menu.id].length}
                            )
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              expandedMenuId === menu.id ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      )}
                  </div>
                  {/* Menu Articles Expansion (No changes needed) */}
                  {expandedMenuId === menu.id && menuArticlesMap[menu.id] && (
                    <div className="border-t bg-gray-50">
                      {" "}
                      {/* Added bg color */}
                      <div className="p-4 space-y-3">
                        {menuArticlesMap[menu.id].map((article) => (
                          <div
                            key={article.id}
                            className="flex items-center justify-between"
                          >
                            {/* ... article details ... */}
                            <div className="flex items-center space-x-3">
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={article.imagePath ?? "/burger.png"}
                                  alt={article.name}
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {article.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {article.price.toFixed(2)}€
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* ---------------------------------- */}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* ----------------------------------- */}

        {/* Section des articles */}
        {/* --- Add Article Button Modification --- */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Articles à la carte</h2>
          {articles &&
          articles.filter((article) => !article.menuId).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles
                .filter((article) => !article.menuId) // Show only articles not part of a menu
                .map((article) => (
                  <div
                    key={article.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col" // Added flex
                  >
                    <div className="relative h-48">
                      <Image
                        src={article.imagePath ?? "/burger.png"}
                        alt={article.name}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-200 hover:scale-105"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      {" "}
                      {/* Added flex grow */}
                      <div className="flex justify-between items-start mb-2 flex-grow">
                        {/* Changed structure slightly for better layout */}
                        <div className="flex-grow mr-2">
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {article.name}
                          </h3>
                          <p className="text-primary-600 font-medium mb-2">
                            {article.price.toFixed(2)}€ {/* Format price */}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {article.description}
                          </p>
                        </div>
                        {/* --- Clean up onClick for Add Article --- */}
                        <CustomButton
                          aria-label={`Ajouter ${article.name} au panier`}
                          className="bg-primary-500 text-black hover:bg-primary-600 p-2 rounded-lg transition-colors flex-shrink-0"
                          onClick={() => {
                            // Check if article has restaurant data (should come from API)
                            if (!article.restaurant) {
                              console.warn(
                                "Tentative d'ajout d'un article sans information de restaurant:",
                                article
                              );
                              // Optionally, show an error toast to the user
                              // toast.error("Impossible d'ajouter cet article (données manquantes).");
                              return; // Prevent adding if data is missing
                            }
                            addArticle(article);
                          }}
                        >
                          <Plus className="h-5 w-5" />
                        </CustomButton>
                        {/* -------------------------------------- */}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            // No articles message (No changes needed)
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              {/* ... No articles SVG and text ... */}
              <div className="max-w-md mx-auto">
                {" "}
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />{" "}
                </svg>{" "}
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  {" "}
                  Aucun article disponible{" "}
                </h3>{" "}
                <p className="mt-1 text-gray-500">
                  {" "}
                  Ce restaurant n&apos;a pas encore ajouté d&apos;articles à son menu.{" "}
                </p>{" "}
              </div>
            </div>
          )}
        </div>
        {/* ----------------------------------- */}
      </div>
      {/* Bouton du panier flotant (No changes needed, uses getTotalItemsByRestaurantId) */}
      {/* Only show cart button if there are items for this restaurant */}
      {totalItemsFromCurrentRestaurant > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 shadow-lg z-50">
          <div className="max-w-7xl mx-auto">
            <Link href={`/cart/${restaurantId}`} className="block">
              <CustomButton className="w-full bg-primary-500 hover:bg-primary-600 bg-black text-white py-3 rounded-lg flex items-center justify-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Voir mon panier ({totalItemsFromCurrentRestaurant})</span>
              </CustomButton>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantPage;
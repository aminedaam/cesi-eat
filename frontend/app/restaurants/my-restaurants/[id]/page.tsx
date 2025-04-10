"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
// import { RestaurantArticle } from "@/types/RestaurantArticle";
import { useParams, useRouter } from "next/navigation";
import { deleteRestaurant, getRestaurantById } from "@/utils/apiRestaurant";
import { Restaurant } from "@/types/Restaurants";
import Link from "next/link";
import { ChevronDown, Edit, Star, Trash, PlusCircle, Utensils } from "lucide-react";
import LoadingSpinner from "@/components/helper-components/LoadingSpinner";
import { useAuthStore } from "@/store/authStore";
import { CustomButton } from "@/components/helper-components/CustomButton";
import { customModalStyles } from "@/components/CustomModalStyles";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { Article } from "@/types/Articles";
import { Menu } from "@/types/Menu";
import {
  getArticlesByRestaurantId,
  getArticlesByMenuId,
  deleteArticle,
} from "@/utils/apiArticles";
import { getMenusByRestaurantId, deleteMenu } from "@/utils/apiMenu";

function RestaurantPage() {
  const { id } = useParams();
  const restaurantId = Number(id);

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore((state) => state.accessToken);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();
  const [articles, setArticles] = useState<Article[] | null>([]);
  const [menus, setMenus] = useState<Menu[] | null>([]);
  const [expandedMenuId, setExpandedMenuId] = useState<number | null>(null);
  const [menuArticlesMap, setMenuArticlesMap] = useState<
    Record<number, Article[]>
  >({});
  const [deleteType, setDeleteType] = useState<
    "Restaurant" | "Menu" | "Article" | null
  >(null);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const toggleMenuExpansion = (menuId: number) => {
    setExpandedMenuId((prevId) => (prevId === menuId ? null : menuId));
  };

  const articlesWithoutMenus = articles?.filter(
    (article) => article.menuId === null
  );
  useEffect(() => {
    async function fetchRestaurant() {
      setLoading(true);
      try {
        const fetchedRestaurant = await getRestaurantById(restaurantId, token!);
        setRestaurant(fetchedRestaurant);
        setError(null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurant:", error);
        setError("Failed to fetch restaurant data.");
        setLoading(false);
      }
    }
    fetchRestaurant();
  }, [restaurantId, token]);

  useEffect(() => {
    async function fetchArticles() {
      if (!restaurantId) return;
      setLoading(true);
      try {
        const fetchedArticles = await getArticlesByRestaurantId(
          restaurantId,
          token!
        );
        setArticles(fetchedArticles);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error("Error fetching articles:", error);
        if (error && typeof error === 'object' && 'response' in error && 
            error.response && typeof error.response === 'object' && 
            'status' in error.response && error.response.status === 404) {
          setArticles([]);
          setLoading(false);
          setError(null);
        } else {
          setError("Failed to fetch articles data.");
          setLoading(false);
        }
      }
    }
    fetchArticles();
  }, [restaurantId, token]);

  useEffect(() => {
    async function fetchMenus() {
      if (!restaurantId) return;
      setLoading(true);
      try {
        const fetchedMenus = await getMenusByRestaurantId(restaurantId, token!);
        setMenus(fetchedMenus);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching menus:", error);
        if (error && typeof error === 'object' && 'response' in error && 
            error.response && typeof error.response === 'object' && 
            'status' in error.response && error.response.status === 404) {
          setMenus([]);
          setLoading(false);
        } else {
          setError("Failed to fetch menus data.");
          setLoading(false);
        }
      }
    }
    fetchMenus();
  }, [restaurantId, token]);

  useEffect(() => {
    async function fetchMenuArticles() {
      if (!menus) return;
      const map: Record<number, Article[]> = {};
      for (const menu of menus) {
        try {
          const articlesForMenu = await getArticlesByMenuId(menu.id!, token!);
          map[menu.id!] = articlesForMenu;
        } catch (error) {
          console.error(
            `Error fetching articles for menu ID ${menu.id}:`,
            error
          );
          if (error && typeof error === 'object' && 'response' in error && 
              error.response && typeof error.response === 'object' && 
              'status' in error.response && error.response.status === 404) {
            map[menu.id!] = [];
          } else {
            map[menu.id!] = [];
          }
        }
      }
      setMenuArticlesMap(map);
    }
    fetchMenuArticles();
  }, [menus, token]);

  const openDeleteModal = (
    type: "Restaurant" | "Menu" | "Article",
    id: number
  ) => {
    setDeleteType(type);
    setDeleteItemId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteType(null);
    setDeleteItemId(null);
  };

  const confirmDelete = async () => {
    if (!token || !deleteType || deleteItemId === null) return;

    closeDeleteModal();

    try {
      if (deleteType === "Restaurant") {
        await deleteRestaurant(restaurantId, token);
        toast.success("Restaurant deleted successfully.");
        router.replace("/restaurants/my-restaurants/all");
      } else if (deleteType === "Menu") {
        // Call deleteMenu API (assume it exists)
        await deleteMenu(deleteItemId, token);
        toast.success("Menu deleted successfully.");
        setMenus(
          (prev) => prev?.filter((menu) => menu.id !== deleteItemId) || []
        );
      } else if (deleteType === "Article") {
        // Call deleteArticle API
        await deleteArticle(deleteItemId, token);
        toast.success("Article deleted successfully.");
        setArticles(
          (prev) => prev?.filter((article) => article.id !== deleteItemId) || []
        );

        setMenuArticlesMap((prevMap) => {
          const updatedMap = { ...prevMap };
          for (const menuId in updatedMap) {
            updatedMap[menuId] = updatedMap[menuId].filter(
              (article) => article.id !== deleteItemId
            );
          }
          return updatedMap;
        });
      }
    } catch (err) {
      console.error(`Error deleting ${deleteType.toLowerCase()}:`, err);
      toast.error(`Failed to delete ${deleteType.toLowerCase()}.`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center flex-col items-center min-h-screen">
        <LoadingSpinner />
        <p className="text-center">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center flex-col items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête du restaurant */}
      <div className="relative w-full h-64 md:h-80">
        <Image
          src={restaurant?.imagePath ?? "/burger.png"}
          alt="Restaurant Banner"
          layout="fill"
          objectFit="cover"
          className="brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl md:text-4xl font-bold">
                {restaurant?.name}
              </h1>
              <div className="flex items-center space-x-3">
                <Link href={`/restaurants/edit/${restaurantId}`}>
                  <CustomButton className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full">
                    <Edit className="h-5 w-5" />
                  </CustomButton>
                </Link>
                <CustomButton
                  className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full"
                  onClick={() => openDeleteModal("Restaurant", restaurantId)}
                >
                  <Trash className="h-5 w-5" />
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Informations du restaurant */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <p className="text-gray-600">{restaurant?.description}</p>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-semibold">
                    {restaurant?.averageRate}
                  </span>
                </div>
                <span className="text-gray-500">
                  ({restaurant?.nbRate} avis)
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`/restaurants/${restaurantId}/menus/create`}>
                <CustomButton className="bg-primary-50 hover:bg-primary-100 text-primary-900 px-4 py-2 rounded-lg flex items-center space-x-2">
                  <span>Ajouter un menu</span>
                </CustomButton>
              </Link>
              <Link href={`/restaurants/${restaurantId}/articles/create`}>
                <CustomButton className="bg-primary-50 hover:bg-primary-100 text-primary-900 px-4 py-2 rounded-lg flex items-center space-x-2">
                  <span>Ajouter un article</span>
                </CustomButton>
              </Link>
            </div>
          </div>
        </div>

        {/* Section des menus */}
        {menus && menus.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Menus</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menus.map((menu) => (
                <div
                  key={menu.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">
                          {menu.name}
                        </h3>
                        <p className="text-primary-600 font-medium">
                          {menu.priceMenu}€
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/restaurants/${restaurantId}/menus/edit/${menu.id}`}
                        >
                          <CustomButton className="p-2 hover:bg-gray-100 rounded-lg">
                            <Edit className="h-4 w-4" />
                          </CustomButton>
                        </Link>
                        <CustomButton
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          onClick={() => openDeleteModal("Menu", menu.id!)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </CustomButton>
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
                          className="w-full flex cursor-pointer items-center justify-between text-sm text-gray-500 hover:text-gray-700"
                        >
                          <span>Voir les articles</span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              expandedMenuId === menu.id ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      )}
                  </div>
                  {expandedMenuId === menu.id && menuArticlesMap[menu.id] && (
                    <div className="border-t">
                      <div className="p-4 space-y-3">
                        {menuArticlesMap[menu.id].map((article) => (
                          <div
                            key={article.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                                <Image
                                  src={article.imagePath ?? "/burger.png"}
                                  alt={article.name}
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">{article.name}</p>
                                <p className="text-sm text-gray-500">
                                  {article.price}€
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Link
                                href={`/restaurants/${restaurantId}/articles/edit/${article.id}`}
                              >
                                <CustomButton className="p-1.5 hover:bg-gray-100 rounded-lg">
                                  <Edit className="h-3.5 w-3.5" />
                                </CustomButton>
                              </Link>
                              <CustomButton
                                className="p-1.5 hover:bg-gray-100 rounded-lg"
                                onClick={() =>
                                  openDeleteModal("Article", article.id!)
                                }
                              >
                                <Trash className="h-3.5 w-3.5 text-red-500" />
                              </CustomButton>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section des articles */}
        {articlesWithoutMenus && articlesWithoutMenus.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articlesWithoutMenus.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={article.imagePath ?? "/burger.png"}
                      alt={article.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {article.name}
                        </h3>
                        <p className="text-primary-600 font-medium">
                          {article.price}€
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/restaurants/${restaurantId}/articles/edit/${article.id}`}
                        >
                          <CustomButton className="p-2 hover:bg-gray-100 rounded-lg">
                            <Edit className="h-4 w-4" />
                          </CustomButton>
                        </Link>
                        <CustomButton
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          onClick={() =>
                            openDeleteModal("Article", article.id!)
                          }
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </CustomButton>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {article.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message si aucun menu ou article */}
        {(!menus || menus.length === 0) &&
          (!articlesWithoutMenus || articlesWithoutMenus.length === 0) && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm p-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="bg-gray-100 p-4 rounded-full">
                  <Utensils className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700">Aucun menu ou article disponible</h3>
                <p className="text-gray-500 max-w-md">
                  Ce restaurant n&apos;a pas encore de menus ou d&apos;articles. Vous pouvez en ajouter en utilisant les boutons ci-dessus.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <Link href={`/restaurants/${restaurantId}/menus/create`}>
                    <CustomButton className="bg-primary-50 hover:bg-primary-100 text-primary-900 px-4 py-2 rounded-lg flex items-center space-x-2">
                      <PlusCircle className="h-5 w-5" />
                      <span>Ajouter un menu</span>
                    </CustomButton>
                  </Link>
                  <Link href={`/restaurants/${restaurantId}/articles/create`}>
                    <CustomButton className="bg-primary-50 hover:bg-primary-100 text-primary-900 px-4 py-2 rounded-lg flex items-center space-x-2">
                      <PlusCircle className="h-5 w-5" />
                      <span>Ajouter un article</span>
                    </CustomButton>
                  </Link>
                </div>
              </div>
            </div>
          )}
      </div>

      {/* Modal de suppression */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        style={customModalStyles}
        contentLabel="Confirmer la suppression"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
          <p className="text-gray-600 mb-6">
            {deleteType === "Restaurant" &&
              "Êtes-vous sûr de vouloir supprimer ce restaurant ? Cette action est irréversible."}
            {deleteType === "Menu" &&
              "Êtes-vous sûr de vouloir supprimer ce menu et tous les articles associés ? Cette action est irréversible."}
            {deleteType === "Article" &&
              "Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible."}
          </p>
          <div className="flex justify-end space-x-4">
            <CustomButton
              onClick={closeDeleteModal}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Annuler
            </CustomButton>
            <CustomButton
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg"
            >
              Supprimer
            </CustomButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default RestaurantPage;

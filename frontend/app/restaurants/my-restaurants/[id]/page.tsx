"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
// import { RestaurantArticle } from "@/types/RestaurantArticle";
import { useParams, useRouter } from "next/navigation";
import { articles } from "@/mockData/articles";
import { deleteRestaurant, getRestaurantById } from "@/utils/apiRestaurant";
import { Restaurant } from "@/types/Restaurants";
import Link from "next/link";
import { Edit, Star, Trash } from "lucide-react";
import LoadingSpinner from "@/components/helper-components/LoadingSpinner";
import { useAuthStore } from "@/store/authStore";
import { CustomButton } from "@/components/helper-components/CustomButton";
import { customModalStyles } from "@/components/CustomModalStyles";
import Modal from "react-modal";
import { toast } from "react-toastify";

function RestaurantPage() {
  const { id } = useParams();
  const restaurantId = Number(id);

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore((state) => state.accessToken);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchRestaurant() {
      setLoading(true);
      try {
        const fetchedRestaurant = await getRestaurantById(restaurantId, token!);
        setRestaurant(fetchedRestaurant);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurant:", error);
        setError("Failed to fetch restaurant data.");
        setLoading(false);
      }
    }
    fetchRestaurant();
  }, [restaurantId, token]);

  const articlesFromRestaurant = articles.filter(
    (article) => article.restaurantId == restaurantId
  );

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const confirmDeleteAccount = async () => {
    if (!token) return;

    closeDeleteModal();

    try {
      await deleteRestaurant(restaurantId, token);
      toast.success("Account deleted successfully.");
      router.replace("/restaurants/my-restaurants/all");
    } catch (err) {
      console.error("Error deleting account:", err);
      toast.error("Failed to delete account.");
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
    <div className="max-w-md mx-auto">
      <div className="relative w-full h-40">
        <Image
          src={restaurant?.imagePath ?? "/burger.png"}
          alt="Restaurant Banner"
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />
      </div>

      <div className="flex flex-col items-center justify-between mx-4">
        <div className="flex flex-row items-center justify-end w-full">
          <Link href={`/restaurants/edit/${restaurantId}`}>
            <Edit className="h-6 ml-auto" />
          </Link>
          <CustomButton
            className="ml-1 rounded-md"
            onClick={() => openDeleteModal()}
          >
            <Trash className="h-6 text-red-600" />
          </CustomButton>
        </div>
        <div className="w-full">
          <h1 className="text-center font-bold text-2xl my-4">
            {restaurant?.name}
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center w-full mb-4">
          <p className="text-sm text-gray-500">{restaurant?.description}</p>
            <div className="flex flex-row items-center justify-center mt-2 w-full">
            <span className="text-sm text-black flex items-center">
            {restaurant?.averageRate}
            <Star className="h-4" />
            <span className="text-sm text-gray-500 ml-1">
            ({restaurant?.nbRate} avis)
            </span>
            </span>
            </div>
<div className="flex flex-row items-center justify-end w-full mt-5">
<Link href={`/restaurants/${restaurantId}/articles/create`}>
            <CustomButton className="rounded-2xl bg-gray-50 py-1.5 px-3 text-sm shadow-sm border border-gray-600">
              Ajouter un article
            </CustomButton>
          </Link>
</div>
        </div>
      </div>

      {articlesFromRestaurant.length > 0 ? (
        <ul className="p-4">
          {articlesFromRestaurant.map((article) => (
            <li
              key={article.id}
              className="flex items-center justify-between mb-4 border border-gray-300 shadow-lg rounded-2xl p-4"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex w-full items-center flex-row">
                  <Image
                    src={article.imagePath}
                    alt={article.name}
                    width={80}
                    height={80}
                    className="rounded-b-md"
                  />
                  <div className="ml-4">
                    <h2 className="font-semibold">{article.name}</h2>
                    <p className="text-sm text-gray-500">{article.price}</p>
                    <p className="text-xs text-gray-400">
                      {article.description}
                    </p>
                  </div>
                </div>
                <div>
                  <Link href={`/articles/${article.id}`} className="ml-auto">
                    <Edit className="h-8" />
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 mt-4">
          Aucun article disponible pour ce restaurant.
        </p>
      )}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        style={customModalStyles}
        contentLabel="Confirm Account Deletion"
      >
        <div className="flex flex-col space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Confirmer la suppression
          </h2>
          <p className="text-gray-700">
            Êtes-vous sûr de vouloir supprimer ce restaurant ? Cette action ne
            peut pas être annulée.
          </p>
          <div className="flex justify-end space-x-3">
            <CustomButton
              onClick={closeDeleteModal}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Annuler
            </CustomButton>
            <CustomButton
              onClick={confirmDeleteAccount}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white button-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Confirmer la suppression
            </CustomButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default RestaurantPage;

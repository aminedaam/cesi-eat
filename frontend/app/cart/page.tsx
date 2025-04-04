"use client";

import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { useState, useEffect } from "react";
// import { Restaurant } from "@/types/Restaurants"; // Import the restaurants array
import { restaurants } from "@/mockData/restaurants";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { CustomButton } from "@/components/helper-components/CustomButton";
import Link from "next/link";
import { customModalStyles } from "@/components/header_footers/CustomModalStyles";
import { getMe } from "@/utils/apiUser";
import { useAuthStore } from "@/store/authStore";

interface RestaurantDetails {
  name?: string;
  imagePath?: string;
  address?: string;
  // Add other relevant properties from your Restaurant type
}

if (typeof window !== "undefined") {
  Modal.setAppElement("#__next");
}

const CartPage = () => {
  const router = useRouter();

  const accessToken = useAuthStore((state) => state.accessToken);
  const [userAddress, setuserAddress] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) return;
      const response = await getMe(accessToken!);
      setuserAddress(response.address);
    };
    fetchData();
  }, [accessToken]);

  const { items, clearCartForRestaurant } = useCartStore();
  const [restaurantDetails, setRestaurantDetails] = useState<{
    [restaurantId: number]: RestaurantDetails;
  }>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [restaurantIdToDelete, setRestaurantIdToDelete] = useState<
    number | null
  >(null);
  const [restaurantNameToDelete, setRestaurantNameToDelete] = useState<
    string | null
  >(null);

  const groupedByRestaurant = items.reduce((acc, item) => {
    const { restaurantId } = item.article;

    if (!acc[restaurantId]) {
      acc[restaurantId] = {
        items: [],
        total: 0,
        quantity: 0,
      };
    }

    acc[restaurantId].items.push(item);
    acc[restaurantId].quantity += item.quantity;
    acc[restaurantId].total += item.article.price * item.quantity;

    return acc;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, {} as any);

  useEffect(() => {
    const fetchRestaurantData = () => {
      const uniqueRestaurantIds = Object.keys(groupedByRestaurant).map(Number);

      const details: { [restaurantId: number]: RestaurantDetails } = {};

      for (const restaurantId of uniqueRestaurantIds) {
        const restaurant = restaurants.find((r) => r.id === restaurantId);
        if (restaurant) {
          details[restaurantId] = {
            name: restaurant.name,
            imagePath: restaurant.image, // Assuming 'image' in your Restaurant type is the path
            // You might not have an 'address' property in your Restaurant type,
            // you can either add a mock address here or remove it from the rendering
          };
        }
      }
      setRestaurantDetails(details);
    };

    fetchRestaurantData();
  }, []); // Make sure to include groupedByRestaurant in the dependency array

  const openDeleteModal = ({ id, name }: { id: number; name: string }) => {
    setRestaurantIdToDelete(id);
    setRestaurantNameToDelete(name);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setRestaurantIdToDelete(null);
    setRestaurantNameToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmClearCartForRestaurant = async () => {
    if (restaurantIdToDelete !== null) {
      closeDeleteModal();
      try {
        clearCartForRestaurant(restaurantIdToDelete);
        toast.success(`Panier pour ${restaurantNameToDelete} vidé.`);
      } catch (err) {
        console.error("Error deleting account:", err);
        toast.error("Erreur lors de la suppression du panier.");
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Paniers</h1>

      {items.length === 0 && (
        <div className="max-w-lg mx-auto px-4 py-4 flex flex-col items-center h-[calc(100vh-6rem)]">
          <p className="text-center text-gray-600 mb-4 font-bold text-xl w-64">
            Ajoutez des articles pour commencer un panier
          </p>
          <p className="text-center text-sm text-gray-500 mb-6">
            Une fois que vous avez ajouté des plats d&apos;un restaurant, votre
            panier s&apos;affiche ici.
          </p>
          <Link href="/home">
            <CustomButton className="button-primary-50 rounded-2xl px-2">
              Commander
            </CustomButton>
          </Link>
        </div>
      )}

      {Object.entries(groupedByRestaurant).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ([restaurantIdStr, restaurant]: any) => {
          const restaurantId = parseInt(restaurantIdStr);
          const details = restaurantDetails[restaurantId] || {};

          return (
            <div
              key={restaurantId}
              className="bg-white rounded-xl shadow-md mb-4 p-4"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {details.imagePath && (
                    <Image
                      src={details.imagePath}
                      alt={details.name || `Restaurant ${restaurantId}`}
                      width={40}
                      height={40}
                      className="rounded-full mr-2 object-cover"
                    />
                  )}
                  <div>
                    <h2 className="font-semibold">
                      {details.name || `Restaurant ${restaurantId}`}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {restaurant.quantity} plats •{" "}
                      {restaurant.total.toFixed(2)} €
                    </p>
                    {userAddress && (
                      <p className="text-sm text-gray-500">
                        Livrer à l&apos;adresse {userAddress}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() =>
                    openDeleteModal({ id: restaurantId, name: details.name! })
                  }
                >
                  <Trash className="text-primary-100 w-4 h-4 cursor-pointer" />
                </button>{" "}
              </div>

              <div className="mt-4 space-y-2">
                <button
                  className="w-full bg-black text-white py-2 rounded-lg font-semibold"
                  onClick={() => router.push(`/cart/${restaurantId}`)}
                >
                  Voir le panier
                </button>
                <button
                  className="w-full bg-gray-100 text-black py-2 rounded-lg font-semibold"
                  onClick={() => router.push(`/restaurants/${restaurantId}`)}
                >
                  Afficher l&apos;établissement
                </button>
              </div>
            </div>
          );
        }
      )}
      {/* Modal for clearing cart for a specific restaurant */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        style={customModalStyles}
        contentLabel="Confirm Clear Cart"
      >
        <div className="flex flex-col space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Confirmer la suppression
          </h2>
          <p className="text-gray-700">
            Vider le panier pour {restaurantNameToDelete} ?
          </p>
          <div className="flex justify-end space-x-3">
            <CustomButton
              onClick={closeDeleteModal}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Annuler
            </CustomButton>
            <CustomButton
              onClick={confirmClearCartForRestaurant}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white button-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Vider
            </CustomButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CartPage;

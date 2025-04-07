"use client";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Minus, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { CustomButton } from "@/components/helper-components/CustomButton";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { customModalStyles } from "@/components/CustomModalStyles";
import { getRestaurantById } from "@/utils/apiRestaurant";
import { Restaurant } from "@/types/Restaurants";

const CartPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { totalPrice, removeItem, addItem, clearItem, getItemsByRestaurant } =
    useCartStore();

  const restaurantId = Number(id);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    async function fetchRestaurant() {
      const fetchedRestaurant = await getRestaurantById(restaurantId);
      console.log(fetchRestaurant);
      setRestaurant(fetchedRestaurant);
    }
    fetchRestaurant();
  }, [restaurantId]);

  const restaurantItems = getItemsByRestaurant(restaurantId);

  const [itemIdToDelete, setItemIdToDelete] = useState<number | null>(null);
  const [itemNameToDelete, setItemNameToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (restaurantItems.length === 0) {
      router.push("/");
    }
  }, [restaurantItems, router]);

  const openDeleteModal = ({ id, name }: { id: number; name: string }) => {
    setItemIdToDelete(id);
    setItemNameToDelete(name);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setItemIdToDelete(null);
    setItemNameToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmClearCartForRestaurant = async () => {
    if (itemIdToDelete !== null) {
      closeDeleteModal();
      try {
        clearItem(itemIdToDelete);
        toast.success(
          `${itemNameToDelete
            ?.charAt(0)
            .toUpperCase()}${itemNameToDelete?.slice(1)} supprimé du panier.`
        );
      } catch (err) {
        console.error("Error deleting account:", err);
        toast.error("Erreur lors de la suppression de l'article.");
      }
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-4">
        <h1 className="font-semibold text-xl mb-4">
          {restaurant?.name ?? "Restaurant"}
        </h1>

        <div className="space-y-4">
          {restaurantItems.map((item) => (
            <div
              key={item.article.id}
              className="flex items-center justify-between"
            >
              <Image
                src={item.article.imagePath}
                alt={item.article.name}
                width={80}
                height={80}
                className="rounded-md object-cover"
              />
              <div className="flex-1 ml-3 ">
                <p className="font-medium">{item.article.name}</p>
                <p className="text-sm text-gray-500">
                  {item.article.price.toFixed(2)}$
                </p>
                <p className="text-xs text-gray-400">Description du produit</p>
              </div>
              <div className="flex items-center space-x-2 px-2 py-1 bg-gray-200 rounded-full">
                {item.quantity > 1 && (
                  <button onClick={() => removeItem(item.article.id)}>
                    <Minus className="w-4 h-4" />
                  </button>
                )}
                {item.quantity === 1 && (
                  <button
                    onClick={() =>
                      openDeleteModal({
                        id: item.article.id,
                        name: item.article.name,
                      })
                    }
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                )}
                <span>{item.quantity}</span>
                <button onClick={() => addItem(item.article)}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full flex justify-between flex-row-reverse mt-4">
          <Link href={`/restaurants/${restaurantId}`}>
            <button className="flex items-center justify-center bg-gray-200 rounded-full py-2 mt-4 p-2 text-sm font-medium hover:bg-gray-50">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter des articles
            </button>
          </Link>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-4">
          <button className="w-full text-left py-2 border-b border-gray-200 text-sm">
            Ajouter une remarque
          </button>
          <button className="w-full text-left py-2 text-sm">
            Ajouter un code promo
          </button>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <p className="font-semibold">Sous-total</p>
          <p className="font-semibold">{totalPrice.toFixed(2)} $</p>
        </div>
        <Link href={`/checkout/${restaurantId}`}>
          {" "}
          <button className="w-full bg-black text-white rounded-lg py-3 font-medium mt-4 hover:bg-gray-900">
            Procéder au paiement
          </button>
        </Link>
      </div>
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
            Enlever {itemNameToDelete} du panier ?
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

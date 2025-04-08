"use client";
import Image from "next/image";
// Import specific types from the store for clarity
import { useCartStore, ArticleCartItem, MenuCartItem } from "@/store/cartStore";
import { useEffect, useState, useMemo } from "react"; // Added useMemo
import { useRouter, useParams } from "next/navigation";
import { Minus, Plus, Trash, ArrowLeft, ShoppingCart, CreditCard, PlusCircle } from "lucide-react";
import Link from "next/link";
import { CustomButton } from "@/components/helper-components/CustomButton";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { customModalStyles } from "@/components/CustomModalStyles";
import { getRestaurantById } from "@/utils/apiRestaurant";
import { Restaurant } from "@/types/Restaurants";
import { Article } from "@/types/Articles"; // Keep Article type
import { Menu } from "@/types/Menu"; // Keep Menu type
import { useAuthStore } from "@/store/authStore";
import { Building2 } from "lucide-react";

// Helper Type Guard
function isArticleCartItem(
  item: ArticleCartItem | MenuCartItem
): item is ArticleCartItem {
  return "price" in item.item;
}

const RestaurantCartPage = () => {
  // Renamed component slightly for clarity
  const router = useRouter();
  const { id } = useParams();
  const restaurantId = Number(id);
  const accessToken = useAuthStore((state) => state.accessToken);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: number;
    name: string;
    type: "article" | "menu";
  } | null>(null);

  // --- Get Store Actions ---
  // Note: addItem is removed, addArticle and addMenu are used instead if needed (or triggered from buttons)
  const {
    // totalPrice, // We calculate restaurant-specific total locally
    removeItem,
    addArticle, // Use specific add actions
    addMenu, // Use specific add actions
    clearItem,
    getItemsByRestaurant,
  } = useCartStore();
  // ------------------------

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoadingRestaurant, setIsLoadingRestaurant] = useState(true); // Loading state for restaurant

  // --- Fetch restaurant details ---
  useEffect(() => {
    async function fetchRestaurant() {
      if (!restaurantId) return;
      setIsLoadingRestaurant(true);
      try {
        const fetchedRestaurant = await getRestaurantById(
          restaurantId,
          accessToken!
        );
        // console.log("Fetched Restaurant for Cart Page:", fetchedRestaurant);
        setRestaurant(fetchedRestaurant);
      } catch (error) {
        console.error("Failed to fetch restaurant for cart page:", error);
        // Handle error - maybe show a message or redirect
      } finally {
        setIsLoadingRestaurant(false);
      }
    }
    fetchRestaurant();
  }, [restaurantId, accessToken]);
  // -----------------------------

  // --- Get items for *this* restaurant ---
  // This function call is correct as it returns the combined array for the ID
  const restaurantItems = getItemsByRestaurant(restaurantId);
  // ------------------------------------

  // --- Calculate restaurant-specific subtotal ---
  const restaurantTotalPrice = useMemo(() => {
    return restaurantItems.reduce((sum, cartItem) => {
      // Use type guard to access correct price
      const price = isArticleCartItem(cartItem)
        ? cartItem.item.price
        : cartItem.item.priceMenu;
      return sum + price * cartItem.quantity;
    }, 0);
  }, [restaurantItems]);
  // -------------------------------------------

  // --- Redirect if cart for this restaurant is empty ---
  useEffect(() => {
    // Only redirect if we are *not* loading the restaurant details
    // and the items array is definitively empty.
    if (!isLoadingRestaurant && restaurantItems.length === 0) {
      toast.info("Votre panier pour ce restaurant est vide.");
      router.push(`/restaurants/${restaurantId}`); // Go back to restaurant page
    }
  }, [restaurantItems, isLoadingRestaurant, restaurantId, router]);
  // ---------------------------------------------------

  // --- Modal Logic ---
  const openDeleteModal = (item: {
    id: number;
    name: string;
    type: "article" | "menu";
  }) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setItemToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmItemDeletion = async () => {
    // Renamed function
    if (itemToDelete) {
      const itemInfo = { ...itemToDelete }; // Capture info before closing modal potentially clears it
      closeDeleteModal();
      try {
        // --- Pass item type to clearItem ---
        clearItem(itemInfo.id, itemInfo.type);
        // ------------------------------------
        toast.success(
          `${itemInfo.name?.charAt(0).toUpperCase()}${itemInfo.name?.slice(
            1
          )} supprimé du panier.`
        );
      } catch (err) {
        console.error("Error deleting item:", err);
        toast.error("Erreur lors de la suppression de l'article.");
      }
    }
  };
  // -------------------

  if (isLoadingRestaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <ShoppingCart className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">Chargement du panier...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center">
              {restaurant?.imagePath ? (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 mr-4">
                  <Image
                    src={restaurant.imagePath}
                    alt={restaurant?.name || `Restaurant ${restaurantId}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gray-200 flex-shrink-0 mr-4 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div>
                <h1 className="font-bold text-xl text-gray-900">
                  {restaurant?.name ?? `Restaurant ${restaurantId}`}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {restaurantItems.length} article{restaurantItems.length > 1 ? "s" : ""} dans votre panier
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-5">
              {restaurantItems.map((cartItem) => {
                // --- Determine item details based on type ---
                const isArticle = isArticleCartItem(cartItem);
                const item = cartItem.item; // Reference the nested item
                const id = item.id;
                const name = item.name;
                const price = isArticle
                  ? (item as Article).price
                  : (item as Menu).priceMenu;
                // Get imagePath if it exists on both types, otherwise use fallback
                const imagePath = (item as Article).imagePath ?? "/burger.png"; // Provide a fallback image
                const type = isArticle ? "article" : "menu";

                // Basic check for valid ID
                if (typeof id === "undefined") {
                  console.warn("Cart item missing ID:", cartItem);
                  return null; // Skip rendering items without ID
                }
                // -------------------------------------------

                return (
                  <div
                    key={`${type}-${id}`} // Use combined key for potential ID clashes between articles/menus
                    className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                  >
                    {/* --- Display Item --- */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={imagePath} // Use extracted imagePath
                        alt={name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {price.toFixed(2)}€
                      </p>
                      {item.description && (
                        <p className="text-xs text-gray-400 truncate mt-1 max-w-xs">
                          {item.description}
                        </p>
                      )}
                    </div>
                    {/* -------------------- */}

                    {/* --- Quantity Controls --- */}
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-white rounded-full flex-shrink-0 shadow-sm">
                      {cartItem.quantity > 1 ? (
                        // --- Call removeItem with type ---
                        <button
                          title="Réduire la quantité"
                          onClick={() => removeItem(id, type)}
                          className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      ) : (
                        // -------------------------------
                        // --- Call openDeleteModal with type ---
                        <button
                          title="Supprimer l'article"
                          onClick={() => openDeleteModal({ id, name, type })}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                        // -------------------------------------
                      )}
                      <span className="font-medium text-sm w-6 text-center">
                        {cartItem.quantity}
                      </span>
                      {/* --- Call addArticle/addMenu --- */}
                      <button
                        title="Augmenter la quantité"
                        onClick={() =>
                          isArticle
                            ? addArticle(item as Article)
                            : addMenu(item as Menu)
                        }
                        className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      {/* --------------------------- */}
                    </div>
                    {/* ----------------------- */}
                  </div>
                );
              })}
            </div>
            
            {/* --- Add More Items Button --- */}
            <div className="w-full flex justify-center mt-8">
              <Link href={`/restaurants/${restaurantId}`}>
                <button className="flex items-center justify-center bg-gray-100 rounded-full py-3 px-6 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors shadow-sm hover:shadow-md">
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Ajouter d&apos;autres articles
                </button>
              </Link>
            </div>
            {/* --------------------------- */}
            
            {/* --- Subtotal Display --- */}
            <div className="border-t border-gray-200 mt-8 pt-6">
              <div className="flex justify-between items-center mb-4">
                <p className="font-semibold text-gray-700">Sous-total</p>
                {/* --- Use calculated restaurantTotalPrice --- */}
                <p className="font-bold text-xl text-gray-900">{restaurantTotalPrice.toFixed(2)} €</p>
                {/* ----------------------------------------- */}
              </div>
              {/* --- Checkout Button --- */}
              <Link href={`/checkout/${restaurantId}`} className="mt-4 block">
                <button className="w-full bg-black text-white rounded-xl py-3.5 font-medium hover:bg-gray-800 transition-colors flex items-center justify-center shadow-md hover:shadow-lg">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Procéder au paiement
                </button>
              </Link>
              {/* --------------------- */}
            </div>
          </div>
        </div>
      </div>
      
      {/* --- Modal Update --- */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        style={customModalStyles}
        contentLabel="Confirm Item Deletion" // Updated label
      >
        <div className="flex flex-col space-y-6 p-6">
          <div className="flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mx-auto mb-2">
            <Trash className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Confirmer la suppression
          </h2>
          <p className="text-gray-700 text-center">
            {/* --- Use itemToDelete info --- */}
            Voulez-vous vraiment enlever <span className="font-semibold">{itemToDelete?.name}</span> du panier ?
            {/* ------------------------- */}
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <CustomButton
              onClick={closeDeleteModal}
              className="py-3 px-6 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
            >
              Annuler
            </CustomButton>
            <CustomButton
              onClick={confirmItemDeletion} // Use updated function name
              className="py-3 px-6 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200" // Style as destructive action
            >
              Supprimer {/* Changed button text */}
            </CustomButton>
          </div>
        </div>
      </Modal>
      {/* ------------------ */}
    </div>
  );
};

export default RestaurantCartPage;

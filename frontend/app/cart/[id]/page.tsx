"use client";
import Image from "next/image";
// Import specific types from the store for clarity
import { useCartStore, ArticleCartItem, MenuCartItem } from "@/store/cartStore";
import { useEffect, useState, useMemo } from "react"; // Added useMemo
import { useRouter, useParams } from "next/navigation";
import { Minus, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { CustomButton } from "@/components/helper-components/CustomButton";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { customModalStyles } from "@/components/CustomModalStyles";
import { getRestaurantById } from "@/utils/apiRestaurant";
import { Restaurant } from "@/types/Restaurants";
import { Article } from "@/types/Articles"; // Keep Article type
import { Menu } from "@/types/Menu"; // Keep Menu type

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
        const fetchedRestaurant = await getRestaurantById(restaurantId);
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
  }, [restaurantId]);
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
    return <div className="p-6 text-center">Chargement du panier...</div>; // Simple loading state
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {" "}
      {/* Added padding */}
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-6">
        {" "}
        {/* Adjusted padding */}
        <h1 className="font-semibold text-xl mb-6">
          {" "}
          {/* Added margin */}
          Panier pour: {restaurant?.name ?? `Restaurant ${restaurantId}`}
        </h1>
        {/* --- Iterate over combined items --- */}
        <div className="space-y-4">
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
            const imagePath =
              (item as Article).imagePath ??
              (item as Menu).imagePath ??
              "/burger.png"; // Provide a fallback image
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
                className="flex items-center justify-between gap-3" // Added gap
              >
                {/* --- Display Item --- */}
                <Image
                  src={imagePath} // Use extracted imagePath
                  alt={name}
                  width={64} // Slightly smaller image?
                  height={64}
                  className="rounded-md object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  {" "}
                  {/* Added min-w-0 for text truncation */}
                  <p className="font-medium truncate">{name}</p>{" "}
                  {/* Added truncate */}
                  <p className="text-sm text-gray-500">
                    {price.toFixed(2)}€ {/* Standardize currency */}
                  </p>
                  {/* Optional: Add description if available and needed */}
                  {/* <p className="text-xs text-gray-400 truncate">{item.description ?? ''}</p> */}
                </div>
                {/* -------------------- */}

                {/* --- Quantity Controls --- */}
                <div className="flex items-center space-x-2 px-2 py-1 bg-gray-100 rounded-full flex-shrink-0">
                  {cartItem.quantity > 1 ? (
                    // --- Call removeItem with type ---
                    <button
                      title="Réduire la quantité"
                      onClick={() => removeItem(id, type)}
                      className="p-1 text-gray-600 hover:text-black"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  ) : (
                    // -------------------------------
                    // --- Call openDeleteModal with type ---
                    <button
                      title="Supprimer l'article"
                      onClick={() => openDeleteModal({ id, name, type })}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                    // -------------------------------------
                  )}
                  <span className="font-medium text-sm w-4 text-center">
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
                    className="p-1 text-gray-600 hover:text-black"
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
        {/* ---------------------------------- */}
        {/* --- Add More Items Button --- */}
        <div className="w-full flex justify-center mt-6">
          <Link href={`/restaurants/${restaurantId}`}>
            <button className="flex items-center justify-center bg-gray-100 rounded-full py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter d'autres articles
            </button>
          </Link>
        </div>
        {/* --------------------------- */}
        {/* --- Remarks / Promo Code (Optional - No changes needed) --- */}
        {/* <div className="border-t border-gray-200 mt-6 pt-4">
             <button className="w-full text-left py-2 border-b border-gray-200 text-sm text-gray-500 hover:text-black"> Ajouter une remarque </button>
             <button className="w-full text-left py-2 text-sm text-gray-500 hover:text-black"> Ajouter un code promo </button>
           </div> */}
        {/* ------------------------------------------------------- */}
        {/* --- Subtotal Display --- */}
        <div className="border-t border-gray-200 mt-6 pt-4">
          <div className="mt-4 flex justify-between items-center">
            <p className="font-semibold">Sous-total</p>
            {/* --- Use calculated restaurantTotalPrice --- */}
            <p className="font-semibold">{restaurantTotalPrice.toFixed(2)} €</p>
            {/* ----------------------------------------- */}
          </div>
          {/* --- Checkout Button --- */}
          <Link href={`/checkout/${restaurantId}`} className="mt-4 block">
            <button className="w-full bg-black text-white rounded-lg py-3 font-medium hover:bg-gray-800 transition-colors">
              Procéder au paiement
            </button>
          </Link>
          {/* --------------------- */}
        </div>
      </div>
      {/* --- Modal Update --- */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        style={customModalStyles}
        contentLabel="Confirm Item Deletion" // Updated label
      >
        <div className="flex flex-col space-y-4 p-2">
          <h2 className="text-xl font-semibold text-gray-900">
            Confirmer la suppression
          </h2>
          <p className="text-gray-700">
            {/* --- Use itemToDelete info --- */}
            Enlever <span className="font-medium">{itemToDelete?.name}</span> du
            panier ?{/* ------------------------- */}
          </p>
          <div className="flex justify-end space-x-3 pt-2">
            <CustomButton
              onClick={closeDeleteModal}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Annuler
            </CustomButton>
            <CustomButton
              onClick={confirmItemDeletion} // Use updated function name
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" // Style as destructive action
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

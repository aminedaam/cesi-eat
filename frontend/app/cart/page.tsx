"use client";

import Image from "next/image";
// Import specific types from store if needed, or rely on inference
import { useCartStore, ArticleCartItem, MenuCartItem } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { Trash, ShoppingBag, Building2, MapPin, ShoppingCart } from "lucide-react";
// --- Import useMemo ---
import { useState, useEffect, useMemo } from "react";
// ----------------------
import Modal from "react-modal";
import { toast } from "react-toastify";
import { CustomButton } from "@/components/helper-components/CustomButton";
import Link from "next/link";
import { customModalStyles } from "@/components/CustomModalStyles";
import { getMe } from "@/utils/apiUser";
import { useAuthStore } from "@/store/authStore";
import { getAllRestaurants } from "@/utils/apiRestaurant";
import { Restaurant } from "@/types/Restaurants"; // Keep this Restaurant type

// Interface for storing aggregated data per restaurant in the component state
interface GroupedRestaurantData {
  items: (ArticleCartItem | MenuCartItem)[]; // Contains both types of items for this restaurant
  total: number;
  quantity: number;
}

// Interface for restaurant details fetched/found
interface RestaurantDetails {
  name?: string;
  imagePath?: string;
  address?: string;
  // Add other relevant properties from your Restaurant type if needed
}

if (typeof window !== "undefined") {
  Modal.setAppElement("#__next"); // Ensure this runs client-side only
}

const CartPage = () => {
  const router = useRouter();

  const accessToken = useAuthStore((state) => state.accessToken);
  const [userAddress, setUserAddress] = useState(""); // Renamed for clarity

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) return;
      try {
        const response = await getMe(accessToken);
        if (response?.address) {
          // Check if response and address exist
          setUserAddress(response.address);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // Handle error appropriately, maybe clear address or show a message
      }
    };
    fetchData();
  }, [accessToken]);

  // --- Store Modification: Get articles and menus instead of items ---
  const { articles, menus, clearCartForRestaurant } = useCartStore();
  // --------------------------------------------------------------------

  const [restaurantDetails, setRestaurantDetails] = useState<
    Record<number, RestaurantDetails> // Use Record for better typing
  >({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [restaurantIdToDelete, setRestaurantIdToDelete] = useState<
    number | null
  >(null);
  const [restaurantNameToDelete, setRestaurantNameToDelete] = useState<
    string | null
  >(null);
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);

  // --- Memoize the grouping logic ---
  const groupedByRestaurant = useMemo(() => {
    console.log("Recalculating groupedByRestaurant..."); // Add log to see when it runs
    return [...articles, ...menus].reduce((acc, cartItem) => {
      // Determine restaurant ID and price based on item type
      let restaurantId: number | undefined | null = null;
      let price = 0;
      // let itemRef: ArticleCartItem['item'] | MenuCartItem['item'] | null = null; // Not strictly needed here

      if ("item" in cartItem && "price" in cartItem.item) {
        const articleItem = cartItem as ArticleCartItem;
        if (articleItem.item?.restaurant?.id) {
          // itemRef = articleItem.item;
          restaurantId = articleItem.item.restaurant.id;
          price = articleItem.item.price;
        } else {
          console.warn(
            "Memo: Skipping article item with missing data:",
            articleItem
          );
          return acc;
        }
      } else if ("item" in cartItem && "priceMenu" in cartItem.item) {
        const menuItem = cartItem as MenuCartItem;
        if (menuItem.item?.restaurant?.id) {
          // itemRef = menuItem.item;
          restaurantId = menuItem.item.restaurant.id;
          price = menuItem.item.priceMenu;
        } else {
          console.warn(
            "Memo: Skipping menu item with missing restaurant data:",
            menuItem
          );
          return acc;
        }
      } else {
        console.warn("Memo: Skipping unknown cart item type:", cartItem);
        return acc;
      }

      if (typeof restaurantId !== "number") {
        return acc;
      }

      if (!acc[restaurantId]) {
        acc[restaurantId] = {
          items: [],
          total: 0,
          quantity: 0,
        };
      }

      acc[restaurantId].items.push(cartItem);
      acc[restaurantId].quantity += cartItem.quantity;
      acc[restaurantId].total += price * cartItem.quantity;

      return acc;
    }, {} as Record<number, GroupedRestaurantData>);
    // --- Add articles and menus as dependencies for useMemo ---
  }, [articles, menus]);
  // ---------------------------------------------------------

  // Fetch all restaurants once on mount (This useEffect is fine)
  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const fetchedRestaurants = await getAllRestaurants();
        setRestaurants(fetchedRestaurants);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      }
    }
    fetchRestaurants();
  }, []);

  // Update restaurant details (This useEffect should now be stable)
  useEffect(() => {
    // Ensure we have both the groups and the restaurant list before proceeding
    if (!restaurants || Object.keys(groupedByRestaurant).length === 0) {
      // Check if details actually need clearing to prevent potential mini-loop if initial state is {}
      if (Object.keys(restaurantDetails).length > 0) {
        console.log(
          "Clearing restaurant details due to missing data or empty groups."
        );
        setRestaurantDetails({});
      }
      return;
    }

    console.log(
      "Updating restaurant details because groups or restaurants changed."
    ); // Add log
    const uniqueRestaurantIds = Object.keys(groupedByRestaurant).map(Number);
    const details: Record<number, RestaurantDetails> = {};
    let detailsChanged = false; // Flag to check if details actually change

    for (const restaurantId of uniqueRestaurantIds) {
      const restaurant = restaurants.find((r) => r.id === restaurantId);
      if (restaurant) {
        details[restaurantId] = {
          name: restaurant.name,
          imagePath: restaurant.imagePath,
        };
        // Check if this detail is different from the existing one
        if (
          !restaurantDetails[restaurantId] ||
          restaurantDetails[restaurantId].name !== details[restaurantId].name ||
          restaurantDetails[restaurantId].imagePath !==
            details[restaurantId].imagePath
        ) {
          detailsChanged = true;
        }
      } else {
        console.warn(
          `Details for restaurant ID ${restaurantId} not found in fetched list.`
        );
        // Check if this ID existed before and needs removal
        if (restaurantDetails[restaurantId]) {
          detailsChanged = true;
        }
      }
    }

    // Also check if any old details need to be removed
    if (!detailsChanged) {
      const oldKeys = Object.keys(restaurantDetails).map(Number);
      const newKeys = Object.keys(details).map(Number);
      if (
        oldKeys.length !== newKeys.length ||
        !oldKeys.every((key) => newKeys.includes(key))
      ) {
        detailsChanged = true;
      }
    }

    // Only set state if the details have actually changed
    if (detailsChanged) {
      console.log("Setting new restaurant details:", details);
      setRestaurantDetails(details);
    } else {
      console.log("Restaurant details haven't changed, skipping update.");
    }

    // Dependency array is correct, relying on the memoized groupedByRestaurant
  }, [groupedByRestaurant, restaurants, restaurantDetails]); // Added restaurantDetails to dependency to check against current state

  const openDeleteModal = ({ id, name }: { id: number; name?: string }) => {
    // name can be undefined
    setRestaurantIdToDelete(id);
    setRestaurantNameToDelete(name || `Restaurant ${id}`); // Fallback name
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setRestaurantIdToDelete(null);
    setRestaurantNameToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmClearCartForRestaurant = async () => {
    if (restaurantIdToDelete !== null) {
      const nameToDelete = restaurantNameToDelete; // Capture name before closing modal
      closeDeleteModal();
      try {
        clearCartForRestaurant(restaurantIdToDelete);
        toast.success(`Panier pour ${nameToDelete} vidé.`);
      } catch (err) {
        console.error("Error clearing cart for restaurant:", err); // Corrected log message
        toast.error("Erreur lors de la suppression du panier.");
      }
    }
  };

  // --- Empty Cart Check Modification ---
  const isCartEmpty = articles.length === 0 && menus.length === 0;
  // -------------------------------------

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mes Paniers</h1>
        <div className="hidden sm:block">
          <Link href="/home">
            <CustomButton className="button-primary-50 rounded-full px-6 py-2.5 shadow-sm hover:shadow-md transition-all duration-300">
              Continuer mes achats
            </CustomButton>
          </Link>
        </div>
      </div>

      {isCartEmpty && (
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center text-center h-[calc(100vh-16rem)] max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <p className="text-gray-800 mb-4 font-bold text-xl">
            Votre panier est vide
          </p>
          <p className="text-sm text-gray-500 mb-8 max-w-xs">
            Une fois que vous aurez ajouté des plats d&apos;un restaurant, votre panier s&apos;affichera ici.
          </p>
          <Link href="/home">
            <CustomButton className="button-primary-50 rounded-full px-8 py-3 shadow-md hover:shadow-lg transition-all duration-300 text-base">
              Découvrir les restaurants
            </CustomButton>
          </Link>
        </div>
      )}

      {!isCartEmpty && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(groupedByRestaurant).map(
            ([restaurantIdStr, restaurantData]: [
              string,
              GroupedRestaurantData
            ]) => {
              const restaurantId = parseInt(restaurantIdStr, 10);
              const details = restaurantDetails[restaurantId] || {};

              return (
                <div
                  key={restaurantId}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-4">
                        {details.imagePath ? (
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                            <Image
                              src={details.imagePath}
                              alt={details.name || `Restaurant ${restaurantId}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gray-200 flex-shrink-0 flex items-center justify-center">
                            <Building2 className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-grow">
                          <h2 className="font-bold text-xl text-gray-900">
                            {details.name || `Restaurant ${restaurantId}`}
                          </h2>
                          <p className="text-sm text-gray-600 mt-1">
                            {restaurantData.quantity} article
                            {restaurantData.quantity > 1 ? "s" : ""} •{" "}
                            <span className="font-semibold">{restaurantData.total.toFixed(2)} €</span>
                          </p>
                          {userAddress && (
                            <p className="text-xs text-gray-500 mt-2 flex items-center">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              Livrer à {userAddress}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        title="Vider le panier de ce restaurant"
                        onClick={() =>
                          openDeleteModal({ id: restaurantId, name: details.name })
                        }
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mt-6 space-y-3">
                      <button
                        className="w-full bg-black text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition duration-200 flex items-center justify-center"
                        onClick={() => router.push(`/cart/${restaurantId}`)}
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Voir le panier
                      </button>
                      <button
                        className="w-full bg-gray-50 text-gray-800 py-3 rounded-xl font-semibold text-sm hover:bg-gray-100 transition duration-200 flex items-center justify-center"
                        onClick={() => router.push(`/restaurants/${restaurantId}`)}
                      >
                        <Building2 className="h-5 w-5 mr-2" />
                        Afficher l&apos;établissement
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}

      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        style={customModalStyles}
        contentLabel="Confirm Clear Cart"
      >
        <div className="flex flex-col space-y-6 p-6">
          <div className="flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mx-auto mb-2">
            <Trash className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Confirmer la suppression
          </h2>
          <p className="text-gray-700 text-center">
            Voulez-vous vraiment vider le panier pour{" "}
            <span className="font-semibold">{restaurantNameToDelete}</span> ?
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <CustomButton
              onClick={closeDeleteModal}
              className="py-3 px-6 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
            >
              Annuler
            </CustomButton>
            <CustomButton
              onClick={confirmClearCartForRestaurant}
              className="py-3 px-6 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white button-primary-100 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
            >
              Vider le panier
            </CustomButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CartPage;

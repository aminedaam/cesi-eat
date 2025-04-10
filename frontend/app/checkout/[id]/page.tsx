"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
// Import specific types and functions from store
import { useCartStore, ArticleCartItem, MenuCartItem } from "@/store/cartStore";
import {
  ChevronRight,
  ChevronDown,
  MapPin,
  Phone,
  Clock,
  CreditCard,
  ShoppingBag,
  Building2,
  Truck,
  Receipt,
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";
// Import useMemo
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useAuthStore } from "@/store/authStore";
import useCoordinates from "@/hooks/useCoordinates";
import "leaflet/dist/leaflet.css";
import L, { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import useAddressFromCoordinates from "@/hooks/useAddressFromCoordinates";
import { Position } from "@/types/Position";
import useTravelTime from "@/hooks/useTravelTime";
import { getRestaurantById } from "@/utils/apiRestaurant";
import { Restaurant } from "@/types/Restaurants";
import { useMe } from "@/hooks/useMe";
import { Article } from "@/types/Articles";
import { Menu } from "@/types/Menu";
import CreditCardForm from "@/components/creditCartForm";
import { Commande, CommandeArticle, CommandeMenu } from "@/types/Commandes";
import {
  convertArticleCartItemsToCommandeArticles,
  convertMenuCartItemsToCommandeMenus,
} from "@/utils/convertCartItemToCommandeItem";
import { createCommande } from "@/utils/apiCommandes";
import { toast } from "react-toastify";

// Helper Type Guard
function isArticleCartItem(
  item: ArticleCartItem | MenuCartItem
): item is ArticleCartItem {
  return "price" in item.item;
}

// Helper Function: Format duration
const formatSecondsToMinutes = (
  totalSeconds: number | null | undefined
): number | null => {
  if (totalSeconds === null || typeof totalSeconds === "undefined") {
    return null;
  }
  // Ensure duration isn't negative
  if (totalSeconds < 0) return 0;
  const totalMinutes = Math.floor(totalSeconds / 60);
  return totalMinutes;
};

// --- Fee Calculation Functions ---
const calculFraisService = (sousTotal: number): number => {
  // Example: 5% service fee, minimum 1€, maximum 5€
  const fee = sousTotal * 0.05;
  return Math.max(1, Math.min(fee, 5)); // Ensure fee is between 1 and 5
};

// Modified to accept duration in minutes
const calculDeliveryCost = (
  durationInMinutes: number | null, // Changed parameter
  baseDeliveryCosts: number
): number | null => {
  // Return null if cannot calculate
  if (durationInMinutes === null) {
    return null; // Cannot calculate without duration
  }
  // Example: base cost + 0.01€ per minute of travel
  const cost = baseDeliveryCosts + durationInMinutes * 0.01;
  return Math.max(baseDeliveryCosts, cost); // Ensure it's at least the base cost
};
// -----------------------------

const CheckoutPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const restaurantId = Number(id);
  const accessToken = useAuthStore((state) => state.accessToken);

  const [isCardFormValid, setIsCardFormValid] = useState(false);

  const handleCardFormValidityChange = useCallback((isValid: boolean) => {
    // console.log("Card form validity changed:", isValid); // Debugging log
    setIsCardFormValid(isValid);
  }, []); // Pas de dépendances, setIsCardFormValid est stable

  const {
    getTotalItemsByRestaurantId,
    getItemsByRestaurant,
    clearCartForRestaurant,
  } = useCartStore();

  const [showItems, setShowItems] = useState<boolean>(false);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);

  const restaurantItems = getItemsByRestaurant(restaurantId);

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoadingRestaurant, setIsLoadingRestaurant] = useState(true);

  const handlePayment = async () => {
    if (
      !restaurantId ||
      !accessToken ||
      !user?.id ||
      totalValue === null ||
      totalValue === undefined
    ) {
      console.error("Missing required data for payment.");
      return;
    }

    try {
      const restaurant = await getRestaurantById(restaurantId, accessToken);
      if (!restaurant) {
        console.error("Restaurant not found.");
        return;
      }

      const commandeArticles: CommandeArticle[] =
        convertArticleCartItemsToCommandeArticles(
          restaurantItems.filter((item) => isArticleCartItem(item))
        );
      const commandeMenus: CommandeMenu[] = convertMenuCartItemsToCommandeMenus(
        restaurantItems.filter(
          (item) => !isArticleCartItem(item)
        ) as MenuCartItem[]
      );

      const commande: Commande = {
        restaurant: restaurant,
        client: user,
        article: commandeArticles,
        menu: commandeMenus,
        prixTotal: totalValue,
        status: "PENDING",
        createdAt: new Date().toISOString(),
      };
      // Prepare order item

      const newOrder = await createCommande(commande, accessToken);

      console.log("Order created:", newOrder);

      clearCartForRestaurant(restaurantId);
      toast.success("Commande créée avec succès !");
      router.push("/home");
    } catch (error) {
      console.error("Failed to create order:", error);
      alert("Erreur lors de la création de la commande.");
    }
  };
  // user createCommande from apiCommande

  // Fetch Restaurant Data
  useEffect(() => {
    async function fetchRestaurant() {
      if (!restaurantId || !accessToken) return;
      setIsLoadingRestaurant(true);
      try {
        const fetchedRestaurant = await getRestaurantById(
          restaurantId,
          accessToken // Pass token if required by API
        );
        setRestaurant(fetchedRestaurant);
      } catch (error) {
        console.error("Failed to fetch restaurant for checkout:", error);
      } finally {
        setIsLoadingRestaurant(false);
      }
    }
    fetchRestaurant();
  }, [restaurantId, accessToken]);

  // Calculate Subtotal
  const sousTotal = useMemo(() => {
    return restaurantItems.reduce((acc, cartItem) => {
      const price = isArticleCartItem(cartItem)
        ? cartItem.item.price
        : cartItem.item.priceMenu;
      const itemTotal =
        (typeof price === "number" ? price : 0) * cartItem.quantity;
      return acc + itemTotal;
    }, 0);
  }, [restaurantItems]);

  // User/Coordinates/Address/Time Hooks
  const { user, loading: loadingUserData } = useMe(accessToken ?? "");
  const { coordinates, isLoading: isLoadingCoordinates } = useCoordinates(
    user?.address ?? "",
    user?.postalCode ?? "",
    user?.country ?? ""
  );
  const [newPosition, setNewPosition] = useState<Position | null>(null);
  useEffect(() => {
    if (coordinates && !newPosition) {
      setNewPosition(coordinates);
    }
  }, [coordinates, newPosition]);
  const lookupCoords = newPosition ?? coordinates;
  const { address, loading: loadingAddress } = useAddressFromCoordinates(
    lookupCoords?.latitude ?? null,
    lookupCoords?.longitude ?? null
  );
  const { duration, loading: loadingDuration } = useTravelTime(
    restaurant?.latitude ?? null,
    restaurant?.longitude ?? null,
    lookupCoords?.latitude ?? null,
    lookupCoords?.longitude ?? null
  );

  // Map Logic
  const handleMarkerDragEnd = useCallback((event: L.DragEndEvent) => {
    const newLatLng = event.target.getLatLng();
    setNewPosition({ latitude: newLatLng.lat, longitude: newLatLng.lng });
    // setUserChangedPosition(true); // This state seems unused, can remove if not needed elsewhere
  }, []);

  useEffect(() => {
    const displayCoords = newPosition ?? coordinates;
    if (displayCoords && mapRef.current) {
      const mapElement = mapRef.current;
      if (!leafletMapRef.current) {
        const map = L.map(mapElement).setView(
          [displayCoords.latitude, displayCoords.longitude],
          15
        );
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap",
        }).addTo(map);
        leafletMapRef.current = map;
        const customIcon = L.icon({
          iconUrl: "/map-pin.png",
          iconSize: [25, 30],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });
        markerRef.current = L.marker(
          [displayCoords.latitude, displayCoords.longitude],
          { icon: customIcon, draggable: true }
        ).addTo(map);
        markerRef.current.on("dragend", handleMarkerDragEnd);
      } else {
        // --- FIX: Use panTo ---
        leafletMapRef.current.panTo([
          displayCoords.latitude,
          displayCoords.longitude,
        ]);
        // --------------------
        markerRef.current?.setLatLng([
          displayCoords.latitude,
          displayCoords.longitude,
        ]);
      }
    }
    // Optional: Add cleanup logic if needed
    // return () => { leafletMapRef.current?.remove(); leafletMapRef.current = null; };
  }, [coordinates, newPosition, handleMarkerDragEnd]);

  // --- Combined Loading State ---
  // Include loading states relevant for fee calculation
  const isPriceDataLoading =
    isLoadingRestaurant || loadingDuration || isLoadingCoordinates;
  const isPageLoading = isPriceDataLoading || loadingUserData || loadingAddress; // Overall page loading

  // ----------------------------

  // --- Calculate Fees using Functions and Memoization ---
  const fraisServiceValue = useMemo(() => {
    return calculFraisService(sousTotal);
  }, [sousTotal]);

  const durationInMinutes = useMemo(() => {
    return formatSecondsToMinutes(duration);
  }, [duration]);

  const fraisLivraisonValue = useMemo(() => {
    // Use restaurant's base cost, or fallback to a default (e.g., 3.00€)
    const baseCost = restaurant?.delevryCost ?? 3.0;
    return calculDeliveryCost(durationInMinutes, baseCost);
    // Returns null if durationInMinutes is null
  }, [durationInMinutes, restaurant?.delevryCost]);

  const totalValue = useMemo(() => {
    // Only calculate total if all components are available
    if (fraisLivraisonValue === null) {
      return null; // Indicate total cannot be calculated yet
    }
    return sousTotal + fraisServiceValue + fraisLivraisonValue;
  }, [sousTotal, fraisServiceValue, fraisLivraisonValue]);
  // ----------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">


        {/* Restaurant Info Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          <div className="p-4 flex items-center">
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
              <h2 className="font-bold text-lg text-gray-900">
                {restaurant?.name ?? `Restaurant ${restaurantId}`}
              </h2>
              <p className="text-sm text-gray-500">
                {getTotalItemsByRestaurantId(restaurantId)} article
                {getTotalItemsByRestaurantId(restaurantId) > 1 ? "s" : ""} dans votre commande
              </p>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-gray-600" />
              Adresse de livraison
            </h3>
          </div>
          {isLoadingCoordinates || !lookupCoords ? (
            <div className="relative w-full h-48 flex flex-col justify-center items-center bg-gray-50">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
              <span className="text-gray-500 text-sm mt-2">
                Chargement de la carte...
              </span>
            </div>
          ) : (
            <div ref={mapRef} style={{ height: "200px", width: "100%" }} />
          )}
        </div>

        {/* Delivery Details */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <Truck className="h-5 w-5 mr-2 text-gray-600" />
              Détails de livraison
            </h3>
          </div>
          <div className="p-4 space-y-4">
            {/* Address */}
            <div className="flex items-start">
              <MapPin className="text-gray-500 h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Adresse de livraison</p>
                {loadingUserData ||
                isLoadingCoordinates ||
                loadingAddress ||
                !lookupCoords ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 text-gray-400 animate-spin mr-2" />
                    <p className="text-gray-500 text-sm">
                      Chargement de l&apos;adresse...
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-gray-900">
                      {address?.address ??
                        user?.address ??
                        "Adresse non disponible"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {address?.postalCode ?? user?.postalCode ?? ""}{" "}
                      {address?.city ?? user?.city ?? ""}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Phone */}
            <div className="flex items-start">
              <Phone className="text-gray-500 h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Téléphone</p>
                {loadingUserData ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 text-gray-400 animate-spin mr-2" />
                    <p className="text-gray-500 text-sm">Chargement...</p>
                  </div>
                ) : (
                  <p className="font-medium text-gray-900">
                    {user?.phoneNumber ?? "Non spécifié"}
                  </p>
                )}
              </div>
            </div>
            
            {/* Delivery Time */}
            <div className="flex items-start">
              <Clock className="text-gray-500 h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Délai de livraison</p>
                {loadingDuration ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 text-gray-400 animate-spin mr-2" />
                    <p className="text-gray-500 text-sm">Calcul en cours...</p>
                  </div>
                ) : duration === null ? (
                  <p className="text-sm text-gray-500">Non disponible</p>
                ) : (
                  (() => {
                    const prepTimeMinutes = 10;
                    const deliveryMinutes = durationInMinutes;
                    if (deliveryMinutes === null)
                      return (
                        <p className="text-sm text-red-500">Erreur de calcul</p>
                      );
                    const estimatedMin = prepTimeMinutes + deliveryMinutes;
                    const estimatedMax = estimatedMin + 20;
                    return (
                      <p className="text-sm font-medium text-gray-900">
                        {estimatedMin} - {estimatedMax} minutes
                      </p>
                    );
                  })()
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <Receipt className="h-5 w-5 mr-2 text-gray-600" />
              Récapitulatif de la commande
            </h3>
          </div>
          <div className="p-4">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowItems(!showItems)}
            >
              <div className="flex items-center">
                <ShoppingBag className="h-5 w-5 text-gray-500 mr-2" />
                <span className="font-medium text-gray-700">
                  {getTotalItemsByRestaurantId(restaurantId)} article
                  {getTotalItemsByRestaurantId(restaurantId) > 1 ? "s" : ""}
                </span>
              </div>
              {showItems ? <ChevronDown className="h-5 w-5 text-gray-500" /> : <ChevronRight className="h-5 w-5 text-gray-500" />}
            </div>
            
            {showItems && (
              <div className="mt-3 space-y-2 border-t pt-3">
                {restaurantItems.map((cartItem) => {
                  const isArticle = isArticleCartItem(cartItem);
                  const item = cartItem.item;
                  const id = item.id;
                  const name = item.name;
                  const price = isArticle
                    ? (item as Article).price
                    : (item as Menu).priceMenu;
                  const type = isArticle ? "article" : "menu";
                  if (typeof id === "undefined") return null;
                  return (
                    <div
                      key={`${type}-${id}`}
                      className="flex justify-between py-1 text-sm"
                    >
                      <span className="font-medium text-gray-800">
                        {cartItem.quantity} x {name}
                      </span>
                      <span className="text-gray-600">
                        {(
                          (typeof price === "number" ? price : 0) *
                          cartItem.quantity
                        ).toFixed(2)}{" "}
                        €
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
              Détails du paiement
            </h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sous-total</span>
              <span className="font-medium">{sousTotal.toFixed(2)} €</span>
            </div>

            {/* Service Fee */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Frais de service</span>
              <span className="font-medium">{fraisServiceValue.toFixed(2)} €</span>
            </div>

            {/* Delivery Fee */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Frais de livraison</span>
              <span className="font-medium">
                {isPriceDataLoading || fraisLivraisonValue === null ? (
                  <div className="flex items-center">
                    <Loader2 className="h-3 w-3 text-gray-400 animate-spin mr-1" />
                    <span className="text-gray-500">Calcul en cours...</span>
                  </div>
                ) : (
                  `${fraisLivraisonValue.toFixed(2)} €`
                )}
              </span>
            </div>

            {/* Total */}
            <div className="flex justify-between font-semibold text-base pt-3 border-t mt-2">
              <span>Total</span>
              <span>
                {isPriceDataLoading || totalValue === null ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 text-gray-400 animate-spin mr-1" />
                    <span className="text-gray-500">Calcul en cours...</span>
                  </div>
                ) : (
                  `${totalValue.toFixed(2)} €`
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
              Informations de paiement
            </h3>
          </div>
          <div className="p-4">
            <CreditCardForm onValidityChange={handleCardFormValidityChange} />
          </div>
        </div>

        {/* Payment Button */}
        <div className="mt-6">
          <button
            className="w-full bg-black cursor-pointer text-white rounded-xl py-4 font-medium hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={
              isPageLoading || // Désactivé si la page charge encore
              restaurantItems.length === 0 || // Désactivé si le panier est vide
              totalValue === null || // Désactivé si le total n'est pas calculé
              !isCardFormValid // Désactivé si le formulaire de carte n'est pas valide
            }
            onClick={() => {
              if (isCardFormValid) {
                handlePayment(); // Appeler la fonction de paiement si le formulaire est valide
              } else {
                toast.error("Veuillez remplir correctement les informations de paiement.");
              }
            }}
          >
            {isPriceDataLoading || totalValue === null ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Calcul des frais...
              </>
            ) : !isCardFormValid ? (
              <>
                <AlertCircle className="h-5 w-5 mr-2" />
                Complétez les informations de paiement
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Payer {totalValue.toFixed(2)} €
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

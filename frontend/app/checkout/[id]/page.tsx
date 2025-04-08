"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
// Import specific types and functions from store
import { useCartStore, ArticleCartItem, MenuCartItem } from "@/store/cartStore";
import {
  ChevronRight,
  ChevronDown,
  MapPin,
  Phone,
  Tag,
  Clock,
} from "lucide-react";
// Import useMemo
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useAuthStore } from "@/store/authStore";
import useCoordinates from "@/hooks/useCoordinates";
import "leaflet/dist/leaflet.css";
import L, { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import useAddressFromCoordinates from "@/hooks/useAddressFromCoordinates";
import { Position } from "@/types/Position";
import LoadingSpinner from "@/components/helper-components/LoadingSpinner";
import useTravelTime from "@/hooks/useTravelTime";
import { getRestaurantById } from "@/utils/apiRestaurant";
import { Restaurant } from "@/types/Restaurants";
import { useMe } from "@/hooks/useMe";
import { Article } from "@/types/Articles";
import { Menu } from "@/types/Menu";
import CreditCardForm from "@/components/creditCartForm";

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
  const { id } = useParams();
  const restaurantId = Number(id);
  const accessToken = useAuthStore((state) => state.accessToken);

  const [isCardFormValid, setIsCardFormValid] = useState(false);

  const handleCardFormValidityChange = useCallback((isValid: boolean) => {
    // console.log("Card form validity changed:", isValid); // Debugging log
    setIsCardFormValid(isValid);
  }, []); // Pas de dépendances, setIsCardFormValid est stable

  const { getTotalItemsByRestaurantId, getItemsByRestaurant } = useCartStore();

  const [showItems, setShowItems] = useState<boolean>(false);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);

  const restaurantItems = getItemsByRestaurant(restaurantId);

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoadingRestaurant, setIsLoadingRestaurant] = useState(true);

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
    <div className="max-w-lg mx-auto px-4 py-8 bg-gray-50">
      <h1 className="font-semibold text-xl mb-6">Paiement</h1>

      {/* Map Section */}
      <div className="rounded-lg overflow-hidden shadow-md mb-6">
        {isLoadingCoordinates || !lookupCoords ? (
          <div className="relative w-full h-48 flex flex-col justify-center items-center bg-gray-100">
            <LoadingSpinner />{" "}
            <span className="text-gray-500 italic text-sm mt-2">
              Chargement de la carte...
            </span>
          </div>
        ) : (
          <div ref={mapRef} style={{ height: "200px", width: "100%" }} />
        )}
      </div>

      {/* Delivery Details */}
      <div className="bg-white rounded-xl shadow p-4 space-y-4 mb-6">
        {/* Address, Phone, Delivery Time sections remain the same as previous version */}
        {/* Address */}
        <div className="flex items-center justify-between">
          {" "}
          <MapPin className="text-gray-500 flex-shrink-0" />{" "}
          <div className="flex-1 ml-3 min-w-0">
            {" "}
            {loadingUserData ||
            isLoadingCoordinates ||
            loadingAddress ||
            !lookupCoords ? (
              <p className="text-gray-500 italic text-sm">
                Chargement de l&apos;adresse...
              </p>
            ) : (
              <div>
                {" "}
                <p className="font-semibold truncate">
                  {address?.address ??
                    user?.address ??
                    "Adresse non disponible"}
                </p>{" "}
                <p className="text-sm text-gray-400 truncate">
                  {address?.postalCode ?? user?.postalCode ?? ""}{" "}
                  {address?.city ?? user?.city ?? ""}
                </p>{" "}
              </div>
            )}{" "}
          </div>{" "}
          <ChevronRight className="text-gray-400 flex-shrink-0" />{" "}
        </div>
        {/* Phone */}
        <div className="flex items-center justify-between">
          {" "}
          <Phone className="text-gray-500 flex-shrink-0" />{" "}
          <div className="flex-1 ml-3 min-w-0">
            {" "}
            {loadingUserData ? (
              <p className="text-gray-500 italic text-sm">Chargement...</p>
            ) : (
              <p className="font-semibold truncate">
                {user?.phoneNumber ?? "Non spécifié"}
              </p>
            )}{" "}
          </div>{" "}
          <ChevronRight className="text-gray-400 flex-shrink-0" />{" "}
        </div>
        {/* Delivery Time */}
        <div className="flex items-center justify-between">
          {" "}
          <Clock className="text-gray-500 flex-shrink-0" />{" "}
          <div className="flex-1 ml-3 min-w-0">
            {" "}
            <p className="font-semibold">Délai de livraison</p>{" "}
            {loadingDuration ? (
              <p className="text-gray-500 italic text-sm">Calcul en cours...</p>
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
                  <p className="text-sm truncate">
                    {estimatedMin} - {estimatedMax} minutes
                  </p>
                );
              })()
            )}{" "}
          </div>{" "}
          <div className="border rounded-lg px-2 py-1 text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 flex-shrink-0">
            Planifier
          </div>{" "}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-xl shadow p-4 mt-4 mb-6">
        <div
          className="flex items-center justify-between mb-2 cursor-pointer"
          onClick={() => setShowItems(!showItems)}
        >
          <div className="flex items-center">
            {" "}
            <Image
              src={restaurant?.imagePath ?? "/burger.png"}
              width={40}
              height={40}
              alt={restaurant?.name || "Restaurant"}
              className="rounded-full object-cover"
            />{" "}
            <div className="ml-3">
              {" "}
              <h2 className="font-semibold">
                {restaurant?.name ?? "Votre commande"}
              </h2>{" "}
              <p className="text-sm text-gray-500">
                {getTotalItemsByRestaurantId(restaurantId)} article
                {getTotalItemsByRestaurantId(restaurantId) > 1 ? "s" : ""}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          {showItems ? <ChevronDown /> : <ChevronRight />}
        </div>
        {showItems && (
          <div className="border-t pt-2 mt-2">
            {" "}
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
                  {" "}
                  <span className="font-medium text-gray-800 mr-2">
                    {cartItem.quantity} x {name}
                  </span>{" "}
                  <span className="text-gray-600">
                    {(
                      (typeof price === "number" ? price : 0) *
                      cartItem.quantity
                    ).toFixed(2)}{" "}
                    €
                  </span>{" "}
                </div>
              );
            })}{" "}
          </div>
        )}
        <div className="flex items-center justify-between py-2 border-t mt-2 cursor-pointer">
          {" "}
          <Tag className="text-gray-500" />{" "}
          <p className="flex-1 ml-3 font-semibold text-sm">
            Ajouter une promotion
          </p>{" "}
          <ChevronRight className="text-gray-400" />{" "}
        </div>
      </div>

      {/* --- Price Breakdown with Loading State --- */}
      <div className="bg-white rounded-xl shadow p-4 mt-4 text-sm space-y-1">
        <div className="flex justify-between">
          <span>Sous-total</span>
          <span>{sousTotal.toFixed(2)} €</span>
        </div>

        {/* Service Fee */}
        <div className="flex justify-between text-gray-500">
          <span>Frais de service</span>
          <span>
            {/* No specific loading needed if sousTotal is always available */}
            {fraisServiceValue.toFixed(2)} €
          </span>
        </div>

        {/* Delivery Fee */}
        <div className="flex justify-between text-gray-500">
          <span>Frais de livraison</span>
          <span>
            {/* Show loading if duration or restaurant data is loading */}
            {isPriceDataLoading || fraisLivraisonValue === null ? (
              <span className="italic">Calcul en cours...</span>
            ) : (
              `${fraisLivraisonValue.toFixed(2)} €`
            )}
          </span>
        </div>

        {/* Total */}
        <div className="flex justify-between font-semibold text-base mt-2 pt-2 border-t">
          <span>Total</span>
          <span>
            {/* Show loading if price data is loading or total couldn't be calculated */}
            {isPriceDataLoading || totalValue === null ? (
              <span className="italic">Calcul en cours...</span>
            ) : (
              `${totalValue.toFixed(2)} €`
            )}
          </span>
        </div>
      </div>
      {/* ---------------------------------------- */}
      <CreditCardForm onValidityChange={handleCardFormValidityChange} />

      {/* --- Payment Button with Loading State --- */}
      <div className="mt-6">
        <button
          className="w-full bg-black text-white rounded-lg py-3 font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          // --- Mettre à jour la condition disabled ---
          disabled={
            isPageLoading || // Désactivé si la page charge encore
            restaurantItems.length === 0 || // Désactivé si le panier est vide
            totalValue === null || // Désactivé si le total n'est pas calculé
            !isCardFormValid // <<<< Désactivé si le formulaire de carte n'est pas valide
          }
          // --- Ajouter un onClick pour la logique de paiement réelle (à implémenter) ---
          onClick={() => {
            console.log("Déclencher le paiement RÉEL ici !");
            // Mettez ici votre logique pour appeler une API de paiement
            // avec les détails de la commande et potentiellement les infos
            // de carte (même si le formulaire est fake, on simule le déclenchement)
            alert("Logique de paiement à implémenter !");
          }}
          // --------------------------------------------------------------------------
        >
          {isPriceDataLoading || totalValue === null
            ? "Calcul des frais..."
            : // Indique si le formulaire de carte est le bloqueur
            !isCardFormValid
            ? "Complétez les informations de paiement"
            : `Payer ${totalValue.toFixed(2)} €`}
        </button>
      </div>
      {/* --------------------------------------- */}
    </div>
  );
};

export default CheckoutPage;

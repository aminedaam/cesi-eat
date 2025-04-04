"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import {
  ChevronRight,
  ChevronDown,
  MapPin,
  Phone,
  Tag,
  Clock,
} from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { getMe } from "@/utils/apiUser";
import useCoordinates from "@/hooks/useCoordinates";
import "leaflet/dist/leaflet.css";
import L, { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import useAddressFromCoordinates from "@/hooks/useAddressFromCoordinates";
import { Position } from "@/types/Position"; // Assuming Position has { lgit atitude: number; longitude: number }
import LoadingSpinner from "@/components/helper-components/LoadingSpinner";
import useTravelTime from "@/hooks/useTravelTime";
import { getRestaurantById } from "@/utils/apiRestaurant";
import { Restaurant } from "@/types/Restaurants";

const formatSecondsToMinutes = (totalSeconds: number): number | null => {
  if (totalSeconds === null || totalSeconds === undefined) {
    return null;
  }
  const totalMinutes = Math.floor(totalSeconds / 60);
  return totalMinutes;
};

const CheckoutPage = () => {
  const { id } = useParams();
  const { items, getTotalItemsByRestaurantId } = useCartStore();
  const [showItems, setShowItems] = useState<boolean>(false);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const [loadingUserData, setLoadingUserData] = useState<boolean>(true);

  const restaurantItems = items.filter(
    (item) => item.article.restaurantId === Number(id)
  );

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

  const sousTotal = restaurantItems.reduce(
    (acc, item) => acc + item.article.price * item.quantity,
    0
  );

  const accessToken = useAuthStore((state) => state.accessToken);
  const [userAddress, setuserAddress] = useState<string>("");
  const [userPostalCode, setuserPostalCode] = useState<string>("");
  const [userCity, setuserCity] = useState<string>("");
  const [userCountry, setuserCountry] = useState<string>("");
  const [userPhone, setuserPhone] = useState<string>("");

  const { coordinates, isLoading: isLoadingCoordinates } = useCoordinates(
    userAddress,
    userPostalCode,
    userCountry
  );

  const [newPosition, setNewPosition] = useState<Position | null>(coordinates);
  const [userChangedPosition, setUserChangedPosition] =
    useState<boolean>(false);

  const { address } = useAddressFromCoordinates(
    newPosition?.latitude ?? null,
    newPosition?.longitude ?? null
  );

  const { duration, loading: loadingDuration } = useTravelTime(
    restaurant?.latitude ?? null,
    restaurant?.longitude ?? null,
    newPosition?.latitude ?? coordinates?.latitude ?? null,
    newPosition?.longitude ?? coordinates?.longitude ?? null
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoadingUserData(true);
      try {
        if (!accessToken) return;
        const response = await getMe(accessToken!);
        setuserAddress(response.address);
        setuserPostalCode(response.postalCode);
        setuserCity(response.city);
        setuserCountry(response.country);
        setuserPhone(response.phoneNumber);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Optionally set an error state for user data
      } finally {
        setLoadingUserData(false);
      }
    };
    fetchData();
  }, [accessToken]);

  const handleMarkerDragEnd = useCallback((event: L.DragEndEvent) => {
    const newLatLng = event.target.getLatLng();
    const newPositionData = {
      latitude: newLatLng.lat,
      longitude: newLatLng.lng,
    };
    setNewPosition(newPositionData);
    setUserChangedPosition(true);
    console.log("Nouvelle position du marqueur :", newLatLng);
  }, []);

  useEffect(() => {
    if (coordinates) {
      if (!leafletMapRef.current) {
        if (!mapRef.current) return;
        const map = L.map(mapRef.current as HTMLElement).setView(
          [coordinates?.latitude || 0, coordinates?.longitude || 0],
          15
        ) as LeafletMap;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        const customIcon = L.icon({
          iconUrl: "/map-pin.png",
          iconSize: [25, 30],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
          shadowAnchor: [12, 41],
        });

        markerRef.current = L.marker(
          [coordinates.latitude, coordinates.longitude],
          {
            icon: customIcon,
            draggable: true, // Make the marker draggable if you want to allow modification
          }
        ).addTo(map);

        // Optional: Handle marker dragend event to update the location
        markerRef.current.on("dragend", handleMarkerDragEnd);
        leafletMapRef.current = map;
      } else {
        // If the map already exists, just update the marker's position
        markerRef.current?.setLatLng([
          coordinates.latitude,
          coordinates.longitude,
        ]);
      }
      if (coordinates && leafletMapRef.current) {
        leafletMapRef.current.setView(
          [coordinates?.latitude || 0, coordinates?.longitude || 0],
          15
        );
      }
    }
  }, [coordinates, userAddress, userCity, userPostalCode]);

  const fraisService: number = 1.67;
  const fraisLivraison: number = 5.49;
  const total: number = sousTotal + fraisService + fraisLivraison;

  return (
    <div className="max-w-lg mx-auto px-4 bg-gray-50">
      <h1 className="font-semibold text-xl mb-4">Paiement</h1>

      <div className="rounded-lg overflow-hidden shadow-md mb-4">
        {loadingUserData || isLoadingCoordinates ? (
          <div className="relative w-full h-40 flex flex-col justify-center items-center">
            <LoadingSpinner />
            <span className="text-gray-500 italic text-sm">
              Chargement de la carte...
            </span>
          </div>
        ) : (
          <div ref={mapRef} style={{ height: "200px" }}>
            {/* Leaflet map will be rendered here */}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-4 space-y-4">
        <div className="flex items-center justify-between">
          <MapPin className="text-gray-500" />
          <div className="flex-1 ml-2">
            {loadingUserData || isLoadingCoordinates ? (
              <p className="text-gray-500 italic text-sm">
                Chargement de l&apos;adresse...
              </p>
            ) : !userChangedPosition && address ? (
              <div>
                <p className="font-semibold">{userAddress}</p>
                <p className="text-sm text-gray-400">
                  {userPostalCode} {userCity}
                </p>
              </div>
            ) : (
              <div>
                <p className="font-semibold">{address.address}</p>
                <p className="text-sm text-gray-400">
                  {address.postalCode} {address.city}
                </p>
              </div>
            )}
          </div>
          <ChevronRight className="text-gray-400" />
        </div>

        <div className="flex items-center justify-between">
          <Phone className="text-gray-500" />
          <div className="flex-1 ml-2">
            {loadingUserData ? (
              <p className="text-gray-500 italic text-sm">Chargement...</p>
            ) : (
              <p className="font-semibold">{userPhone}</p>
            )}
          </div>
          <ChevronRight className="text-gray-400" />
        </div>

        <div className="flex items-center justify-between">
          <Clock className="text-gray-500" />
          <div className="flex-1 ml-2">
            <p className="font-semibold">Délai de livraison</p>
            {loadingDuration || !duration ? (
              <p className="text-gray-500 italic text-sm">Chargement...</p>
            ) : (
              <p className="text-sm">
                {formatSecondsToMinutes(duration!)!} -{" "}
                {formatSecondsToMinutes(duration!)! + 15} minutes
              </p>
            )}
          </div>
          <div className="border rounded-lg px-2 py-1 font-semibold">
            Planifier
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mt-4">
        <div
          className="flex items-center justify-between mb-2 cursor-pointer"
          onClick={() => setShowItems(!showItems)}
        >
          <div className="flex items-center">
            <Image
              src="/burger.png"
              width={40}
              height={40}
              alt={restaurant?.name || "Restaurant"}
              className="rounded-full"
            />
            <div className="ml-2">
              <h2 className="font-semibold">{restaurant?.name}</h2>
              <p className="text-sm">
                {getTotalItemsByRestaurantId(restaurantId)} plat(s)
              </p>
            </div>
          </div>
          {showItems ? <ChevronDown /> : <ChevronRight />}
        </div>

        {showItems && (
          <div className="border-t pt-2">
            {restaurantItems.map((item) => (
              <div key={item.article.id} className="flex justify-between py-1">
                <span className="font-semibold">
                  {item.quantity} {item.article.name}
                </span>
                <span>{(item.article.price * item.quantity).toFixed(2)} €</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between py-2">
          <Tag className="text-gray-500" />
          <p className="flex-1 ml-2 font-semibold">Ajoutez une promotion</p>
          <ChevronRight className="text-gray-400" />
        </div>
      </div>

      <div className="border-t pt-2 text-sm">
        <div className="flex justify-between">
          <span>Sous-total</span>
          <span>{sousTotal.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Service</span>
          <span>{fraisService.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Livraison</span>
          <span>{fraisLivraison.toFixed(2)} €</span>
        </div>

        <div className="flex justify-between font-semibold mt-2">
          <span>Total</span>
          <span>{total.toFixed(2)} €</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

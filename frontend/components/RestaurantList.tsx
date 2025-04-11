"use client";

import { Restaurant } from "@/types/Restaurants";
import { useEffect, useState, useRef, useMemo } from "react";
import LoadingSpinner from "./helper-components/LoadingSpinner";
import { useLocation } from "@/context/locationContext";
import { orderRestaurantsByDistance } from "@/utils/orderRestaurantsByDistance";
import { RestaurantItem } from "./RestaurantItem";
import { toast } from "react-toastify";
import { getAllRestaurants } from "@/utils/apiRestaurant";

interface RestaurantListProps {
  filter: string;
}

// Module-level cache for restaurant distances based on location
// Keys are strings like "latitude-longitude"
const restaurantDistanceCache: Record<string, Restaurant[]> = {};

// Constant for the location timeout duration
const LOCATION_TIMEOUT_MS = 5000;

export const RestaurantList: React.FC<RestaurantListProps> = ({ filter }) => {
  // --- State Definitions ---

  console.log("RestaurantList component rendered");

  // Raw restaurant data fetched from API
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  // State to track if fetching initial restaurants failed
  const [fetchError, setFetchError] = useState<string | null>(null);
  // State for the list of restaurants to be displayed (potentially sorted)
  const [processedRestaurants, setProcessedRestaurants] = useState<
    Restaurant[]
  >([]);
  // Flag indicating if location fetching has timed out
  const [locationTimedOut, setLocationTimedOut] = useState(false);

  const [loadForRestaurants, setLoadForRestaurants] = useState(false);

  // --- Hooks ---

  // Get location data, loading status, and error from context
  const {
    location,
    loading: locationLoading,
    error: locationError,
  } = useLocation();

  // Refs for managing timeouts and preventing duplicate toasts
  const locationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const locationToastShownRef = useRef(false);

  // --- Effects ---

  // Effect 1: Fetch all restaurants on initial component mount
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted component

    const fetchRestaurants = async () => {
      try {
        setLoadForRestaurants(true);
        const fetchedRestaurants = await getAllRestaurants();
        if (isMounted) {
          console.log(
            "Données des restaurants récupérées:",
            fetchedRestaurants
          );
          setRestaurants(fetchedRestaurants);
          setLoadForRestaurants(false);
          // Initialize processed restaurants with the fetched list (default order)
          setProcessedRestaurants(fetchedRestaurants);
          setFetchError(null); // Clear any previous fetch error
        }
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
        if (isMounted) {
          const errorMessage =
            "Erreur lors de la récupération des restaurants.";
          setFetchError(errorMessage);
          toast.error(
            "Une erreur s'est produite lors de la récupération des restaurants."
          );
          setRestaurants([]); // Ensure restaurants list is empty on error
          setProcessedRestaurants([]);
        }
      }
    };

    fetchRestaurants();

    // Cleanup function to set the mounted flag to false when component unmounts
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // Effect 2: Manage the location timeout logic
  useEffect(() => {
    // If location is still loading and hasn't timed out yet
    if (locationLoading && !location && !locationError && !locationTimedOut) {
      // Clear any existing timeout before setting a new one
      if (locationTimeoutRef.current) clearTimeout(locationTimeoutRef.current);

      locationTimeoutRef.current = setTimeout(() => {
        // Check again inside the timeout if location is still missing
        if (!location) {
          setLocationTimedOut(true);
          if (!locationToastShownRef.current) {
            toast.info(
              "Impossible de récupérer votre position après 5 secondes. Les restaurants seront affichés par défaut."
            );
            locationToastShownRef.current = true;
          }
        }
      }, LOCATION_TIMEOUT_MS);
    }

    // If location is found, an error occurred, or timeout happened, clear the timeout
    if (location || locationError || locationTimedOut) {
      if (locationTimeoutRef.current) {
        clearTimeout(locationTimeoutRef.current);
        locationTimeoutRef.current = null;
      }
      // Reset timeout flag if location arrives *after* timeout was set
      // This might happen if timeout triggers, then location resolves immediately after
      if (locationTimedOut && location) {
        setLocationTimedOut(false);
        // If the toast was shown due to timeout, maybe show a success/info toast? Optional.
        // toast.info("Position récupérée, affichage par distance activé.");
        locationToastShownRef.current = false; // Allow timeout toast again if location is lost later
      }
    }

    // Cleanup: Clear timeout if component unmounts while timeout is pending
    return () => {
      if (locationTimeoutRef.current) {
        clearTimeout(locationTimeoutRef.current);
      }
    };
  }, [location, locationLoading, locationError, locationTimedOut]); // Dependencies for managing the timeout lifecycle

  // Effect 3: Process restaurants (sort by distance if location is available)
  useEffect(() => {
    // Only process if we have restaurants and location isn't loading anymore (or timed out)
    if (restaurants.length === 0 || locationLoading) {
      // If still loading location (and not timed out), keep the current processed list
      // If restaurants aren't loaded yet, processedRestaurants is already []
      // If location timed out or errored, we'll handle it below
      if (!locationTimedOut && !locationError) return;
    }

    // Determine if we should use distance sorting
    const canSortByDistance = location && !locationTimedOut && !locationError;

    if (canSortByDistance) {
      console.log("Tri par distance activé:", location);
      const cacheKey = `${location.latitude}-${location.longitude}`;
      console.log("Cache key:", cacheKey);

      if (restaurantDistanceCache[cacheKey]) {
        // Use cached sorted list
        setProcessedRestaurants(restaurantDistanceCache[cacheKey]);
      } else {
        // Need to sort: perform async operation
        let isMounted = true;
        const sortRestaurants = async () => {
          try {
            console.log("Calcul des distances pour:", location);
            const ordered = await orderRestaurantsByDistance(
              [...restaurants], // Pass a copy to avoid potential mutation issues
              location
            );
            if (isMounted) {
              restaurantDistanceCache[cacheKey] = ordered; // Update cache
              setProcessedRestaurants(ordered);
            }
          } catch (error) {
            console.error("Erreur lors du calcul des distances:", error);
            if (isMounted) {
              toast.info(
                "Impossible de calculer les distances. Affichage par défaut."
              );
              // Fallback to the default (unsorted) list on error
              setProcessedRestaurants(restaurants);
            }
          }
        };
        sortRestaurants();

        // Cleanup for the async operation
        return () => {
          isMounted = false;
        };
      }
    } else {
      // Cannot sort by distance (no location, timeout, error, or still loading restaurants)
      // Use the default fetched order
      console.log("Utilisation de l'ordre par défaut des restaurants.");
      setProcessedRestaurants(restaurants);
    }
  }, [restaurants, location, locationTimedOut, locationError, locationLoading]); // Re-run when these change

  // --- Memoization ---

  // Memoize the filtering logic based on the processed list and filter prop
  const filteredRestaurants = useMemo(() => {
    if (!filter) {
      return processedRestaurants; // No filter applied, return the whole processed list
    }
    const lowerCaseFilter = filter.toLowerCase();
    return processedRestaurants.filter((item) =>
      item.name.toLowerCase().includes(lowerCaseFilter)
    );
  }, [processedRestaurants, filter]); // Recalculate only when processed list or filter changes

  // --- Render Logic ---

  // Condition 1: Loading location (initial phase, before timeout)
  if (locationLoading && !locationTimedOut && !locationError) {
    return (
      <div className="w-full flex flex-col items-center">
        <LoadingSpinner />
        <p>Localisation en cours...</p>
      </div>
    );
  }

  // Condition 2: Error fetching initial restaurants
  if (fetchError) {
    return <p>{fetchError}</p>;
  }

  if (loadForRestaurants) {
    return (
      <div className="w-full flex flex-col items-center">
        <LoadingSpinner />
        <p>Chargement des restaurants...</p>
      </div>
    );
  }

  // Condition 3: Location error occurred (but we might still show default list)
  // The toast/console logs handle informing the user. We proceed to show the default list.
  // If locationError is critical and *no* restaurants should be shown, add that logic here.
  // Currently, locationError leads to using the default restaurant list order.

  // Condition 4: No restaurants found (either fetch returned none, or filter cleared them all)
  if (restaurants.length > 0 && filteredRestaurants.length === 0) {
    return (
      <div className="w-full p-4 text-center">
        <p className="text-gray-600 text-lg">
          Aucun restaurant ne correspond à votre filtre.
        </p>
      </div>
    );
  }

  // Condition 5: No restaurants fetched initially (and not due to a fetch error already handled)
  // This handles the case where getAllRestaurants() successfully returns an empty array.
  if (restaurants && restaurants.length === 0) {
    console.log("Aucun restaurant trouvé dans la liste initiale.");
    console.log(restaurants);
    return <p>Aucun restaurant disponible pour le moment.</p>;
  }

  // Main render: Grid of restaurants
  return (
    <div className="w-full px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <RestaurantItem
              restaurant={restaurant}
              distance={restaurant.distanceFromUser}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

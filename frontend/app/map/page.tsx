"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useMe } from "@/hooks/useMe";
import BaseHeader from "@/components/header_footers/BaseHeader";
import LoadingSpinner from "@/components/helper-components/LoadingSpinner";
import useCoordinates from "@/hooks/useCoordinates";
import { Position } from "@/types/Position";
import { MapPin, Search, Navigation, ChevronDown, ChevronUp } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLocation } from "@/context/locationContext";

// Style CSS pour réduire le z-index de la carte Leaflet
const mapStyle = `
  .leaflet-container {
    z-index: 1 !important;
  }
  .leaflet-control-container {
    z-index: 1 !important;
  }
  .leaflet-popup {
    z-index: 1 !important;
  }
  .leaflet-tooltip {
    z-index: 1 !important;
  }
`;

const MapPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { user, loading, error } = useMe(accessToken ?? "");
  const [searchAddress, setSearchAddress] = useState("");
  const [searchPostalCode, setSearchPostalCode] = useState("");
  const [searchCountry, setSearchCountry] = useState("France");
  const [userPosition, setUserPosition] = useState<Position | null>(null);
  const [searchPosition, setSearchPosition] = useState<Position | null>(null);
  const [isLoadingUserPosition, setIsLoadingUserPosition] = useState(true);
  const [userPositionError, setUserPositionError] = useState<string | null>(null);
  const [route, setRoute] = useState<L.Polyline | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [routeDuration, setRouteDuration] = useState<number | null>(null);
  const [autoTrace, setAutoTrace] = useState(false);
  const [isSearchFormOpen, setIsSearchFormOpen] = useState(true);
  
  // Utilisation du contexte de localisation
  const { location: contextLocation, loading: contextLoading, error: contextError } = useLocation();
  
  // Références pour la carte Leaflet
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const searchMarkerRef = useRef<L.Marker | null>(null);
  
  // Utilisation du hook useCoordinates pour la recherche d'adresse
  const { 
    coordinates: searchCoordinates, 
    error: searchError, 
    isLoading: isSearching 
  } = useCoordinates(searchAddress, searchPostalCode, searchCountry);

  // Vérification de l'authentification et du rôle
  useEffect(() => {
    if (!accessToken) {
      router.push("/");
      return;
    }

    if (user && user.role !== "LIVREUR") {
      router.push("/home");
      return;
    }
  }, [accessToken, user, router]);

  // Récupération des coordonnées depuis les paramètres d'URL
  useEffect(() => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const auto = searchParams.get('auto');
    
    if (lat && lng) {
      const position: Position = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng)
      };
      
      setSearchPosition(position);
      
      // Si le paramètre auto est présent, on active le traçage automatique
      if (auto === 'true') {
        setAutoTrace(true);
      }
      
      // Fermer le formulaire de recherche si des coordonnées sont fournies
      setIsSearchFormOpen(false);
    }
  }, [searchParams]);

  // Utilisation du contexte de localisation en premier
  useEffect(() => {
    if (contextLocation && !contextLoading && !contextError) {
      console.log("Utilisation de la position du contexte de localisation");
      setUserPosition(contextLocation);
      setIsLoadingUserPosition(false);
      setUserPositionError(null);
    } else if (!contextLocation && !contextLoading) {
      // Si le contexte n'a pas de position, essayer la géolocalisation directe
      getCurrentPosition();
    }
  }, [contextLocation, contextLoading, contextError]);

  // Fonction pour récupérer la position via la géolocalisation
  const getCurrentPosition = () => {
    if (!navigator.geolocation) {
      setUserPositionError("La géolocalisation n'est pas supportée par votre navigateur.");
      setIsLoadingUserPosition(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setIsLoadingUserPosition(false);
      },
      (error) => {
        console.error("Erreur de géolocalisation:", error);
        setUserPositionError("Impossible de récupérer votre position. Veuillez vérifier les paramètres de géolocalisation.");
        setIsLoadingUserPosition(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Mise à jour de la position de recherche lorsque les coordonnées changent
  useEffect(() => {
    if (searchCoordinates) {
      setSearchPosition(searchCoordinates);
    }
  }, [searchCoordinates]);

  // Gestion de la carte Leaflet
  useEffect(() => {
    // Initialisation de la carte si elle n'existe pas encore
    if (mapRef.current && !leafletMapRef.current) {
      // Utiliser la position de l'utilisateur ou une position par défaut
      const defaultPosition = userPosition || { latitude: 48.8566, longitude: 2.3522 }; // Paris par défaut
      
      const map = L.map(mapRef.current).setView(
        [defaultPosition.latitude, defaultPosition.longitude],
        13
      );
      
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
      }).addTo(map);
      
      leafletMapRef.current = map;
      
      // Créer l'icône personnalisée pour le marqueur de l'utilisateur (bleu)
      const userIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      
      // Ajouter le marqueur de l'utilisateur
      userMarkerRef.current = L.marker(
        [defaultPosition.latitude, defaultPosition.longitude],
        { icon: userIcon }
      ).addTo(map);
      
      userMarkerRef.current.bindPopup("Votre position").openPopup();
    }
    
    // Nettoyage lors du démontage du composant
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [userPosition]);

  // Mise à jour de la carte lorsque la position de l'utilisateur change
  useEffect(() => {
    if (userPosition && leafletMapRef.current && userMarkerRef.current) {
      leafletMapRef.current.setView([userPosition.latitude, userPosition.longitude], 13);
      userMarkerRef.current.setLatLng([userPosition.latitude, userPosition.longitude]);
      userMarkerRef.current.bindPopup("Votre position").openPopup();
    }
  }, [userPosition]);

  // Mise à jour de la carte lorsque la position de recherche change
  useEffect(() => {
    if (searchPosition && leafletMapRef.current) {
      // Déplacer la carte vers la position recherchée
      leafletMapRef.current.setView([searchPosition.latitude, searchPosition.longitude], 15);
      
      // Supprimer l'ancien marqueur de recherche s'il existe
      if (searchMarkerRef.current) {
        searchMarkerRef.current.remove();
      }
      
      // Créer l'icône personnalisée pour le marqueur de recherche (rouge)
      const searchIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      
      // Ajouter le nouveau marqueur de recherche
      searchMarkerRef.current = L.marker(
        [searchPosition.latitude, searchPosition.longitude],
        { icon: searchIcon }
      ).addTo(leafletMapRef.current);
      
      searchMarkerRef.current.bindPopup("Adresse recherchée").openPopup();
    }
  }, [searchPosition]);

  // Traçage automatique de l'itinéraire si les deux positions sont disponibles et autoTrace est activé
  useEffect(() => {
    if (userPosition && searchPosition && autoTrace && !route) {
      traceRoute();
    }
  }, [userPosition, searchPosition, autoTrace]);

  // Fonction pour tracer l'itinéraire
  const traceRoute = async () => {
    if (!userPosition || !searchPosition || !leafletMapRef.current) {
      setRouteError("Impossible de tracer l'itinéraire. Vérifiez que votre position et l'adresse recherchée sont disponibles.");
      return;
    }

    setIsLoadingRoute(true);
    setRouteError(null);

    // Supprimer l'ancien itinéraire s'il existe
    if (route) {
      route.remove();
      setRoute(null);
    }

    try {
      // Utiliser l'API OSRM pour obtenir l'itinéraire
      const apiUrl = `https://router.project-osrm.org/route/v1/driving/${userPosition.longitude},${userPosition.latitude};${searchPosition.longitude},${searchPosition.latitude}?overview=full&geometries=geojson`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Erreur de l'API de routage: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const routeData = data.routes[0];
        
        // Extraire les coordonnées de l'itinéraire
        const coordinates = routeData.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);
        
        // Créer une ligne polyline pour représenter l'itinéraire
        const newRoute = L.polyline(coordinates, {
          color: '#3b82f6', // Bleu
          weight: 5,
          opacity: 0.8
        }).addTo(leafletMapRef.current);
        
        setRoute(newRoute);
        
        // Mettre à jour les informations de distance et de durée
        setRouteDistance(routeData.distance / 1000); // Distance en km
        setRouteDuration(routeData.duration / 60); // Durée en minutes
        
        // Ajuster la vue de la carte pour montrer l'itinéraire complet
        leafletMapRef.current.fitBounds(newRoute.getBounds(), {
          padding: [50, 50]
        });
      } else {
        setRouteError("Aucun itinéraire trouvé entre ces deux points.");
      }
    } catch (error) {
      console.error("Erreur lors du traçage de l'itinéraire:", error);
      setRouteError("Impossible de tracer l'itinéraire. Veuillez réessayer plus tard.");
    } finally {
      setIsLoadingRoute(false);
    }
  };

  // Gestion de la recherche d'adresse
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchAddress && searchPostalCode) {
      // Le hook useCoordinates se déclenchera automatiquement
      console.log("Recherche d'adresse:", searchAddress, searchPostalCode, searchCountry);
    }
  };

  // Fonction pour basculer l'état du formulaire de recherche
  const toggleSearchForm = () => {
    setIsSearchFormOpen(!isSearchFormOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Chargement de votre profil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline">
            {" "}
            Impossible de charger votre profil.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BaseHeader>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Carte</h1>
        </div>
      </BaseHeader>

      {/* Style CSS pour réduire le z-index de la carte Leaflet */}
      <style jsx global>{mapStyle}</style>

      <main className="max-w-7xl mx-auto px-4 py-8 mt-16 mb-32">
        {/* Formulaire de recherche d'adresse */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={toggleSearchForm}
          >
            <h2 className="text-lg font-semibold">Rechercher une adresse</h2>
            <div className="text-gray-500">
              {isSearchFormOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </div>
          
          {isSearchFormOpen && (
            <form onSubmit={handleSearch} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={searchAddress}
                    onChange={(e) => setSearchAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Entrez une adresse"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Code postal
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    value={searchPostalCode}
                    onChange={(e) => setSearchPostalCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Code postal"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Pays
                </label>
                <input
                  type="text"
                  id="country"
                  value={searchCountry}
                  onChange={(e) => setSearchCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Pays"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <LoadingSpinner />
                      <span className="ml-2">Recherche...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      <span>Rechercher</span>
                    </>
                  )}
                </button>
              </div>
              {searchError && searchAddress && searchPostalCode && (
                <div className="mt-2 text-sm text-red-600">
                  {searchError}
                </div>
              )}
            </form>
          )}
        </div>

        {/* Carte */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-gray-600" />
              Carte
            </h3>
          </div>
          
          {isLoadingUserPosition ? (
            <div className="relative w-full h-80 flex flex-col justify-center items-center bg-gray-50">
              <LoadingSpinner />
              <span className="text-gray-500 text-sm mt-2">
                Chargement de votre position...
              </span>
            </div>
          ) : userPositionError ? (
            <div className="relative w-full h-80 flex flex-col justify-center items-center bg-gray-50">
              <div className="text-red-500 mb-2">
                <MapPin className="h-8 w-8" />
              </div>
              <span className="text-gray-700 text-sm text-center max-w-md">
                {userPositionError}
              </span>
            </div>
          ) : (
            <div ref={mapRef} style={{ height: "400px", width: "100%" }} />
          )}
          
          {/* Bouton pour tracer l'itinéraire */}
          {userPosition && searchPosition && (
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={traceRoute}
                disabled={isLoadingRoute}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingRoute ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-2">Calcul de l'itinéraire...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="h-4 w-4 mr-2" />
                    <span>Tracer le trajet</span>
                  </>
                )}
              </button>
              
              {routeError && (
                <div className="mt-2 text-sm text-red-600">
                  {routeError}
                </div>
              )}
              
              {route && routeDistance && routeDuration && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium text-gray-800 mb-2">Informations sur l'itinéraire</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Distance:</span>
                      <span className="ml-1 font-medium">{routeDistance.toFixed(1)} km</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Durée estimée:</span>
                      <span className="ml-1 font-medium">{Math.round(routeDuration)} min</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MapPage; 
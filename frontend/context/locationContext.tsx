"use client";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect, // Importez useEffect
} from "react";
import { Position } from "../types/Position";
import { useGeolocation } from "@uidotdev/usehooks";
// Interface mise à jour pour inclure loading et error
interface LocationContextProps {
  location: Position | null;
  loading: boolean; // Ajout de l'état de chargement
  error: GeolocationPositionError | null; // Ajout de l'état d'erreur
  // updateLocation n'est plus nécessaire si seul le provider met à jour
  // Vous pouvez le garder si d'autres composants doivent forcer une mise à jour
  // updateLocation: (newLocation: Position) => void;
}

const LocationContext = createContext<LocationContextProps | undefined>(
  undefined
);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({
  children,
}) => {
  const [location, setLocation] = useState<Position | null>(null);
  // Utilisez useGeolocation à l'intérieur du Provider
  const {
    loading: geoLoading, // Renommez pour éviter conflit si besoin
    latitude,
    longitude,
    error: geoError, // Renommez pour éviter conflit si besoin
  } = useGeolocation();

  // Utilisez useEffect pour mettre à jour l'état du contexte
  // lorsque useGeolocation fournit des coordonnées
  useEffect(() => {
    // Vérifiez si latitude et longitude sont des nombres valides
    if (typeof latitude === "number" && typeof longitude === "number") {
      setLocation({
        latitude: latitude,
        longitude: longitude,
      });
      console.log("Location Context updated:", { latitude, longitude });
    }
  }, [latitude, longitude]); // Dépendances : latitude et longitude du hook

  // Fonction de mise à jour (peut être retirée si seul le provider met à jour)
  /*
  const updateLocation = useCallback((newLocation: Position) => {
     setLocation(newLocation);
  }, []);
  */

  // Valeur du contexte incluant location, loading, error
  const contextValue: LocationContextProps = {
    location,
    loading: geoLoading, // Exposez l'état de chargement du hook
    error: geoError, // Exposez l'état d'erreur du hook
    // updateLocation, // Incluez si vous gardez la fonction
  };

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextProps => {
  console.log("useLocation called");
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }

  return context;
};

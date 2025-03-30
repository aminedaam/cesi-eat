import { useState, useEffect } from "react";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface UseCoordinatesResult {
  coordinates: Coordinates | null;
  error: string | null;
  isLoading: boolean;
}

const useCoordinates = (
  adresse: string,
  codePostal: string,
  pays: string
): UseCoordinatesResult => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (adresse && codePostal && pays) {
      setError(null);
      setIsLoading(true);
      const query = `${adresse}, ${codePostal}, ${pays}`;
      console.log("Query", query);
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.length > 0) {
            const { lat, lon } = data[0];
            setCoordinates({
              latitude: parseFloat(lat),
              longitude: parseFloat(lon),
            });
          } else {
            setError("Adresse non trouvée.");
          }
          setIsLoading(false);
        })
        .catch(() => {
          setError("Erreur lors de la récupération des coordonnées.");
          setIsLoading(false);
        });
    } else {
      setCoordinates(null);
      setError("Veuillez renseigner une adresse, un code postal et un pays.");
    }
  }, [adresse, codePostal, pays]);

  return { coordinates, error, isLoading };
};

export default useCoordinates;

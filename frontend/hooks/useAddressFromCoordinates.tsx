import { Address } from "@/types/Address";
import { useState, useEffect } from "react";

interface ReverseGeocodingResult {
  address: Address;
  loading: boolean;
  error: string | null;
}

const useAddressFromCoordinates = (
  latitude: number | null,
  longitude: number | null
): ReverseGeocodingResult => {
  const [address, setAddress] = useState<Address>({
    address: null,
    postalCode: null,
    city: null,
    country: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (latitude === null || longitude === null) {
      setAddress({
        address: null,
        postalCode: null,
        city: null,
        country: null,
      });
      return;
    }

    const fetchAddress = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Erreur de l'API: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.address) {
          console.log("Reverse geocoding data:", data);
          setAddress({
            address: data.address.road || data.address.neighbourhood || null,
            postalCode: data.address.postcode || null,
            city:
              data.address.city ||
              data.address.town ||
              data.address.village ||
              null,
            country: data.address.country || null,
          });
        } else {
          setError("Adresse non trouvée pour ces coordonnées.");
          setAddress({
            address: null,
            postalCode: null,
            city: null,
            country: null,
          });
        }

        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(`Impossible de récupérer l'adresse: ${err.message}`);
        setLoading(false);
      }
    };

    fetchAddress();
  }, [latitude, longitude]);

  return { address, loading, error };
};

export default useAddressFromCoordinates;

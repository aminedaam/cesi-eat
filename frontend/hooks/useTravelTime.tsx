import { useState, useEffect } from "react";
import { Position } from "@/types/Position"; // Assuming Position interface exists

interface TravelTimeResult {
  duration: number | null; // Duration in seconds
  loading: boolean;
  error: string | null;
}


const useTravelTime = (
  startPosition: Position | null,
  endPosition: Position | null
): TravelTimeResult => {
  const [duration, setDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Start position:", startPosition);
    console.log("End position:", endPosition);
    if (!startPosition || !endPosition) {
      setDuration(null);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchTravelTime = async () => {
      setLoading(true);
      setError(null);
      setDuration(null);

      const { latitude: startLat, longitude: startLng } = startPosition;
      const { latitude: endLat, longitude: endLng } = endPosition;

      const apiUrl = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=false`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Erreur de l'API de routage: ${response.status}`);
        }
        const data = await response.json();
        console.log("Travel time data:", data);

        if (data.routes && data.routes.length > 0) {
          // Duration is in seconds

          setDuration(data.routes[0].duration);
        } else {
          setError(
            "Impossible de calculer le temps de trajet entre ces positions."
          );
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(`Erreur lors du calcul du temps de trajet: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTravelTime();
  }, [startPosition, endPosition]);

  return { duration, loading, error };
};

export default useTravelTime;

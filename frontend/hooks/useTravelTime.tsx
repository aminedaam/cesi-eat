import { useState, useEffect } from "react";

interface TravelTimeResult {
  duration: number | null; // Duration in seconds
  loading: boolean;
  error: string | null;
}


const useTravelTime = (
  startLat: number | null,
  startLng: number | null,
  endLat: number | null,
  endLng: number | null
): TravelTimeResult => {
  const [duration, setDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Start coordinates:", { startLat, startLng });
    console.log("End coordinates:", { endLat, endLng });
    if (
      startLat === null ||
      startLng === null ||
      endLat === null ||
      endLng === null
    ) {
      setDuration(null);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchTravelTime = async () => {
      setLoading(true);
      setError(null);
      setDuration(null);

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
  }, [startLat, startLng, endLat, endLng]);

  return { duration, loading, error };
};

export default useTravelTime;

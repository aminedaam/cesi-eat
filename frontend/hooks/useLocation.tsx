"use client";
import { useState, useEffect } from "react";

export function useLocation() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const success = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };

    const error = (err: GeolocationPositionError) => {
      setError(`ERROR(${err.code}): ${err.message}`);
    };

    const options = {
      enableHighAccuracy: false, // Use GPS if available
      timeout: 5000, // Time to wait before giving up
      maximumAge: 0, // Don't use cached locations
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
  }, []); // Empty dependency array ensures this runs only once on mount

  return { location, error };
}

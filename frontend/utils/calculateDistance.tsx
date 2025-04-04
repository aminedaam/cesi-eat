import { Position } from "@/types/Position";

export async function calculateDistance(position1: Position, position2: Position) {
    const url = `http://router.project-osrm.org/route/v1/driving/${position1.longitude},${position1.latitude};${position2.longitude},${position2.latitude}?overview=false`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
      return data.routes[0].distance / 1000; // Distance in km
    }
    return 0;
  }
  
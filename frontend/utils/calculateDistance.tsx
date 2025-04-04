
export async function calculateDistance(
  lat1: number,
  long1: number,
  lat2: number,
  long2: number
) {
  console.log("Calculating distance between:", { lat1, long1 }, { lat2, long2 });
  const url = `http://router.project-osrm.org/route/v1/driving/${long1},${lat1};${long2},${lat2}?overview=false`;

  const response = await fetch(url);

  const data = await response.json();

  if (data.routes && data.routes.length > 0) {
    return data.routes[0].distance / 1000; // Distance in km
  }

  return 0;
}
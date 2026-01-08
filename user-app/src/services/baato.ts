const BAATO_KEY = process.env.EXPO_PUBLIC_BAATO_API_KEY;
const BAATO_URL = "https://api.baato.io/api/v1";

export const searchAddress = async (query: string) => {
  if (!query || query.length < 3) return [];
  try {
    const url = `${BAATO_URL}/search?key=${BAATO_KEY}&q=${encodeURIComponent(
      query
    )}&limit=5`;
    const res = await fetch(url);
    const json = await res.json();
    return json.data || [];
  } catch (e) {
    console.error("Baato Search Error:", e);
    return [];
  }
};

// NEW: Add this function to fetch coordinates when search misses them
export const getPlaceDetails = async (placeId: number) => {
  try {
    const url = `${BAATO_URL}/places?key=${BAATO_KEY}&placeId=${placeId}`;
    const res = await fetch(url);
    const json = await res.json();
    return json.data;
  } catch (e) {
    console.error("Baato Details Error:", e);
    return null;
  }
};

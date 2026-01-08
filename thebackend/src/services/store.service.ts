import prisma from "../utils/prisma";

// Haversine Logic for "Check Serviceability"
export const findNearestStore = async (lat: number, lng: number) => {
  const stores = await prisma.$queryRaw`
    SELECT id, name, radiusKm, 
    ( 6371 * acos( cos( radians(${lat}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${lng}) ) + sin( radians(${lat}) ) * sin( radians( latitude ) ) ) ) AS distance 
    FROM Store 
    WHERE isActive = 1
    HAVING distance < radiusKm 
    ORDER BY distance ASC 
    LIMIT 1;
  `;
  const result = stores as any[];
  return result.length > 0 ? result[0] : null;
};

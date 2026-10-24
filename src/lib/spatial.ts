/**
 * PostGIS Geospatial Engine Utilities
 * Emulates PostGIS ST_DWithin and ST_Distance calculations with high precision
 */

export interface GeoPoint {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_KM = 6371.0;

/**
 * Calculates Great-Circle distance between two points using the Haversine formula (km)
 */
export function calculateDistanceKm(pointA: GeoPoint, pointB: GeoPoint): number {
  const dLat = degreesToRadians(pointB.lat - pointA.lat);
  const dLng = degreesToRadians(pointB.lng - pointA.lng);

  const lat1 = degreesToRadians(pointA.lat);
  const lat2 = degreesToRadians(pointB.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_KM * c * 100) / 100;
}

/**
 * Emulates PostGIS ST_DWithin(geomA, geomB, distance_meters)
 */
export function isWithinRadius(origin: GeoPoint, target: GeoPoint, radiusKm: number): boolean {
  const dist = calculateDistanceKm(origin, target);
  return dist <= radiusKm;
}

/**
 * Calculates estimated driving transit time in minutes given distance and speed
 * Default average urban traffic speed: 32 km/h
 */
export function calculateEtaMinutes(distanceKm: number, averageSpeedKmh = 32): number {
  if (distanceKm <= 0) return 1;
  const hours = distanceKm / averageSpeedKmh;
  const minutes = Math.ceil(hours * 60);
  return Math.max(1, minutes);
}

/**
 * Calculates geographic bearing (degrees 0-360) between two points
 */
export function calculateBearing(start: GeoPoint, end: GeoPoint): number {
  const startLat = degreesToRadians(start.lat);
  const startLng = degreesToRadians(start.lng);
  const endLat = degreesToRadians(end.lat);
  const endLng = degreesToRadians(end.lng);

  const dLng = endLng - startLng;

  const y = Math.sin(dLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

  const brng = Math.atan2(y, x);
  return (radiansToDegrees(brng) + 360) % 360;
}

function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

const axios = require('axios');

const DEFAULT_OSRM_BASE_URL = 'https://router.project-osrm.org';

function getOsrmBaseUrl() {
  const raw = (process.env.OSRM_BASE_URL || DEFAULT_OSRM_BASE_URL).trim();
  return raw.replace(/\/+$/, '');
}

function formatCoord(lng, lat) {
  return `${Number(lng)},${Number(lat)}`;
}

/**
 * Normalize OSRM route/trip response into a stable shape.
 * geometry is GeoJSON coordinates array: [[lng, lat], ...]
 */
function normalizeOsrmPayload(data, { preferTrip = false } = {}) {
  if (!data || data.code !== 'Ok') {
    const message = data?.message || data?.code || 'OSRM routing failed';
    const error = new Error(message);
    error.code = data?.code || 'OSRM_ERROR';
    throw error;
  }

  if (preferTrip && Array.isArray(data.trips) && data.trips.length > 0) {
    const trip = data.trips[0];
    return {
      distance: Number(trip.distance) || 0,
      duration: Number(trip.duration) || 0,
      geometry: trip.geometry?.coordinates || [],
      waypoint_order: Array.isArray(data.waypoints)
        ? data.waypoints.map((wp) => (typeof wp.waypoint_index === 'number' ? wp.waypoint_index : null))
        : [],
      waypoints: data.waypoints || [],
    };
  }

  if (!Array.isArray(data.routes) || data.routes.length === 0) {
    throw new Error('OSRM returned no routes');
  }

  const route = data.routes[0];
  return {
    distance: Number(route.distance) || 0,
    duration: Number(route.duration) || 0,
    geometry: route.geometry?.coordinates || [],
    waypoint_order: [],
    waypoints: data.waypoints || [],
  };
}

/**
 * Point-to-point driving route.
 * @param {{ lat: number, lng: number }} origin
 * @param {{ lat: number, lng: number }} destination
 */
async function getDrivingRoute(origin, destination) {
  const base = getOsrmBaseUrl();
  const coords = `${formatCoord(origin.lng, origin.lat)};${formatCoord(destination.lng, destination.lat)}`;
  const url = `${base}/route/v1/driving/${coords}`;

  const { data } = await axios.get(url, {
    params: {
      overview: 'full',
      geometries: 'geojson',
    },
    timeout: 20000,
  });

  return normalizeOsrmPayload(data);
}

/**
 * Multi-stop optimized trip (TSP-style). First coordinate is fixed as start (source=first).
 * @param {{ lat: number, lng: number }} origin
 * @param {Array<{ lat: number, lng: number }>} stops  pickup locations (unordered)
 */
async function getOptimizedTrip(origin, stops) {
  if (!Array.isArray(stops) || stops.length === 0) {
    throw new Error('At least one stop is required for trip optimization');
  }

  const base = getOsrmBaseUrl();
  const allPoints = [origin, ...stops];
  const coords = allPoints.map((p) => formatCoord(p.lng, p.lat)).join(';');
  const url = `${base}/trip/v1/driving/${coords}`;

  const { data } = await axios.get(url, {
    params: {
      source: 'first',
      roundtrip: 'false',
      overview: 'full',
      geometries: 'geojson',
    },
    timeout: 30000,
  });

  const normalized = normalizeOsrmPayload(data, { preferTrip: true });

  // OSRM trip waypoints: waypoint_index is the order in the optimized trip.
  // Input index 0 is origin; stops are input indices 1..N.
  // Build visit order of stop indices (0-based into `stops` array).
  const waypoints = data.waypoints || [];
  const stopOrder = waypoints
    .map((wp, inputIndex) => ({
      inputIndex,
      tripOrder: typeof wp.waypoint_index === 'number' ? wp.waypoint_index : inputIndex,
    }))
    .filter((item) => item.inputIndex > 0)
    .sort((a, b) => a.tripOrder - b.tripOrder)
    .map((item) => item.inputIndex - 1);

  return {
    ...normalized,
    stop_order: stopOrder,
  };
}

module.exports = {
  getOsrmBaseUrl,
  getDrivingRoute,
  getOptimizedTrip,
  DEFAULT_OSRM_BASE_URL,
};

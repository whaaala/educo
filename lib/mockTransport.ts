// Shared mock transport data

export interface TransportRoute {
  value: string;
  label: string;
}

export interface Vehicle {
  value: string;
  label: string;
}

// Sample transport routes
export const sampleRoutes: string[] = [
  "Route 1 - Ikeja",
  "Route 2 - Victoria Island",
  "Route 3 - Lekki",
  "Route 4 - Surulere",
  "Route 5 - Ikoyi",
  "Route 6 - Ajah",
  "Route 7 - Yaba",
  "Route 8 - Gbagada",
];

// Sample vehicle numbers
export const sampleVehicles: string[] = [
  "BUS-001",
  "BUS-002",
  "BUS-003",
  "BUS-004",
  "BUS-005",
  "BUS-006",
  "VAN-001",
  "VAN-002",
];

// Sample pickup points (common locations)
export const samplePickupPoints: string[] = [
  "Ikeja Bus Stop",
  "Victoria Island Terminal",
  "Lekki Phase 1",
  "Surulere Roundabout",
  "Ikoyi Plaza",
  "Ajah Market",
  "Yaba Bus Terminal",
  "Gbagada Express",
];

/**
 * Get all transport routes as dropdown options
 */
export function getTransportRoutes(): TransportRoute[] {
  return sampleRoutes.map((route) => ({
    value: route,
    label: route,
  }));
}

/**
 * Get all vehicles as dropdown options
 */
export function getTransportVehicles(): Vehicle[] {
  return sampleVehicles.map((vehicle) => ({
    value: vehicle,
    label: vehicle,
  }));
}

/**
 * Get all pickup points as dropdown options
 */
export function getPickupPoints(): TransportRoute[] {
  return samplePickupPoints.map((point) => ({
    value: point,
    label: point,
  }));
}


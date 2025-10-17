/**
 * Location Utility Functions
 * Helper functions for getting user's current location using browser geolocation API
 */

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
}

export interface LocationError {
  code: number;
  message: string;
}

// Options for geolocation request
const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000, // 10 seconds
  maximumAge: 300000, // 5 minutes cache
};

/**
 * Get current location using browser geolocation API
 * @returns Promise<LocationData> - Current location data
 */
export const getCurrentLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      reject({
        code: 0,
        message: 'Geolocation is not supported by this browser.',
      } as LocationError);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        resolve(locationData);
      },
      error => {
        let errorMessage = 'Failed to get location.';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please check your GPS settings.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage = 'An unknown error occurred while retrieving location.';
            break;
        }

        reject({
          code: error.code,
          message: errorMessage,
        } as LocationError);
      },
      GEOLOCATION_OPTIONS
    );
  });
};

/**
 * Get address from coordinates using reverse geocoding (basic implementation)
 * In production, you would use a proper geocoding service like Google Maps API
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Promise<string> - Formatted address
 */
export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    // This is a basic implementation using OpenStreetMap Nominatim API
    // In production, use Google Maps Geocoding API or similar service
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'TSO-SalesForce-App/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch address');
    }

    const data = await response.json();

    if (data && data.display_name) {
      return data.display_name;
    } else {
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
  } catch (error) {
    console.warn('Failed to get address from coordinates:', error);
    // Return coordinates as fallback
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }
};

/**
 * Get current location with address
 * @returns Promise<LocationData> - Location data with address
 */
export const getCurrentLocationWithAddress = async (): Promise<LocationData> => {
  const location = await getCurrentLocation();

  // Get address from coordinates
  const address = await getAddressFromCoordinates(location.latitude, location.longitude);

  return {
    ...location,
    address,
  };
};

/**
 * Format location data for display
 * @param location - Location data
 * @returns string - Formatted location string
 */
export const formatLocationForDisplay = (location: LocationData): string => {
  if (location.address) {
    return location.address;
  }
  return `Lat: ${location.latitude.toFixed(6)}, Lng: ${location.longitude.toFixed(6)}`;
};

/**
 * Format location data for API submission
 * @param location - Location data
 * @returns object - Location data formatted for API
 */
export const formatLocationForAPI = (location: LocationData) => {
  return {
    latitude: location.latitude,
    longitude: location.longitude,
    accuracy: location.accuracy,
    timestamp: new Date(location.timestamp).toISOString(),
    address: location.address || null,
  };
};

/**
 * Check if location permissions are granted
 * @returns Promise<boolean> - Whether location permissions are granted
 */
export const checkLocationPermission = async (): Promise<boolean> => {
  if (!navigator.permissions) {
    return false;
  }

  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state === 'granted';
  } catch (error) {
    console.warn('Failed to check location permission:', error);
    return false;
  }
};

/**
 * Request location permission
 * @returns Promise<boolean> - Whether permission was granted
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    await getCurrentLocation();
    return true;
  } catch (error) {
    console.warn('Location permission denied:', error);
    return false;
  }
};

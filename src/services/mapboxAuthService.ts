
/**
 * Service to handle Mapbox authentication and token management
 */

// Token storage key in localStorage
const MAPBOX_TOKEN_STORAGE_KEY = 'mapbox_token';

/**
 * Service for managing Mapbox authentication
 */
export const mapboxAuthService = {
  /**
   * Get the stored Mapbox token
   */
  getToken: (): string | null => {
    return localStorage.getItem(MAPBOX_TOKEN_STORAGE_KEY);
  },

  /**
   * Save a Mapbox token to localStorage
   */
  saveToken: (token: string): void => {
    localStorage.setItem(MAPBOX_TOKEN_STORAGE_KEY, token);
  },

  /**
   * Clear the stored Mapbox token
   */
  clearToken: (): void => {
    localStorage.removeItem(MAPBOX_TOKEN_STORAGE_KEY);
  },

  /**
   * Validate a Mapbox token format
   * This is a basic check - actual validation happens when using the token with Mapbox
   */
  validateTokenFormat: (token: string): boolean => {
    // Mapbox tokens typically start with 'pk.' for public tokens
    return token.startsWith('pk.') && token.length > 20;
  },

  /**
   * Check if we have a stored token
   */
  hasToken: (): boolean => {
    return !!mapboxAuthService.getToken();
  }
};

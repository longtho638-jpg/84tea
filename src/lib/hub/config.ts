/**
 * Mekong Hub Integration Configuration
 *
 * Status: PLACEHOLDER (Phase 07)
 * Hub SDK: Not yet available
 *
 * This configuration prepares for future integration
 * without affecting current functionality.
 */

export const HUB_CONFIG = {
  enabled: false, // Will be true when Hub SDK ready
  apiUrl: process.env.NEXT_PUBLIC_HUB_API_URL || '',
  clientId: process.env.NEXT_PUBLIC_HUB_CLIENT_ID || '',
  version: '0.0.0', // Placeholder
} as const;

export function isHubEnabled(): boolean {
  return HUB_CONFIG.enabled && !!HUB_CONFIG.apiUrl;
}

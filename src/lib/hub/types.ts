/**
 * Hub Integration Type Definitions
 *
 * These types define the contract for future Hub SDK integration.
 * They document expected interfaces without implementing functionality.
 */

// Multi-tenant context (future)
export interface TenantContext {
  tenantId: string;
  franchiseId: string;
  locationId: string;
  permissions: string[];
}

// Analytics event structure
export interface HubAnalyticsEvent {
  event: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  properties: Record<string, unknown>;
  metadata: {
    tenantId?: string;
    source: 'web' | 'mobile' | 'pos';
    version: string;
  };
}

// Hub authentication result
export interface HubAuthResult {
  authenticated: boolean;
  tenantContext?: TenantContext;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Hub SDK interface (future implementation)
export interface HubSDK {
  auth: {
    login(email: string, password: string): Promise<HubAuthResult>;
    logout(): Promise<void>;
    getContext(): TenantContext | null;
  };
  analytics: {
    track(event: HubAnalyticsEvent): Promise<void>;
    identify(userId: string, traits: Record<string, unknown>): Promise<void>;
  };
  operations: {
    syncInventory(data: unknown): Promise<void>;
    syncOrders(data: unknown): Promise<void>;
  };
}

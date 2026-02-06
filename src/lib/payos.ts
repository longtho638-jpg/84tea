import PayOS from "@payos/node";

export function getPayOS() {
  // Handle different import styles (ESM/CJS interop)
  const PayOSConstructor = (PayOS as any).default || PayOS;

  return new (PayOSConstructor as any)(
    process.env.PAYOS_CLIENT_ID || "no-client-id",
    process.env.PAYOS_API_KEY || "no-api-key",
    process.env.PAYOS_CHECKSUM_KEY || "no-checksum-key"
  );
}

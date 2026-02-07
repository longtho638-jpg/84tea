import { PayOS } from "@payos/node";

export function getPayOS(): PayOS {
  return new PayOS({
    clientId: process.env.PAYOS_CLIENT_ID || "no-client-id",
    apiKey: process.env.PAYOS_API_KEY || "no-api-key",
    checksumKey: process.env.PAYOS_CHECKSUM_KEY || "no-checksum-key",
  });
}

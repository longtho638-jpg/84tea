import { PayOS } from "@payos/node";

export function getPayOS(): PayOS {
  const clientId = process.env.PAYOS_CLIENT_ID;
  const apiKey = process.env.PAYOS_API_KEY;
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

  if (!clientId || !apiKey || !checksumKey) {
    throw new Error(
      "Missing required PayOS environment variables. Please set PAYOS_CLIENT_ID, PAYOS_API_KEY, and PAYOS_CHECKSUM_KEY"
    );
  }

  return new PayOS({
    clientId,
    apiKey,
    checksumKey,
  });
}

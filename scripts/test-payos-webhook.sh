#!/bin/bash

# Webhook Test Script for 84tea
# Simulates a PayOS webhook call to localhost

ORDER_CODE=$1
STATUS=${2:-"00"} # Default to success (00)

if [ -z "$ORDER_CODE" ]; then
  echo "Usage: ./test-payos-webhook.sh <order_code> [status_code]"
  echo "Example: ./test-payos-webhook.sh 123456"
  exit 1
fi

# PayOS Signature Simulation (Mock)
# In real dev, we need the actual checksum key to generate valid signature
# For local testing without strict signature verification, you might need to disable signature check temporarily
# or calculate it using node.js

PAYLOAD="{\"code\":\"$STATUS\",\"desc\":\"success\",\"data\":{\"orderCode\":$ORDER_CODE,\"amount\":100000,\"description\":\"Test Order\",\"accountNumber\":\"1234\",\"reference\":\"REF123\",\"transactionDateTime\":\"2024-02-07 12:00:00\",\"currency\":\"VND\",\"paymentLinkId\":\"PL123\",\"code\":\"00\",\"desc\":\"success\",\"counterAccountBankId\":\"MB\",\"counterAccountBankName\":\"MB\",\"counterAccountName\":\"NGUYEN VAN A\",\"counterAccountNumber\":\"123456\",\"virtualAccountName\":\"84TEA\",\"virtualAccountNumber\":\"987654\"},\"signature\":\"mock_signature\"}"

echo "🚀 Sending Webhook for Order: $ORDER_CODE (Status: $STATUS)..."

curl -X POST http://localhost:3000/api/payment/webhook \
  -H "Content-Type: application/json" \
  -H "x-payos-signature: mock_signature_hash" \
  -d "$PAYLOAD"

echo -e "\n\n✅ Request Sent."

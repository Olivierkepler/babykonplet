import crypto from "crypto";

export function generateIdempotencyKey() {
  return crypto.randomUUID();
}

export function formatAmountForSquare(amount: number) {
  return Math.round(amount);
}
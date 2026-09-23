import crypto from "crypto";

export function generateOTP(): string {
  return crypto
    .randomInt(100000, 1000000)
    .toString();
}

export function getOTPExpiry(): Date {
  return new Date(
    Date.now() + 10 * 60 * 1000
  );
}
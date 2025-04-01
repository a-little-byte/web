import { Hash, Verify } from "@/api/c/hash/utils";

/**
 * Hash a password using PBKDF2-HMAC-SHA256
 * @param password The password to hash
 * @param salt Optional salt (if not provided, a random one will be generated)
 * @param pepper Optional pepper value to add additional security
 * @param iterations Optional number of iterations (default: 10000, minimum: 1000)
 * @returns A string containing the salt, iterations, and hash in the format: salt$iterations$hash
 */
export function Hash(
  password: string,
  salt?: string | null,
  pepper?: string | null,
  iterations?: number
): string;

/**
 * Verify a password against a stored hash
 * @param password The password to verify
 * @param storedHash The stored hash to verify against (in the format: salt$iterations$hash)
 * @param pepper Optional pepper value that was used during hashing
 * @returns true if the password matches, false otherwise
 */
export function Verify(
  password: string,
  storedHash: string,
  pepper?: string | null
): boolean; 
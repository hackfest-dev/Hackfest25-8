
/**
 * Core cryptographic utilities
 */

/**
 * Convert a string to Uint8Array
 */
export const stringToBytes = (str: string): Uint8Array => {
  return new TextEncoder().encode(str);
};

/**
 * Convert Uint8Array to a hexadecimal string
 */
export const bytesToHex = (bytes: Uint8Array): string => {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Convert a hexadecimal string to Uint8Array
 */
export const hexToBytes = (hex: string): Uint8Array => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
};

/**
 * Generate cryptographically secure random bytes
 */
export const getRandomBytes = (length: number): Uint8Array => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
};

/**
 * Create a cryptographic hash using the Web Crypto API
 */
export const createHash = async (data: Uint8Array, algorithm = 'SHA-256'): Promise<Uint8Array> => {
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  return new Uint8Array(hashBuffer);
};

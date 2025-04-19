
/**
 * Cryptographic utility functions
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

/**
 * Format a timestamp as a date string
 */
export const formatTimestamp = (timestamp: number | string): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);
  return date.toLocaleString();
};

/**
 * Generate a random transaction hash
 */
export const generateTransactionHash = async (): Promise<string> => {
  const randomBytes = getRandomBytes(32);
  const hash = await createHash(randomBytes);
  return '0x' + bytesToHex(hash);
};

/**
 * Generate a random wallet address
 */
export const generateWalletAddress = (): string => {
  const randomBytes = getRandomBytes(20);
  return '0x' + bytesToHex(randomBytes);
};

/**
 * Measure execution time of an async function
 */
export const measureExecutionTime = async <T>(fn: () => Promise<T>): Promise<{ result: T; time: number }> => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  return { result, time: end - start };
};

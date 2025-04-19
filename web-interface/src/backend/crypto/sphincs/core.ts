
import { SPHINCS_PARAMS } from '../constants';
import { getRandomBytes, createHash } from '../utils';

/**
 * Hash function used in SPHINCS+
 */
export const hashWithShake = async (data: Uint8Array, outputLength: number): Promise<Uint8Array> => {
  // Using SHA-256 as a substitute for SHAKE-256 in this demo
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  
  if (outputLength <= hashArray.length) {
    return hashArray.slice(0, outputLength);
  }
  
  const result = new Uint8Array(outputLength);
  for (let i = 0; i < outputLength; i += hashArray.length) {
    const slice = hashArray.slice(0, Math.min(hashArray.length, outputLength - i));
    result.set(slice, i);
  }
  return result;
};

/**
 * F function - core hash function used in SPHINCS+
 */
export const F = async (seed: Uint8Array, adrs: Uint8Array, message: Uint8Array): Promise<Uint8Array> => {
  const toHash = new Uint8Array(seed.length + adrs.length + message.length);
  toHash.set(seed, 0);
  toHash.set(adrs, seed.length);
  toHash.set(message, seed.length + adrs.length);
  
  return await hashWithShake(toHash, SPHINCS_PARAMS.n);
};

/**
 * H function - hash function used for constructing the hash tree
 */
export const H = async (seed: Uint8Array, adrs: Uint8Array, left: Uint8Array, right: Uint8Array): Promise<Uint8Array> => {
  const toHash = new Uint8Array(seed.length + adrs.length + left.length + right.length);
  toHash.set(seed, 0);
  toHash.set(adrs, seed.length);
  toHash.set(left, seed.length + adrs.length);
  toHash.set(right, seed.length + adrs.length + left.length);
  
  return await hashWithShake(toHash, SPHINCS_PARAMS.n);
};

/**
 * Pseudorandom function used to derive keys
 */
export const PRF = async (seed: Uint8Array, adrs: Uint8Array): Promise<Uint8Array> => {
  return await hashWithShake(new Uint8Array([...seed, ...adrs]), SPHINCS_PARAMS.n);
};

/**
 * Generate SPHINCS+ address
 */
export const generateADRS = (layer: number, tree: number, type: number): Uint8Array => {
  const adrs = new Uint8Array(32);
  adrs[0] = type;
  adrs[4] = layer;
  for (let i = 0; i < 8; i++) {
    adrs[8 + i] = (tree >> (8 * (7 - i))) & 0xff;
  }
  return adrs;
};

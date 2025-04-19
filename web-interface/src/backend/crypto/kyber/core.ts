
/**
 * Core polynomial arithmetic for Kyber
 */

import { KYBER_PARAMS } from '../constants';
import { getRandomBytes } from '../utils';

/**
 * Polynomial arithmetic for Kyber
 */
export const polyArith = {
  add: (a: number[], b: number[]): number[] => {
    return a.map((v, i) => (v + b[i]) % KYBER_PARAMS.q);
  },
  
  sub: (a: number[], b: number[]): number[] => {
    return a.map((v, i) => ((v - b[i]) + KYBER_PARAMS.q) % KYBER_PARAMS.q);
  },
  
  mul: (a: number[], b: number[]): number[] => {
    const result = new Array(KYBER_PARAMS.n).fill(0);
    for (let i = 0; i < KYBER_PARAMS.n; i++) {
      for (let j = 0; j < KYBER_PARAMS.n; j++) {
        const idx = (i + j) % KYBER_PARAMS.n;
        result[idx] = (result[idx] + a[i] * b[j]) % KYBER_PARAMS.q;
      }
    }
    return result;
  }
};

/**
 * Sample polynomial with small coefficients
 */
export const sampleNoise = (seed: Uint8Array, nonce: number): number[] => {
  const result = new Array(KYBER_PARAMS.n).fill(0);
  const bytes = new Uint8Array(KYBER_PARAMS.n * 2);
  crypto.getRandomValues(bytes);
  
  for (let i = 0; i < KYBER_PARAMS.n; i++) {
    const x = ((bytes[2 * i] << 8) | bytes[2 * i + 1]) % KYBER_PARAMS.q;
    result[i] = x <= KYBER_PARAMS.eta1 ? x : -x;
  }
  
  return result;
};

/**
 * Generate a random polynomial in R_q
 */
export const generateRandomPoly = (): number[] => {
  const result = new Array(KYBER_PARAMS.n).fill(0);
  const bytes = getRandomBytes(KYBER_PARAMS.n * 2);
  
  for (let i = 0; i < KYBER_PARAMS.n; i++) {
    result[i] = ((bytes[2 * i] << 8) | bytes[2 * i + 1]) % KYBER_PARAMS.q;
  }
  
  return result;
};

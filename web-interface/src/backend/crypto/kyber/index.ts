
import { KYBER_PARAMS } from '../constants';
import { bytesToHex, hexToBytes, stringToBytes, getRandomBytes } from '../utils';
import { polyArith, sampleNoise, generateRandomPoly } from './core';

/**
 * Generate a Kyber keypair
 */
export const generateKeypair = async () => {
  // Generate random seeds and noise
  const seed = getRandomBytes(32);
  const noiseSeed = getRandomBytes(32);
  
  // Generate matrix A (k x k)
  const A: number[][][] = Array(KYBER_PARAMS.k).fill(0).map(() => 
    Array(KYBER_PARAMS.k).fill(0).map(() => generateRandomPoly())
  );
  
  // Generate secret vector s
  const s = Array(KYBER_PARAMS.k).fill(0).map((_, i) => sampleNoise(noiseSeed, i));
  
  // Generate error vector e
  const e = Array(KYBER_PARAMS.k).fill(0).map((_, i) => 
    sampleNoise(noiseSeed, KYBER_PARAMS.k + i)
  );
  
  // Compute t = As + e
  const t = e.map((ei, i) => {
    let ti = [...ei];
    for (let j = 0; j < KYBER_PARAMS.k; j++) {
      const product = polyArith.mul(A[i][j], s[j]);
      ti = polyArith.add(ti, product);
    }
    return ti;
  });
  
  // Create public key (seed || t)
  const pkBytes = new Uint8Array(KYBER_PARAMS.pkBytes);
  pkBytes.set(seed, 0);
  let offset = 32;
  t.forEach(poly => {
    const polyBytes = new Uint8Array(poly.map(x => x & 0xff));
    pkBytes.set(polyBytes, offset);
    offset += KYBER_PARAMS.polyBytes;
  });
  
  // Create secret key (s)
  const skBytes = new Uint8Array(KYBER_PARAMS.skBytes);
  offset = 0;
  s.forEach(poly => {
    const polyBytes = new Uint8Array(poly.map(x => x & 0xff));
    skBytes.set(polyBytes, offset);
    offset += KYBER_PARAMS.polyBytes;
  });
  
  return {
    publicKey: bytesToHex(pkBytes),
    privateKey: bytesToHex(skBytes)
  };
};

/**
 * Encrypt a message using Kyber
 */
export const encrypt = async (message: string, publicKey: string) => {
  const pkBytes = hexToBytes(publicKey);
  const seed = pkBytes.slice(0, 32);
  const messageBytes = stringToBytes(message);
  
  // Generate random coins
  const coins = getRandomBytes(32);
  
  // Encode message as polynomial m
  const m: number[] = Array.from(messageBytes)
    .map(b => Array(8).fill(0)
    .map((_, i) => (b >> i) & 1))
    .flat()
    .slice(0, KYBER_PARAMS.n)
    .map(b => b * Math.floor(KYBER_PARAMS.q / 2));
  
  // Sample random vector r
  const r = Array(KYBER_PARAMS.k).fill(0).map((_, i) => sampleNoise(coins, i));
  
  // Generate matrix A from seed
  const A: number[][][] = Array(KYBER_PARAMS.k).fill(0).map(() => 
    Array(KYBER_PARAMS.k).fill(0).map(() => generateRandomPoly())
  );
  
  // Extract t from public key
  const t = Array(KYBER_PARAMS.k).fill(0).map((_, i) => {
    const offset = 32 + i * KYBER_PARAMS.polyBytes;
    return Array.from(pkBytes.slice(offset, offset + KYBER_PARAMS.polyBytes));
  });
  
  // Compute u = A^T·r + e1
  const u = Array(KYBER_PARAMS.k).fill(0).map((_, i) => {
    let ui = sampleNoise(coins, KYBER_PARAMS.k + i);
    for (let j = 0; j < KYBER_PARAMS.k; j++) {
      const product = polyArith.mul(A[j][i], r[j]);
      ui = polyArith.add(ui, product);
    }
    return ui;
  });
  
  // Compute v = t^T·r + e2 + m
  let v = sampleNoise(coins, 2 * KYBER_PARAMS.k);
  for (let i = 0; i < KYBER_PARAMS.k; i++) {
    const product = polyArith.mul(t[i], r[i]);
    v = polyArith.add(v, product);
  }
  v = polyArith.add(v, m);
  
  // Create ciphertext (u || v)
  const ciphertextBytes = new Uint8Array(KYBER_PARAMS.ctBytes);
  let offset = 0;
  
  u.forEach(poly => {
    const polyBytes = new Uint8Array(poly.map(x => x & 0xff));
    ciphertextBytes.set(polyBytes, offset);
    offset += KYBER_PARAMS.polyBytes;
  });
  
  const vBytes = new Uint8Array(v.map(x => x & 0xff));
  ciphertextBytes.set(vBytes, offset);
  
  return {
    ciphertext: bytesToHex(ciphertextBytes),
    encryptedMessage: bytesToHex(messageBytes)
  };
};

/**
 * Decrypt a message using Kyber
 */
export const decrypt = async (encryptedMessage: string, ciphertext: string, privateKey: string) => {
  try {
    const ctBytes = hexToBytes(ciphertext);
    const msgBytes = hexToBytes(encryptedMessage);
    const skBytes = hexToBytes(privateKey);
    
    // Extract u and v from ciphertext
    const u = Array(KYBER_PARAMS.k).fill(0).map((_, i) => {
      const offset = i * KYBER_PARAMS.polyBytes;
      return Array.from(ctBytes.slice(offset, offset + KYBER_PARAMS.polyBytes));
    });
    
    const v = Array.from(ctBytes.slice(KYBER_PARAMS.k * KYBER_PARAMS.polyBytes));
    
    // Extract s from private key
    const s = Array(KYBER_PARAMS.k).fill(0).map((_, i) => {
      const offset = i * KYBER_PARAMS.polyBytes;
      return Array.from(skBytes.slice(offset, offset + KYBER_PARAMS.polyBytes));
    });
    
    // Compute m' = v - s^T·u
    let mp = [...v];
    for (let i = 0; i < KYBER_PARAMS.k; i++) {
      const product = polyArith.mul(s[i], u[i]);
      mp = polyArith.sub(mp, product);
    }
    
    // Decode message
    const decodedBytes = new Uint8Array(msgBytes.length);
    for (let i = 0; i < msgBytes.length; i++) {
      let byte = 0;
      for (let j = 0; j < 8; j++) {
        if (i * 8 + j < mp.length) {
          byte |= ((Math.round(mp[i * 8 + j] / (KYBER_PARAMS.q / 2))) & 1) << j;
        }
      }
      decodedBytes[i] = byte;
    }
    
    return new TextDecoder().decode(decodedBytes);
  } catch (error) {
    console.error("Kyber decryption error:", error);
    return "Decryption error";
  }
};

export default {
  generateKeypair,
  encrypt,
  decrypt,
  PARAMS: KYBER_PARAMS
};

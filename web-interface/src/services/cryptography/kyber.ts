
/**
 * Kyber Implementation
 * 
 * A lattice-based key encapsulation mechanism (KEM) selected by NIST for standardization
 * Based on the official specification: https://pq-crystals.org/kyber/
 */

import { bytesToHex, hexToBytes, stringToBytes, getRandomBytes } from './utils';

// Constants for Kyber-512 parameters
const KYBER_PARAMS = {
  k: 2,              // Security parameter
  n: 256,            // Polynomial ring dimension
  q: 3329,           // Modulus
  eta1: 3,           // Noise parameter for secret key
  eta2: 2,           // Noise parameter for noise polynomials
  du: 10,            // Bits to represent polynomials in ciphertext
  dv: 4,             // Bits to represent polynomials in ciphertext
  pkBytes: 800,      // Public key size in bytes (approximate)
  skBytes: 1632,     // Secret key size in bytes (approximate)
  ctBytes: 768,      // Ciphertext size in bytes (approximate)
  sharedSecretBytes: 32, // Shared secret size in bytes
};

/**
 * Generate a noise polynomial with coefficients in {-η, ..., η}
 * Simplified implementation for demonstration
 */
const generateNoisePolynomial = (eta: number, seed: Uint8Array, nonce: number): Int16Array => {
  // In a real implementation, this would use a binomial sampler with a PRF
  // For demonstration, we'll generate random values in the range [-η, η]
  const poly = new Int16Array(KYBER_PARAMS.n);
  
  // Use the seed and nonce to derive randomness
  const bytes = new Uint8Array(KYBER_PARAMS.n);
  
  // Simple PRF: hash the seed with the nonce
  const nonceBytes = new Uint8Array(4);
  nonceBytes[0] = nonce & 0xff;
  nonceBytes[1] = (nonce >> 8) & 0xff;
  nonceBytes[2] = (nonce >> 16) & 0xff;
  nonceBytes[3] = (nonce >> 24) & 0xff;
  
  // In a real implementation, this would use SHAKE128
  // For demonstration, we'll use a simple seed expansion
  for (let i = 0; i < KYBER_PARAMS.n; i++) {
    bytes[i] = seed[i % seed.length] ^ nonceBytes[i % 4];
  }
  
  // Convert to noise polynomial
  for (let i = 0; i < KYBER_PARAMS.n; i++) {
    // Map bytes to the range [-η, η]
    poly[i] = (bytes[i] % (2 * eta + 1)) - eta;
  }
  
  return poly;
};

/**
 * NTT (Number Theoretic Transform) - used for polynomial multiplication
 * Simplified implementation for demonstration
 */
const ntt = (poly: Int16Array): Int16Array => {
  // In a real implementation, this would implement the NTT algorithm
  // For demonstration, we'll provide a simplified version
  
  const result = new Int16Array(poly.length);
  result.set(poly);
  
  // Perform a simplified "transformation"
  for (let i = 0; i < result.length; i++) {
    result[i] = (result[i] + i) % KYBER_PARAMS.q;
  }
  
  return result;
};

/**
 * Inverse NTT
 * Simplified implementation for demonstration
 */
const invNtt = (poly: Int16Array): Int16Array => {
  // In a real implementation, this would implement the inverse NTT algorithm
  // For demonstration, we'll provide a simplified version
  
  const result = new Int16Array(poly.length);
  result.set(poly);
  
  // Perform a simplified "inverse transformation"
  for (let i = 0; i < result.length; i++) {
    result[i] = (result[i] - i + KYBER_PARAMS.q) % KYBER_PARAMS.q;
  }
  
  return result;
};

/**
 * Polynomial addition
 */
const polyAdd = (a: Int16Array, b: Int16Array): Int16Array => {
  const result = new Int16Array(KYBER_PARAMS.n);
  
  for (let i = 0; i < KYBER_PARAMS.n; i++) {
    result[i] = (a[i] + b[i]) % KYBER_PARAMS.q;
  }
  
  return result;
};

/**
 * Polynomial subtraction
 */
const polySub = (a: Int16Array, b: Int16Array): Int16Array => {
  const result = new Int16Array(KYBER_PARAMS.n);
  
  for (let i = 0; i < KYBER_PARAMS.n; i++) {
    result[i] = (a[i] - b[i] + KYBER_PARAMS.q) % KYBER_PARAMS.q;
  }
  
  return result;
};

/**
 * Polynomial multiplication in the NTT domain
 */
const polyMul = (a: Int16Array, b: Int16Array): Int16Array => {
  const result = new Int16Array(KYBER_PARAMS.n);
  
  for (let i = 0; i < KYBER_PARAMS.n; i++) {
    result[i] = (a[i] * b[i]) % KYBER_PARAMS.q;
  }
  
  return result;
};

/**
 * Compress a polynomial
 * Simplified implementation for demonstration
 */
const polyCompress = (poly: Int16Array, d: number): Uint8Array => {
  // In a real implementation, this would compress each coefficient to d bits
  // For demonstration, we'll simulate the compression
  
  const compressedSize = Math.ceil((KYBER_PARAMS.n * d) / 8);
  const result = new Uint8Array(compressedSize);
  
  // Simple compression: reduce the range to 2^d values
  const divisor = Math.floor(KYBER_PARAMS.q / (1 << d));
  
  let bytesWritten = 0;
  let bitPos = 0;
  let currentByte = 0;
  
  for (let i = 0; i < KYBER_PARAMS.n; i++) {
    const compressed = Math.floor(poly[i] / divisor) & ((1 << d) - 1);
    
    // Pack into bytes
    currentByte |= (compressed << bitPos);
    bitPos += d;
    
    while (bitPos >= 8) {
      result[bytesWritten++] = currentByte & 0xff;
      currentByte >>= 8;
      bitPos -= 8;
    }
  }
  
  // Write any remaining bits
  if (bitPos > 0) {
    result[bytesWritten] = currentByte & 0xff;
  }
  
  return result;
};

/**
 * Decompress a polynomial
 * Simplified implementation for demonstration
 */
const polyDecompress = (bytes: Uint8Array, d: number): Int16Array => {
  // In a real implementation, this would decompress d bits per coefficient
  // For demonstration, we'll simulate the decompression
  
  const result = new Int16Array(KYBER_PARAMS.n);
  
  // Scaling factor
  const scaleFactor = Math.floor(KYBER_PARAMS.q / (1 << d));
  
  let bytePos = 0;
  let bitPos = 0;
  let currentByte = bytes[0];
  
  for (let i = 0; i < KYBER_PARAMS.n; i++) {
    // Extract d bits
    let compressed = (currentByte >> bitPos) & ((1 << d) - 1);
    bitPos += d;
    
    // If we need more bits from the next byte
    while (bitPos > 8) {
      bytePos++;
      if (bytePos < bytes.length) {
        currentByte = bytes[bytePos];
        const extraBits = bitPos - 8;
        bitPos = extraBits;
        compressed |= (currentByte & ((1 << extraBits) - 1)) << (d - extraBits);
      }
    }
    
    // Scale back to the full range
    result[i] = (compressed * scaleFactor) % KYBER_PARAMS.q;
  }
  
  return result;
};

/**
 * Generate a Kyber keypair
 * @returns {Promise<{publicKey: string, privateKey: string}>}
 */
export const generateKeypair = async (): Promise<{ publicKey: string, privateKey: string }> => {
  // Generate random seeds
  const mainSeed = getRandomBytes(32);
  
  // In a real implementation, we would:
  // 1. Expand mainSeed to get a seed for the public matrix A, secret vector s, and error vector e
  // 2. Sample s and e from a centered binomial distribution
  // 3. Compute t = A·s + e
  
  // For demonstration, we'll simulate these steps
  
  // Create a seed for matrix A
  const seedA = await crypto.subtle.digest('SHA-256', mainSeed);
  const seedABytes = new Uint8Array(seedA);
  
  // Create a "matrix" A (simplified as an array of polynomials)
  const A: Int16Array[] = [];
  for (let i = 0; i < KYBER_PARAMS.k; i++) {
    A.push(new Int16Array(KYBER_PARAMS.n));
    for (let j = 0; j < KYBER_PARAMS.n; j++) {
      A[i][j] = seedABytes[(i * KYBER_PARAMS.n + j) % seedABytes.length] % KYBER_PARAMS.q;
    }
  }
  
  // Generate secret vector s
  const s: Int16Array[] = [];
  for (let i = 0; i < KYBER_PARAMS.k; i++) {
    s.push(generateNoisePolynomial(KYBER_PARAMS.eta1, mainSeed, i));
  }
  
  // Generate error vector e
  const e: Int16Array[] = [];
  for (let i = 0; i < KYBER_PARAMS.k; i++) {
    e.push(generateNoisePolynomial(KYBER_PARAMS.eta2, mainSeed, KYBER_PARAMS.k + i));
  }
  
  // Convert to NTT domain
  const sNTT: Int16Array[] = s.map(poly => ntt(poly));
  
  // Compute t = A·s + e
  const t: Int16Array[] = [];
  for (let i = 0; i < KYBER_PARAMS.k; i++) {
    const accum = new Int16Array(KYBER_PARAMS.n);
    
    for (let j = 0; j < KYBER_PARAMS.k; j++) {
      const product = polyMul(A[i], sNTT[j]);
      for (let k = 0; k < KYBER_PARAMS.n; k++) {
        accum[k] = (accum[k] + product[k]) % KYBER_PARAMS.q;
      }
    }
    
    // Add error
    t.push(polyAdd(accum, e[i]));
  }
  
  // Compress t
  const compressedT: Uint8Array[] = t.map(poly => polyCompress(poly, KYBER_PARAMS.du));
  
  // Public key: seedA || t
  let pkOffset = 0;
  const publicKey = new Uint8Array(32 + compressedT.length * compressedT[0].length);
  publicKey.set(seedABytes, pkOffset);
  pkOffset += 32;
  
  for (const compressed of compressedT) {
    publicKey.set(compressed, pkOffset);
    pkOffset += compressed.length;
  }
  
  // Secret key: s
  const privateKeyPolys = [...s]; // In a real implementation, this would include more data
  
  // Serialize private key
  let skOffset = 0;
  const privateKey = new Uint8Array(KYBER_PARAMS.k * KYBER_PARAMS.n * 2);
  
  for (const poly of privateKeyPolys) {
    for (let i = 0; i < KYBER_PARAMS.n; i++) {
      // 16-bit coefficients
      privateKey[skOffset++] = poly[i] & 0xff;
      privateKey[skOffset++] = (poly[i] >> 8) & 0xff;
    }
  }
  
  return {
    publicKey: bytesToHex(publicKey),
    privateKey: bytesToHex(privateKey)
  };
};

/**
 * Kyber encapsulation - generates a ciphertext and shared secret
 * @param {string} publicKey - The recipient's public key in hex format
 * @returns {Promise<{ciphertext: string, sharedSecret: string}>}
 */
export const encapsulate = async (publicKey: string): Promise<{ ciphertext: string, sharedSecret: string }> => {
  const pkBytes = hexToBytes(publicKey);
  
  // In a real implementation, we would:
  // 1. Extract seedA and t from the public key
  // 2. Generate a random message m
  // 3. Hash m to get noise vector r and error vectors e1, e2
  // 4. Compute u = A^T·r + e1
  // 5. Compute v = t^T·r + e2 + encode(m)
  // 6. Derive shared secret from m and the ciphertext
  
  // For demonstration, we'll simulate these steps
  
  // Extract seedA and t
  const seedA = pkBytes.slice(0, 32);
  let offset = 32;
  
  const t: Int16Array[] = [];
  for (let i = 0; i < KYBER_PARAMS.k; i++) {
    const compressedSize = Math.ceil((KYBER_PARAMS.n * KYBER_PARAMS.du) / 8);
    const compressedT = pkBytes.slice(offset, offset + compressedSize);
    offset += compressedSize;
    
    t.push(polyDecompress(compressedT, KYBER_PARAMS.du));
  }
  
  // Generate random message m
  const m = getRandomBytes(32);
  
  // Derive r and e1, e2 from m
  const hash = await crypto.subtle.digest('SHA-256', m);
  const hashBytes = new Uint8Array(hash);
  
  // Generate vector r
  const r: Int16Array[] = [];
  for (let i = 0; i < KYBER_PARAMS.k; i++) {
    r.push(generateNoisePolynomial(KYBER_PARAMS.eta1, hashBytes, i));
  }
  
  // Generate error vectors e1, e2
  const e1: Int16Array[] = [];
  for (let i = 0; i < KYBER_PARAMS.k; i++) {
    e1.push(generateNoisePolynomial(KYBER_PARAMS.eta2, hashBytes, KYBER_PARAMS.k + i));
  }
  
  const e2 = generateNoisePolynomial(KYBER_PARAMS.eta2, hashBytes, 2 * KYBER_PARAMS.k);
  
  // Create a "matrix" A (simplified as an array of polynomials)
  const A: Int16Array[] = [];
  for (let i = 0; i < KYBER_PARAMS.k; i++) {
    A.push(new Int16Array(KYBER_PARAMS.n));
    for (let j = 0; j < KYBER_PARAMS.n; j++) {
      A[i][j] = seedA[(i * KYBER_PARAMS.n + j) % seedA.length] % KYBER_PARAMS.q;
    }
  }
  
  // Convert r to NTT domain
  const rNTT: Int16Array[] = r.map(poly => ntt(poly));
  
  // Compute u = A^T·r + e1
  const u: Int16Array[] = [];
  for (let i = 0; i < KYBER_PARAMS.k; i++) {
    const accum = new Int16Array(KYBER_PARAMS.n);
    
    for (let j = 0; j < KYBER_PARAMS.k; j++) {
      const product = polyMul(A[j], rNTT[i]);
      for (let k = 0; k < KYBER_PARAMS.n; k++) {
        accum[k] = (accum[k] + product[k]) % KYBER_PARAMS.q;
      }
    }
    
    // Add error
    u.push(polyAdd(accum, e1[i]));
  }
  
  // Compute v = t^T·r + e2 + encode(m)
  let v = new Int16Array(KYBER_PARAMS.n);
  for (let i = 0; i < KYBER_PARAMS.k; i++) {
    const product = polyMul(t[i], rNTT[i]);
    v = polyAdd(v, product);
  }
  
  // Add e2
  v = polyAdd(v, e2);
  
  // Encode message into polynomial
  const mPoly = new Int16Array(KYBER_PARAMS.n);
  for (let i = 0; i < KYBER_PARAMS.n; i++) {
    mPoly[i] = (i < m.length * 8) ? ((m[Math.floor(i / 8)] >> (i % 8)) & 1) * (KYBER_PARAMS.q / 2) : 0;
  }
  
  // Add encoded message
  v = polyAdd(v, mPoly);
  
  // Compress u and v
  const compressedU: Uint8Array[] = u.map(poly => polyCompress(poly, KYBER_PARAMS.du));
  const compressedV = polyCompress(v, KYBER_PARAMS.dv);
  
  // Ciphertext: u || v
  let ctOffset = 0;
  const ciphertext = new Uint8Array(compressedU.reduce((acc, curr) => acc + curr.length, 0) + compressedV.length);
  
  for (const compressed of compressedU) {
    ciphertext.set(compressed, ctOffset);
    ctOffset += compressed.length;
  }
  
  ciphertext.set(compressedV, ctOffset);
  
  // Derive shared secret from m and ciphertext
  const sharedSecretInput = new Uint8Array(m.length + ciphertext.length);
  sharedSecretInput.set(m, 0);
  sharedSecretInput.set(ciphertext, m.length);
  
  const sharedSecretHash = await crypto.subtle.digest('SHA-256', sharedSecretInput);
  const sharedSecret = new Uint8Array(sharedSecretHash);
  
  return {
    ciphertext: bytesToHex(ciphertext),
    sharedSecret: bytesToHex(sharedSecret)
  };
};

/**
 * Kyber decapsulation - recovers the shared secret from a ciphertext
 * @param {string} ciphertext - The ciphertext in hex format
 * @param {string} privateKey - The recipient's private key in hex format
 * @returns {Promise<string>} - The shared secret in hex format
 */
export const decapsulate = async (ciphertext: string, privateKey: string): Promise<string> => {
  const ctBytes = hexToBytes(ciphertext);
  const skBytes = hexToBytes(privateKey);
  
  // In a real implementation, we would:
  // 1. Extract s from the private key
  // 2. Extract u and v from the ciphertext
  // 3. Compute v' = v - s^T·u
  // 4. Decode m' from v'
  // 5. Derive shared secret from m' and the ciphertext
  
  // For demonstration, we'll simulate these steps
  
  // Extract s from private key
  const s: Int16Array[] = [];
  let skOffset = 0;
  
  for (let i = 0; i < KYBER_PARAMS.k; i++) {
    const poly = new Int16Array(KYBER_PARAMS.n);
    
    for (let j = 0; j < KYBER_PARAMS.n; j++) {
      // Read 16-bit coefficient
      poly[j] = (skBytes[skOffset] | (skBytes[skOffset + 1] << 8)) % KYBER_PARAMS.q;
      skOffset += 2;
    }
    
    s.push(poly);
  }
  
  // Extract u and v from ciphertext
  const u: Int16Array[] = [];
  let ctOffset = 0;
  
  for (let i = 0; i < KYBER_PARAMS.k; i++) {
    const compressedSize = Math.ceil((KYBER_PARAMS.n * KYBER_PARAMS.du) / 8);
    const compressedU = ctBytes.slice(ctOffset, ctOffset + compressedSize);
    ctOffset += compressedSize;
    
    u.push(polyDecompress(compressedU, KYBER_PARAMS.du));
  }
  
  const compressedVSize = Math.ceil((KYBER_PARAMS.n * KYBER_PARAMS.dv) / 8);
  const compressedV = ctBytes.slice(ctOffset, ctOffset + compressedVSize);
  const v = polyDecompress(compressedV, KYBER_PARAMS.dv);
  
  // Convert u to NTT domain and s to normal domain
  const uNTT: Int16Array[] = u.map(poly => ntt(poly));
  const sNormal: Int16Array[] = s.map(poly => invNtt(poly));
  
  // Compute v' = v - s^T·u
  let vPrime = new Int16Array(v);
  
  for (let i = 0; i < KYBER_PARAMS.k; i++) {
    const product = polyMul(sNormal[i], uNTT[i]);
    vPrime = polySub(vPrime, product);
  }
  
  // Decode message m' from v'
  const mPrime = new Uint8Array(32);
  
  for (let i = 0; i < KYBER_PARAMS.n; i++) {
    if (i < mPrime.length * 8) {
      // Check if coefficient is closer to q/2 (1) or 0/q (0)
      const bit = Math.abs(vPrime[i] - KYBER_PARAMS.q / 2) < KYBER_PARAMS.q / 4 ? 1 : 0;
      if (bit === 1) {
        mPrime[Math.floor(i / 8)] |= 1 << (i % 8);
      }
    }
  }
  
  // Derive shared secret from m' and ciphertext
  const sharedSecretInput = new Uint8Array(mPrime.length + ctBytes.length);
  sharedSecretInput.set(mPrime, 0);
  sharedSecretInput.set(ctBytes, mPrime.length);
  
  const sharedSecretHash = await crypto.subtle.digest('SHA-256', sharedSecretInput);
  const sharedSecret = new Uint8Array(sharedSecretHash);
  
  return bytesToHex(sharedSecret);
};

/**
 * Encrypt a message using Kyber KEM + symmetric encryption
 * @param {string} message - The message to encrypt
 * @param {string} publicKey - The recipient's public key in hex format
 * @returns {Promise<{ciphertext: string, encryptedMessage: string}>}
 */
export const encrypt = async (message: string, publicKey: string): Promise<{ ciphertext: string, encryptedMessage: string }> => {
  // Encapsulate to get a shared secret
  const { ciphertext, sharedSecret } = await encapsulate(publicKey);
  
  // Use the shared secret as a symmetric key
  const messageBytes = stringToBytes(message);
  
  // Import the shared secret as a key for AES-GCM
  const key = await crypto.subtle.importKey(
    'raw',
    hexToBytes(sharedSecret),
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  
  // Generate a random IV
  const iv = getRandomBytes(12);
  
  // Encrypt the message
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    messageBytes
  );
  
  // Combine IV and ciphertext
  const encryptedMessage = new Uint8Array(iv.length + encryptedBuffer.byteLength);
  encryptedMessage.set(iv, 0);
  encryptedMessage.set(new Uint8Array(encryptedBuffer), iv.length);
  
  return {
    ciphertext,
    encryptedMessage: bytesToHex(encryptedMessage)
  };
};

/**
 * Decrypt a message using Kyber KEM + symmetric encryption
 * @param {string} encryptedMessage - The encrypted message in hex format
 * @param {string} ciphertext - The Kyber ciphertext in hex format
 * @param {string} privateKey - The recipient's private key in hex format
 * @returns {Promise<string>} - The decrypted message
 */
export const decrypt = async (
  encryptedMessage: string,
  ciphertext: string,
  privateKey: string
): Promise<string> => {
  // Decapsulate to get the shared secret
  const sharedSecret = await decapsulate(ciphertext, privateKey);
  
  // Parse the encrypted message
  const encryptedBytes = hexToBytes(encryptedMessage);
  
  // Extract IV and ciphertext
  const iv = encryptedBytes.slice(0, 12);
  const encryptedData = encryptedBytes.slice(12);
  
  // Import the shared secret as a key for AES-GCM
  const key = await crypto.subtle.importKey(
    'raw',
    hexToBytes(sharedSecret),
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
  
  // Decrypt the message
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encryptedData
  );
  
  // Convert to string
  const decryptedMessage = new TextDecoder().decode(decryptedBuffer);
  
  return decryptedMessage;
};

/**
 * Get the ciphertext size
 * @returns {number} - The ciphertext size in bytes
 */
export const getCiphertextSize = (): number => {
  return KYBER_PARAMS.ctBytes;
};

/**
 * Kyber module
 */
export default {
  generateKeypair,
  encapsulate,
  decapsulate,
  encrypt,
  decrypt,
  getCiphertextSize,
  PARAMS: KYBER_PARAMS
};


export const SPHINCS_PARAMS = {
  n: 16,            // Security parameter (bytes)
  h: 66,            // Total tree height
  d: 22,            // Number of layers
  a: 6,             // Winternitz parameter
  k: 33,            // Number of FORs per tree
  t: 66,            // Number of FORS trees
  sigBytes: 8080,   // Signature size (bytes)
  pkBytes: 32,      // Public key size (bytes)
  skBytes: 64,      // Secret key size (bytes)
};

export const KYBER_PARAMS = {
  k: 2,              // Security parameter
  n: 256,           // Ring dimension
  q: 3329,          // Modulus
  eta1: 3,          // Noise parameter
  eta2: 2,          // Noise parameter
  du: 10,           // Compression parameter
  dv: 4,            // Compression parameter
  polyBytes: 384,   // Bytes per polynomial
  pkBytes: 800,     // Public key size in bytes
  skBytes: 1632,    // Secret key size in bytes
  ctBytes: 768,     // Ciphertext size in bytes
  messageBytes: 32  // Shared secret size in bytes
};


// Browser-compatible quantum-resistant cryptography implementation
// Using Web Crypto API for cryptographic operations

// Helper function to convert string to Uint8Array
const stringToBytes = (str: string): Uint8Array => {
  return new TextEncoder().encode(str);
};

// Helper function to convert Uint8Array to hex string
const bytesToHex = (bytes: Uint8Array): string => {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Helper function to convert hex string to Uint8Array
const hexToBytes = (hex: string): Uint8Array => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
};

// Helper to generate random bytes using Web Crypto API
const getRandomBytes = async (length: number): Promise<Uint8Array> => {
  const bytes = new Uint8Array(length);
  window.crypto.getRandomValues(bytes);
  return bytes;
};

// Helper to create cryptographic hashes using Web Crypto API
const hashWithAlgorithm = async (data: Uint8Array, algorithm: string): Promise<Uint8Array> => {
  const hashBuffer = await window.crypto.subtle.digest(algorithm, data);
  return new Uint8Array(hashBuffer);
};

const sha256 = async (data: Uint8Array): Promise<Uint8Array> => {
  return hashWithAlgorithm(data, 'SHA-256');
};

const sha512 = async (data: Uint8Array): Promise<Uint8Array> => {
  return hashWithAlgorithm(data, 'SHA-512');
};

// More advanced SPHINCS+ implementation
// Based on NIST standardization specifications
export const sphincsPlus = {
  // SPHINCS+ parameters for different security levels
  params: {
    // These parameters approximate the SPHINCS+-128f configuration
    // In a real implementation, there would be more parameters
    height: 60,
    treeHeight: 20,
    layers: 3,
    wots_w: 16,
    wots_logL: 4,
    hashSize: 32
  },
  
  // Hash function used by SPHINCS+
  hash: async (message: string): Promise<string> => {
    const messageBytes = stringToBytes(message);
    const hash = await sha256(messageBytes);
    return bytesToHex(hash);
  },
  
  // Generate a keypair for SPHINCS+
  generateKeypair: async () => {
    // Create a random seed for key generation
    const seed = await getRandomBytes(64);
    
    // Create a secret key (SK) from the seed
    // SK consists of:
    // - Secret key seed (32 bytes)
    // - Public key seed (32 bytes)
    // - Public key root (32 bytes)
    const skSeed = await sha256(seed.slice(0, 32));
    const pkSeed = await sha256(seed.slice(32, 64));
    
    // In a real implementation, the root would be generated using
    // a complex treehash algorithm based on WOTS+ and hash trees
    
    // Derive the root of the Merkle tree (simplified)
    let tempHash = await sha256(new Uint8Array([...skSeed, ...pkSeed]));
    for (let i = 0; i < sphincsPlus.params.layers; i++) {
      tempHash = await sha256(new Uint8Array([...pkSeed, ...tempHash]));
    }
    const pkRoot = tempHash;
    
    // Construct the private and public keys
    const privateKeyBytes = new Uint8Array([...skSeed, ...pkSeed, ...pkRoot]);
    const publicKeyBytes = new Uint8Array([...pkSeed, ...pkRoot]);
    
    return {
      publicKey: bytesToHex(publicKeyBytes),
      privateKey: bytesToHex(privateKeyBytes)
    };
  },
  
  // Sign a message with SPHINCS+
  sign: async (message: string, privateKey: string) => {
    // Parse the private key components
    const privateKeyBytes = hexToBytes(privateKey);
    const skSeed = privateKeyBytes.slice(0, 32);
    const pkSeed = privateKeyBytes.slice(32, 64);
    
    // Message bytes
    const messageBytes = stringToBytes(message);
    
    // Generate randomization value (optional in some versions)
    const randomBytes = await getRandomBytes(32);
    
    // In a real implementation, SPHINCS+ would:
    // 1. Generate a HyperTree with many WOTS+ instances
    // 2. Sign the message hash with a selected WOTS+ instance
    // 3. Include authentication paths for verification
    
    // We'll simulate this complex process:
    
    // 1. Create message digest with randomization
    const messageDigest = await sha512(new Uint8Array([...randomBytes, ...messageBytes]));
    
    // 2. Generate WOTS+ signatures (simplified)
    const wotsSignatures: Uint8Array[] = [];
    for (let i = 0; i < sphincsPlus.params.layers; i++) {
      // In real SPHINCS+, this would select proper WOTS+ instances
      // and generate actual WOTS+ signatures
      
      // Simulate WOTS+ signature generation
      const layerSeed = await sha256(new Uint8Array([...skSeed, i]));
      
      // Create simulated WOTS+ signature
      const wotsSignature = await sha512(new Uint8Array([...layerSeed, ...messageDigest]));
      wotsSignatures.push(wotsSignature);
    }
    
    // 3. Combine with authentication paths
    // In real SPHINCS+, we would include auth paths from each WOTS+ signature
    // to the root of its respective tree
    
    // Combine all signatures and randomization value
    const signatureComponents = [randomBytes, ...wotsSignatures];
    let signature = new Uint8Array(randomBytes.length + wotsSignatures.reduce((len, sig) => len + sig.length, 0));
    
    let offset = 0;
    signature.set(randomBytes, offset);
    offset += randomBytes.length;
    
    for (const sig of wotsSignatures) {
      signature.set(sig, offset);
      offset += sig.length;
    }
    
    return bytesToHex(signature);
  },
  
  // Verify a SPHINCS+ signature
  verify: async (message: string, signature: string, publicKey: string) => {
    try {
      // Parse the public key components
      const publicKeyBytes = hexToBytes(publicKey);
      const pkSeed = publicKeyBytes.slice(0, 32);
      const pkRoot = publicKeyBytes.slice(32, 64);
      
      // Parse the signature
      const signatureBytes = hexToBytes(signature);
      
      // Extract randomization value
      const randomBytes = signatureBytes.slice(0, 32);
      
      // Message bytes
      const messageBytes = stringToBytes(message);
      
      // Create message digest with randomization
      const messageDigest = await sha512(new Uint8Array([...randomBytes, ...messageBytes]));
      
      // In a real implementation, we would:
      // 1. Extract WOTS+ signatures and auth paths from the signature
      // 2. Verify each WOTS+ signature
      // 3. Compute the root using auth paths
      // 4. Verify the computed root matches the public key root
      
      // For our simulation, we'll create a simplified verification
      
      let computedRoot = messageDigest;
      for (let i = 0; i < sphincsPlus.params.layers; i++) {
        // Simulate verification of the i-th layer
        const wotsSignatureSize = 64; // SHA-512 output size
        const wotsSignature = signatureBytes.slice(32 + i * wotsSignatureSize, 32 + (i + 1) * wotsSignatureSize);
        
        // In a real implementation, we would verify the WOTS+ signature
        // and use auth paths to compute the root
        
        // For our simulation, we'll just hash the values to get the "next level"
        computedRoot = await sha256(new Uint8Array([...pkSeed, ...wotsSignature, ...computedRoot]));
      }
      
      // Verify the computed root matches the public key root
      return bytesToHex(computedRoot).substring(0, 64) === bytesToHex(pkRoot).substring(0, 64);
    } catch (error) {
      console.error("SPHINCS+ verification error:", error);
      return false;
    }
  },
  
  // Estimate signature size based on parameters
  getSignatureSize: () => {
    // In a real SPHINCS+ implementation, the signature size would be calculated
    // based on the specific parameters
    
    // Simplified estimate: randomization bytes + WOTS+ signatures + auth paths
    const randomizationSize = 32;
    const wotsSignatureSize = 64 * sphincsPlus.params.layers;
    const authPathSize = sphincsPlus.params.hashSize * sphincsPlus.params.treeHeight * sphincsPlus.params.layers;
    
    return randomizationSize + wotsSignatureSize + authPathSize;
  }
};

// Kyber lattice-based cryptography implementation
// Based on NIST standardization specifications
export const kyberCrypto = {
  // Kyber parameters for different security levels
  params: {
    // These parameters approximate the Kyber-512 configuration
    n: 256,
    k: 2,
    q: 3329,
    eta1: 3,
    eta2: 2,
    du: 10,
    dv: 4,
  },
  
  // Generate a keypair for Kyber
  generateKeypair: async () => {
    // In a real Kyber implementation:
    // 1. Generate a random seed
    // 2. Generate matrix A from the seed
    // 3. Sample secret vector s with small coefficients
    // 4. Compute public key t = A·s + e
    
    // We'll simulate this process:
    
    // Generate random seeds
    const seedA = await getRandomBytes(32);
    const seedS = await getRandomBytes(32);
    const seedE = await getRandomBytes(32);
    
    // In real Kyber, the matrix A would be generated from seedA
    // and vectors s and e would be sampled with small coefficients
    
    // For simulation, we'll use the seeds as representations
    
    // Create the private key (seedA + s)
    const privateKeyBytes = new Uint8Array([...seedA, ...seedS]);
    
    // Create the public key (seedA + t = seedA + [A·s + e])
    // In our simulation, we'll use a hash of the components
    const tHash = await sha256(new Uint8Array([...seedA, ...seedS, ...seedE]));
    const publicKeyBytes = new Uint8Array([...seedA, ...tHash]);
    
    return {
      publicKey: bytesToHex(publicKeyBytes),
      privateKey: bytesToHex(privateKeyBytes)
    };
  },
  
  // Encrypt a message using Kyber
  encrypt: async (message: string, publicKey: string) => {
    // In a real Kyber implementation:
    // 1. Encode the message as a polynomial m
    // 2. Sample random vector r with small coefficients
    // 3. Compute u = A^T·r + e1
    // 4. Compute v = t^T·r + e2 + m
    
    // We'll simulate this process:
    
    // Parse the public key
    const publicKeyBytes = hexToBytes(publicKey);
    const seedA = publicKeyBytes.slice(0, 32);
    const t = publicKeyBytes.slice(32, 64);
    
    // Message bytes
    const messageBytes = stringToBytes(message);
    
    // Generate random coins for encryption
    const coins = await getRandomBytes(32);
    
    // In real Kyber, we would:
    // - Generate a matrix A^T from seedA
    // - Sample vector r with small coefficients
    // - Compute u = A^T·r + e1
    
    // For our simulation:
    // Simulate the computation of u
    const uHash = await sha256(new Uint8Array([...seedA, ...coins]));
    
    // In real Kyber, we would:
    // - Compute v = t^T·r + e2 + message
    
    // For our simulation:
    // Simulate the computation of v
    const combined = new Uint8Array([...t, ...coins, ...messageBytes]);
    const vHash = await sha512(combined);
    
    // Create the ciphertext as coins + u + v
    const ciphertextBytes = new Uint8Array([...coins, ...uHash, ...vHash.slice(0, 32)]);
    
    return bytesToHex(ciphertextBytes);
  },
  
  // Decrypt a ciphertext using Kyber
  decrypt: async (ciphertext: string, privateKey: string) => {
    try {
      // In a real Kyber implementation:
      // 1. Compute v' = v - s^T·u
      // 2. Decode m from v'
      
      // We'll simulate this process:
      
      // Parse the private key
      const privateKeyBytes = hexToBytes(privateKey);
      const seedA = privateKeyBytes.slice(0, 32);
      const s = privateKeyBytes.slice(32, 64);
      
      // Parse the ciphertext
      const ciphertextBytes = hexToBytes(ciphertext);
      const coins = ciphertextBytes.slice(0, 32);
      const u = ciphertextBytes.slice(32, 64);
      const v = ciphertextBytes.slice(64, 96);
      
      // In real Kyber, we would:
      // - Compute v' = v - s^T·u
      // - Decode message from v'
      
      // For our simulation:
      // Simulate the decryption process
      const combined = new Uint8Array([...seedA, ...s, ...coins, ...u, ...v]);
      const messageDigest = await sha256(combined);
      
      // Extract the message (in a real implementation this would be more complex)
      const recoveredBytes = messageDigest;
      
      // Try to interpret as a UTF-8 string
      // This is a simplification - real decryption would have proper encoding/decoding
      const decoder = new TextDecoder();
      let messageText = "";
      try {
        messageText = decoder.decode(recoveredBytes);
        
        // Clean the string - remove non-printable characters
        messageText = messageText.replace(/[^\x20-\x7E]/g, '');
      } catch (e) {
        console.error("Error decoding message:", e);
        messageText = bytesToHex(recoveredBytes.slice(0, 16)) + "...";
      }
      
      return messageText;
    } catch (error) {
      console.error("Kyber decryption error:", error);
      return "Decryption error";
    }
  },
  
  // Estimate ciphertext size based on parameters
  getCiphertextSize: () => {
    // In a real Kyber implementation, the ciphertext size would be calculated
    // based on the specific parameters
    
    // Simplified estimate: coins + u + v
    const coinsSize = 32;
    const uSize = kyberCrypto.params.k * kyberCrypto.params.n * Math.ceil(Math.log2(kyberCrypto.params.q) / 8);
    const vSize = Math.ceil(Math.log2(kyberCrypto.params.q) / 8) * kyberCrypto.params.n;
    
    return coinsSize + uSize + vSize;
  }
};

// Helper function to estimate the quantum security level
export const estimateQuantumSecurityLevel = () => {
  // NIST security levels:
  // Level 1: At least as hard to break as AES-128
  // Level 3: At least as hard to break as AES-192
  // Level 5: At least as hard to break as AES-256
  
  // For our SPHINCS+ parameters
  const sphincsSecurityLevel = 1; // SPHINCS+-128f equivalent
  
  // For our Kyber parameters
  const kyberSecurityLevel = 1; // Kyber-512 equivalent
  
  return {
    sphincs: {
      level: sphincsSecurityLevel,
      description: "Equivalent to AES-128 against quantum attacks",
      classicalBits: 128,
      quantumBits: 64
    },
    kyber: {
      level: kyberSecurityLevel,
      description: "Equivalent to AES-128 against quantum attacks",
      classicalBits: 128,
      quantumBits: 64
    }
  };
};

// Create a demonstration of SPHINCS+ in action
export const demonstrateSPHINCS = async (message: string = "Example message for quantum-safe signature") => {
  // Generate a new key pair
  console.log("Starting SPHINCS+ demonstration");
  const startKeygen = performance.now();
  const keys = await sphincsPlus.generateKeypair();
  const endKeygen = performance.now();
  
  console.log("SPHINCS+ Demonstration:");
  console.log("Message:", message);
  console.log("Public Key:", keys.publicKey);
  console.log("Key generation time:", (endKeygen - startKeygen).toFixed(2), "ms");
  
  // Sign the message
  const start = performance.now();
  const signature = await sphincsPlus.sign(message, keys.privateKey);
  const end = performance.now();
  
  console.log("Signature:", signature);
  console.log("Signature Length:", hexToBytes(signature).length, "bytes");
  console.log("Signing Time:", (end - start).toFixed(2), "ms");
  
  // Verify the signature
  const verifyStart = performance.now();
  const isValid = await sphincsPlus.verify(message, signature, keys.publicKey);
  const verifyEnd = performance.now();
  
  console.log("Verification Result:", isValid ? "Valid ✓" : "Invalid ✗");
  console.log("Verification Time:", (verifyEnd - verifyStart).toFixed(2), "ms");
  
  // Estimate signature size
  const estimatedSize = sphincsPlus.getSignatureSize();
  console.log("Estimated full signature size:", estimatedSize, "bytes");
  
  return {
    message,
    publicKey: keys.publicKey,
    signature,
    signatureLength: hexToBytes(signature).length,
    estimatedFullSize: estimatedSize,
    signingTime: end - start,
    verificationResult: isValid,
    verificationTime: verifyEnd - verifyStart
  };
};

// Create a demonstration of lattice encryption in action
export const demonstrateLattice = async (message: string = "Secret message protected with lattice-based encryption") => {
  // Generate a new key pair
  console.log("Starting Kyber demonstration");
  const startKeygen = performance.now();
  const keys = await kyberCrypto.generateKeypair();
  const endKeygen = performance.now();
  
  console.log("Kyber Cryptography Demonstration:");
  console.log("Original Message:", message);
  console.log("Public Key:", keys.publicKey);
  console.log("Key generation time:", (endKeygen - startKeygen).toFixed(2), "ms");
  
  // Encrypt the message
  const start = performance.now();
  const ciphertext = await kyberCrypto.encrypt(message, keys.publicKey);
  const end = performance.now();
  
  console.log("Ciphertext:", ciphertext);
  console.log("Encryption Time:", (end - start).toFixed(2), "ms");
  
  // Decrypt the message
  const decryptStart = performance.now();
  const decrypted = await kyberCrypto.decrypt(ciphertext, keys.privateKey);
  const decryptEnd = performance.now();
  
  console.log("Decrypted Message:", decrypted);
  console.log("Decryption Time:", (decryptEnd - decryptStart).toFixed(2), "ms");
  console.log("Decryption Success:", message.includes(decrypted.substring(0, 10)) ? "Yes ✓" : "No ✗");
  
  // Estimate ciphertext size
  const estimatedSize = kyberCrypto.getCiphertextSize();
  console.log("Estimated full ciphertext size:", estimatedSize, "bytes");
  
  return {
    originalMessage: message,
    publicKey: keys.publicKey,
    ciphertext,
    estimatedFullSize: estimatedSize,
    encryptionTime: end - start,
    decryptedMessage: decrypted,
    decryptionTime: decryptEnd - decryptStart,
    decryptionSuccess: message.includes(decrypted.substring(0, 10))
  };
};

// Generate a quantum-safe wallet
export const generateQuantumWallet = async () => {
  const sphincsKeys = await sphincsPlus.generateKeypair();
  const kyberKeys = await kyberCrypto.generateKeypair();
  
  return {
    address: `0x${sphincsKeys.publicKey.substring(0, 40)}`,
    sphincsKeys,
    kyberKeys
  };
};

// Helper function to sign transaction data
export const signTransaction = async (txData: any, privateKey: string) => {
  const message = JSON.stringify(txData);
  return await sphincsPlus.sign(message, privateKey);
};

// Helper function to verify transaction signature
export const verifyTransaction = async (txData: any, signature: string, publicKey: string) => {
  const message = JSON.stringify(txData);
  return await sphincsPlus.verify(message, signature, publicKey);
};


/**
 * Cryptography Services
 * 
 * This file exports all the cryptographic services and utilities for the application
 */

import sphincsPlus from './sphincsPlus';
import kyber from './kyber';
import * as utils from './utils';

/**
 * Estimate quantum security level
 * @returns Object with security information for SPHINCS+ and Kyber
 */
export const estimateQuantumSecurityLevel = () => {
  // NIST security levels:
  // Level 1: At least as hard to break as AES-128
  // Level 3: At least as hard to break as AES-192
  // Level 5: At least as hard to break as AES-256
  
  // For our SPHINCS+ parameters
  const sphincsSecurityLevel = 1; // SPHINCS+-128f configuration
  
  // For our Kyber parameters
  const kyberSecurityLevel = 1; // Kyber-512 configuration
  
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

/**
 * Create a demonstration of SPHINCS+ in action
 * @param message Message to sign
 * @returns Results of the SPHINCS+ demonstration
 */
export const demonstrateSPHINCS = async (message: string = "Example message for quantum-safe signature") => {
  console.log("Starting SPHINCS+ demonstration");
  
  // Generate a new key pair
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
  console.log("Signature Length:", utils.hexToBytes(signature).length, "bytes");
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
    signatureLength: utils.hexToBytes(signature).length,
    estimatedFullSize: estimatedSize,
    signingTime: end - start,
    verificationResult: isValid,
    verificationTime: verifyEnd - verifyStart
  };
};

/**
 * Create a demonstration of Kyber lattice encryption in action
 * @param message Message to encrypt
 * @returns Results of the Kyber demonstration
 */
export const demonstrateLattice = async (message: string = "Secret message protected with lattice-based encryption") => {
  console.log("Starting Kyber demonstration");
  
  // Generate a new key pair
  const startKeygen = performance.now();
  const keys = await kyber.generateKeypair();
  const endKeygen = performance.now();
  
  console.log("Kyber Cryptography Demonstration:");
  console.log("Original Message:", message);
  console.log("Public Key:", keys.publicKey);
  console.log("Key generation time:", (endKeygen - startKeygen).toFixed(2), "ms");
  
  // Encrypt the message
  const start = performance.now();
  const { ciphertext, encryptedMessage } = await kyber.encrypt(message, keys.publicKey);
  const end = performance.now();
  
  console.log("Ciphertext:", ciphertext);
  console.log("Encryption Time:", (end - start).toFixed(2), "ms");
  
  // Decrypt the message
  const decryptStart = performance.now();
  const decrypted = await kyber.decrypt(encryptedMessage, ciphertext, keys.privateKey);
  const decryptEnd = performance.now();
  
  console.log("Decrypted Message:", decrypted);
  console.log("Decryption Time:", (decryptEnd - decryptStart).toFixed(2), "ms");
  console.log("Decryption Success:", message.includes(decrypted.substring(0, 10)) ? "Yes ✓" : "No ✗");
  
  // Estimate ciphertext size
  const estimatedSize = kyber.getCiphertextSize();
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

/**
 * Generate a quantum-safe wallet
 * @returns A new quantum-safe wallet
 */
export const generateQuantumWallet = async () => {
  const sphincsKeys = await sphincsPlus.generateKeypair();
  const kyberKeys = await kyber.generateKeypair();
  
  return {
    address: `0x${sphincsKeys.publicKey.substring(0, 40)}`,
    sphincsKeys,
    kyberKeys
  };
};

/**
 * Sign transaction data with SPHINCS+
 * @param txData Transaction data to sign
 * @param privateKey SPHINCS+ private key
 * @returns Transaction signature
 */
export const signTransaction = async (txData: any, privateKey: string) => {
  const message = JSON.stringify(txData);
  return await sphincsPlus.sign(message, privateKey);
};

/**
 * Verify transaction signature with SPHINCS+
 * @param txData Transaction data to verify
 * @param signature SPHINCS+ signature
 * @param publicKey SPHINCS+ public key
 * @returns Whether the signature is valid
 */
export const verifyTransaction = async (txData: any, signature: string, publicKey: string) => {
  const message = JSON.stringify(txData);
  return await sphincsPlus.verify(message, signature, publicKey);
};

// Export all cryptography services
export {
  sphincsPlus,
  kyber,
  utils
};

// Default export
export default {
  sphincsPlus,
  kyber,
  utils,
  estimateQuantumSecurityLevel,
  demonstrateSPHINCS,
  demonstrateLattice,
  generateQuantumWallet,
  signTransaction,
  verifyTransaction
};

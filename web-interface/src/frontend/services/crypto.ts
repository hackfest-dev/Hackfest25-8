
import sphincsPlus from '../../backend/crypto/sphincs';
import kyber from '../../backend/crypto/kyber';

interface SecurityLevel {
  level: number;
  description: string;
  classicalBits: number;
  quantumBits: number;
}

interface SecurityMetrics {
  sphincs: SecurityLevel;
  kyber: SecurityLevel;
}

/**
 * Frontend service for quantum cryptography operations
 */
export const quantumCrypto = {
  /**
   * Generate a quantum-safe wallet
   */
  generateWallet: async () => {
    const sphincsKeys = await sphincsPlus.generateKeypair();
    const kyberKeys = await kyber.generateKeypair();
    
    return {
      address: `0x${sphincsKeys.publicKey.substring(0, 40)}`,
      sphincsKeys,
      kyberKeys
    };
  },
  
  /**
   * Sign a transaction using SPHINCS+
   */
  signTransaction: async (txData: any, privateKey: string) => {
    const message = JSON.stringify(txData);
    return await sphincsPlus.sign(message, privateKey);
  },
  
  /**
   * Verify a transaction signature
   */
  verifyTransaction: async (txData: any, signature: string, publicKey: string) => {
    const message = JSON.stringify(txData);
    return await sphincsPlus.verify(message, signature, publicKey);
  },
  
  /**
   * Encrypt data using Kyber
   */
  encryptData: async (data: string, publicKey: string) => {
    return await kyber.encrypt(data, publicKey);
  },
  
  /**
   * Decrypt data using Kyber
   */
  decryptData: async (encryptedMessage: string, ciphertext: string, privateKey: string) => {
    return await kyber.decrypt(encryptedMessage, ciphertext, privateKey);
  },
  
  /**
   * Get security metrics
   */
  getSecurityMetrics: (): SecurityMetrics => {
    return {
      sphincs: {
        level: 1,
        description: "Equivalent to AES-128 against quantum attacks",
        classicalBits: 128,
        quantumBits: 64
      },
      kyber: {
        level: 1,
        description: "Equivalent to AES-128 against quantum attacks",
        classicalBits: 128,
        quantumBits: 64
      }
    };
  }
};

export default quantumCrypto;

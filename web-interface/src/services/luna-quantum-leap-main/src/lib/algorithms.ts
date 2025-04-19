
export interface Algorithm {
  id: string;
  name: string;
  category: 'signature' | 'encryption' | 'hash';
  description: string;
  securityLevel: 'level1' | 'level3' | 'level5';
  keySize: number;
  signatureSize?: number;
  encapsulationSize?: number;
  colorScheme: 'dilithium' | 'kyber' | 'sphincs' | 'quantum';
  standardStatus: 'NIST selected' | 'NIST finalist' | 'NIST alternate' | 'IETF RFC';
}

export const postQuantumAlgorithms: Algorithm[] = [
  {
    id: 'dilithium2',
    name: 'CRYSTAL-Dilithium2',
    category: 'signature',
    description: 'Lattice-based digital signature algorithm selected by NIST as a post-quantum standard. Provides quantum-resistant digital signatures with small public key size.',
    securityLevel: 'level1',
    keySize: 1312,
    signatureSize: 2420,
    colorScheme: 'dilithium',
    standardStatus: 'NIST selected'
  },
  {
    id: 'dilithium3',
    name: 'CRYSTAL-Dilithium3',
    category: 'signature',
    description: 'Medium security version of Dilithium designed for higher security levels with trade-offs in performance and size.',
    securityLevel: 'level3',
    keySize: 1952,
    signatureSize: 3293,
    colorScheme: 'dilithium',
    standardStatus: 'NIST selected'
  },
  {
    id: 'kyber512',
    name: 'CRYSTAL-Kyber512',
    category: 'encryption',
    description: 'Lattice-based key encapsulation mechanism (KEM) selected as the first PQC encryption standard by NIST. Enables quantum-resistant secure key exchange.',
    securityLevel: 'level1',
    keySize: 800,
    encapsulationSize: 768,
    colorScheme: 'kyber',
    standardStatus: 'NIST selected'
  },
  {
    id: 'kyber768',
    name: 'CRYSTAL-Kyber768',
    category: 'encryption',
    description: 'Medium security version of Kyber with larger parameters for enhanced security at the cost of slightly larger keys and ciphertexts.',
    securityLevel: 'level3',
    keySize: 1184,
    encapsulationSize: 1088,
    colorScheme: 'kyber',
    standardStatus: 'NIST selected'
  },
  {
    id: 'sphincssha256128f',
    name: 'SPHINCS+-SHA256-128f',
    category: 'signature',
    description: 'Hash-based signature scheme selected as an alternative by NIST. Based only on hash functions with minimal security assumptions.',
    securityLevel: 'level1',
    keySize: 32,
    signatureSize: 17088,
    colorScheme: 'sphincs',
    standardStatus: 'NIST alternate'
  },
  {
    id: 'xmss',
    name: 'XMSS',
    category: 'signature',
    description: 'Stateful hash-based signature scheme standardized in IETF RFC 8391. Provides quantum-resistance with small public keys but requires careful state management.',
    securityLevel: 'level1',
    keySize: 132,
    signatureSize: 2500,
    colorScheme: 'quantum',
    standardStatus: 'IETF RFC'
  }
];

export const algorithmCategories = [
  { 
    id: 'signature',
    name: 'Digital Signatures',
    description: 'Algorithms for proving authenticity and integrity of data'
  },
  { 
    id: 'encryption', 
    name: 'Key Encapsulation',
    description: 'Algorithms for secure key exchange and encryption'
  },
  { 
    id: 'hash', 
    name: 'Hash-Based',
    description: 'Algorithms based on cryptographic hash functions'
  }
];

export const securityLevels = {
  level1: 'Equivalent to AES-128',
  level3: 'Equivalent to AES-192',
  level5: 'Equivalent to AES-256'
};

export const useCases = [
  {
    id: 'code-signing',
    name: 'Code Signing',
    description: 'Protect software by signing code to verify its authenticity and integrity',
    recommendedAlgorithms: ['dilithium2', 'dilithium3', 'sphincssha256128f', 'xmss']
  },
  {
    id: 'document-signing',
    name: 'Document Signing',
    description: 'Create legally binding electronic signatures with long-term validity',
    recommendedAlgorithms: ['dilithium3', 'sphincssha256128f']
  },
  {
    id: 'tls',
    name: 'TLS / Secure Communications',
    description: 'Secure data in transit with quantum-resistant encryption',
    recommendedAlgorithms: ['kyber512', 'kyber768', 'dilithium2']
  },
  {
    id: 'pki',
    name: 'PKI & Certificates',
    description: 'Quantum-safe certificate authorities and identity verification',
    recommendedAlgorithms: ['dilithium3', 'sphincssha256128f']
  }
];

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);
const { v4: uuidv4 } = require('uuid');
const { ec: EC } = require('elliptic');
const ec = new EC('secp256k1');

// Import cryptography implementations
const classicalCrypto = require('./cryptography/classical');
const sphincsCrypto = require('./cryptography/sphincs');
const latticeCrypto = require('./cryptography/lattice');
const { getBlockchain } = require('./blockchain');
const { createTransaction } = require('./transaction');

class Wallet {
  constructor(id, name, encryptedClassicalKey, encryptedSphincsPlusKey, encryptedLatticeKey) {
    this.id = id;
    this.name = name;
    this.encryptedClassicalKey = encryptedClassicalKey;
    this.encryptedSphincsPlusKey = encryptedSphincsPlusKey;
    this.encryptedLatticeKey = encryptedLatticeKey;
    this.classicalAddress = null;
    this.sphincsPlusAddress = null;
    this.latticeAddress = null;
    this.dataDir = path.join(process.cwd(), 'data', 'wallets');
  }

  static async create(name, password) {
    try {
      const id = uuidv4();
      const dataDir = path.join(process.cwd(), 'data', 'wallets');
      
      // Create wallets directory if it doesn't exist
      await mkdir(dataDir, { recursive: true });
      
      // Generate classical keypair (ECDSA)
      const classicalKeypair = classicalCrypto.generateKeypair();
      const classicalPrivateKey = classicalKeypair.privateKey;
      const classicalAddress = classicalKeypair.address; // 0x...
      
      // Generate SPHINCS+ keypair
      const sphincsPlusKeypair = sphincsCrypto.generateKeypair();
      const sphincsPlusPrivateKey = sphincsPlusKeypair.privateKey;
      const sphincsPlusAddress = sphincsPlusKeypair.address; // qx...
      
      // Generate lattice-based keypair
      const latticeKeypair = latticeCrypto.generateKeypair();
      const latticePrivateKey = latticeKeypair.privateKey;
      const latticeAddress = latticeKeypair.address; // lx...
      
      // Encrypt private keys with password
      const encryptedClassicalKey = encryptPrivateKey(classicalPrivateKey, password);
      const encryptedSphincsPlusKey = encryptPrivateKey(sphincsPlusPrivateKey, password);
      const encryptedLatticeKey = encryptPrivateKey(latticePrivateKey, password);
      
      // Create wallet instance
      const wallet = new Wallet(
        id,
        name,
        encryptedClassicalKey,
        encryptedSphincsPlusKey,
        encryptedLatticeKey
      );
      
      wallet.classicalAddress = classicalAddress;
      wallet.sphincsPlusAddress = sphincsPlusAddress;
      wallet.latticeAddress = latticeAddress;
      
      // Save wallet to file
      await wallet.save();
      
      return {
        id,
        name,
        classicalAddress,
        sphincsPlusAddress,
        latticeAddress
      };
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  }

  static async load(id) {
    try {
      const dataDir = path.join(process.cwd(), 'data', 'wallets');
      const filePath = path.join(dataDir, `${id}.json`);
      const data = await readFile(filePath, 'utf8');
      const walletData = JSON.parse(data);
      
      const wallet = new Wallet(
        walletData.id,
        walletData.name,
        walletData.encryptedClassicalKey,
        walletData.encryptedSphincsPlusKey,
        walletData.encryptedLatticeKey
      );
      
      wallet.classicalAddress = walletData.classicalAddress;
      wallet.sphincsPlusAddress = walletData.sphincsPlusAddress;
      wallet.latticeAddress = walletData.latticeAddress;
      
      return wallet;
    } catch (error) {
      console.error(`Error loading wallet ${id}:`, error);
      throw new Error(`Wallet not found or corrupted: ${id}`);
    }
  }

  static async listWallets() {
    try {
      const dataDir = path.join(process.cwd(), 'data', 'wallets');
      
      // Create wallets directory if it doesn't exist
      await mkdir(dataDir, { recursive: true });
      
      const files = await promisify(fs.readdir)(dataDir);
      const walletFiles = files.filter(file => file.endsWith('.json'));
      
      const wallets = [];
      
      for (const file of walletFiles) {
        try {
          const data = await readFile(path.join(dataDir, file), 'utf8');
          const walletData = JSON.parse(data);
          
          wallets.push({
            id: walletData.id,
            name: walletData.name,
            classicalAddress: walletData.classicalAddress,
            sphincsPlusAddress: walletData.sphincsPlusAddress,
            latticeAddress: walletData.latticeAddress
          });
        } catch (error) {
          console.error(`Error reading wallet file ${file}:`, error);
        }
      }
      
      return wallets;
    } catch (error) {
      console.error('Error listing wallets:', error);
      throw error;
    }
  }

  async save() {
    try {
      const filePath = path.join(this.dataDir, `${this.id}.json`);
      
      // Create directory if it doesn't exist
      await mkdir(this.dataDir, { recursive: true });
      
      const data = JSON.stringify({
        id: this.id,
        name: this.name,
        encryptedClassicalKey: this.encryptedClassicalKey,
        encryptedSphincsPlusKey: this.encryptedSphincsPlusKey,
        encryptedLatticeKey: this.encryptedLatticeKey,
        classicalAddress: this.classicalAddress,
        sphincsPlusAddress: this.sphincsPlusAddress,
        latticeAddress: this.latticeAddress
      }, null, 2);
      
      await writeFile(filePath, data);
    } catch (error) {
      console.error(`Error saving wallet ${this.id}:`, error);
      throw error;
    }
  }

  async getBalance() {
    const blockchain = await getBlockchain();
    
    const classicalBalance = await blockchain.getAddressBalance(this.classicalAddress);
    const sphincsPlusBalance = await blockchain.getAddressBalance(this.sphincsPlusAddress);
    const latticeBalance = await blockchain.getAddressBalance(this.latticeAddress);
    
    return {
      classical: classicalBalance,
      sphincsPlus: sphincsPlusBalance,
      lattice: latticeBalance,
      total: classicalBalance + sphincsPlusBalance + latticeBalance,
      addresses: {
        classical: this.classicalAddress,
        sphincsPlus: this.sphincsPlusAddress,
        lattice: this.latticeAddress
      }
    };
  }

  async getTransactionHistory() {
    const blockchain = await getBlockchain();
    
    const classicalHistory = blockchain.getTransactionHistory(this.classicalAddress);
    const sphincsPlusHistory = blockchain.getTransactionHistory(this.sphincsPlusAddress);
    const latticeHistory = blockchain.getTransactionHistory(this.latticeAddress);
    
    // Combine and sort by timestamp (newest first)
    return [...classicalHistory, ...sphincsPlusHistory, ...latticeHistory]
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  async createTransaction(toAddress, amount, type, password) {
    try {
      // Decode private key based on transaction type
      let privateKey, fromAddress, signatureType, signer;
      
      switch (type) {
        case 'classical':
          privateKey = decryptPrivateKey(this.encryptedClassicalKey, password);
          fromAddress = this.classicalAddress;
          signatureType = 'classical';
          signer = classicalCrypto.sign;
          break;
        
        case 'sphincs':
          privateKey = decryptPrivateKey(this.encryptedSphincsPlusKey, password);
          fromAddress = this.sphincsPlusAddress;
          signatureType = 'sphincs';
          signer = sphincsCrypto.sign;
          break;
        
        case 'lattice':
          privateKey = decryptPrivateKey(this.encryptedLatticeKey, password);
          fromAddress = this.latticeAddress;
          signatureType = 'lattice';
          signer = latticeCrypto.sign;
          break;
        
        default:
          throw new Error(`Invalid signature type: ${type}`);
      }
      
      // Check balance
      const blockchain = await getBlockchain();
      const balance = await blockchain.getAddressBalance(fromAddress);
      
      if (balance < amount) {
        throw new Error(`Insufficient balance in ${type} address. Available: ${balance}, Required: ${amount}`);
      }
      
      // Create and sign transaction
      const tx = await createTransaction(fromAddress, toAddress, amount, privateKey, signatureType, signer);
      
      // Add to blockchain
      await blockchain.addTransaction(tx);
      
      return tx;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  async migrateToQuantum(password, quantumType = 'sphincs') {
    try {
      // Check classical balance
      const blockchain = await getBlockchain();
      const classicalBalance = await blockchain.getAddressBalance(this.classicalAddress);
      
      if (classicalBalance <= 0) {
        throw new Error('No balance to migrate from classical address');
      }
      
      // Determine target quantum address
      let toAddress;
      if (quantumType === 'sphincs') {
        toAddress = this.sphincsPlusAddress;
      } else if (quantumType === 'lattice') {
        toAddress = this.latticeAddress;
      } else {
        throw new Error(`Invalid quantum type: ${quantumType}`);
      }
      
      // Create migration transaction
      const privateKey = decryptPrivateKey(this.encryptedClassicalKey, password);
      const tx = await createTransaction(
        this.classicalAddress,
        toAddress,
        classicalBalance,
        privateKey,
        'classical',
        classicalCrypto.sign
      );




      
      await blockchain.addTransaction(tx);
      
      return {
        transactionHash: tx.txHash,
        from: this.classicalAddress,
        to: toAddress,
        amount: classicalBalance
      };
    } catch (error) {
      console.error('Error migrating to quantum address:', error);
      throw error;
    }
  }
}

// Helper functions for encryption/decryption
function encryptPrivateKey(privateKey, password) {
  // Create a key from the password (using a proper key derivation)
  const key = crypto.scryptSync(password, 'salt', 32);
  // Generate a random initialization vector
  const iv = crypto.randomBytes(16);
  // Create cipher using the key and iv
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  let encrypted = cipher.update(privateKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Return both the IV and encrypted data
  return iv.toString('hex') + ':' + encrypted;
}

function decryptPrivateKey(encryptedKey, password) {
  try {
    const [ivHex, encryptedData] = encryptedKey.split(':');
    
    // Convert IV from hex to Buffer
    const iv = Buffer.from(ivHex, 'hex');
    
    // Create key from password (using same method as encrypt)
    const key = crypto.scryptSync(password, 'salt', 32);
    
    // Create decipher using the key and iv
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    throw new Error('Invalid password or corrupted data');
  }
}

module.exports = {
  Wallet,
  encryptPrivateKey,
  decryptPrivateKey
};
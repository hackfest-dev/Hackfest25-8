const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);

const { validateTransaction } = require('./transaction');
const config = require('../utils/config');
const { formatDateTime } = require('../utils/formatting');

class Block {
  constructor(index, timestamp, transactions, previousHash = '', nonce = 0) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = nonce;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(
        this.index +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.previousHash +
        this.nonce
      )
      .digest('hex');
  }

  // Find a nonce that gives a hash with the required difficulty
  mineBlock(difficulty) {
    const target = Array(difficulty + 1).join('0');
    
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    
    return {
      hash: this.hash,
      nonce: this.nonce,
      attemptsRequired: this.nonce
    };
  }

  // Analyze security of the block (classical vs quantum transactions)
  securityMetrics() {
    const total = this.transactions.length;
    if (total === 0) return { classical: 0, quantum: 0, lattice: 0 };
    
    const classical = this.transactions.filter(tx => tx.signatureType === 'classical').length;
    const sphincsPlus = this.transactions.filter(tx => tx.signatureType === 'sphincs').length;
    const lattice = this.transactions.filter(tx => tx.signatureType === 'lattice').length;
    
    return {
      classical,
      sphincsPlus,
      lattice,
      classicalPercentage: (classical / total) * 100,
      sphincsPlusPercentage: (sphincsPlus / total) * 100,
      latticePercentage: (lattice / total) * 100
    };
  }
}

class Blockchain {
  constructor() {
    this.chain = [];
    this.mempool = []; // Pending transactions
    this.difficulty = 4; // Mining difficulty
    this.miningReward = 100; // Mining reward in tokens
    this.dataDir = path.join(process.cwd(), 'data', 'blockchain');
    
    this.initialize();
  }

  async initialize() {
    // Create necessary directories
    try {
      await mkdir(this.dataDir, { recursive: true });
      
      // Try to load existing blockchain
      try {
        await this.loadBlockchain();
      } catch (error) {
        // If loading fails, create genesis block
        this.createGenesisBlock();
        await this.saveBlockchain();
      }
    } catch (error) {
      console.error('Error initializing blockchain:', error);
      throw error;
    }
  }

  createGenesisBlock() {
    const genesisBlock = new Block(
      0,
      Date.now(),
      [
        {
          timestamp: Date.now(),
          from: 'GENESIS',
          to: 'GENESIS',
          amount: 0,
          txHash: crypto.createHash('sha256').update('GENESIS').digest('hex'),
          signatureType: 'GENESIS',
          signature: 'GENESIS'
        }
      ],
      '0',
      0
    );
    
    this.chain.push(genesisBlock);
    console.log('Genesis block created.');
    return genesisBlock;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  async addTransaction(transaction) {
    // Validate transaction
    if (!validateTransaction(transaction)) {
      throw new Error('Invalid transaction');
    }
    
    // Add to mempool
    this.mempool.push(transaction);
    await this.saveMempool();
    
    return transaction.txHash;
  }

  async mineBlock(minerAddress) {
    // Create mining reward transaction
    const rewardTransaction = {
      timestamp: Date.now(),
      from: 'MINING_REWARD',
      to: minerAddress,
      amount: this.miningReward,
      txHash: crypto.createHash('sha256').update(`REWARD-${Date.now()}-${minerAddress}`).digest('hex'),
      signatureType: 'SYSTEM',
      signature: 'SYSTEM'
    };
    
    // Get pending transactions and add reward
    const transactions = [...this.mempool, rewardTransaction];
    
    // Create new block
    const lastBlock = this.getLatestBlock();
    const newBlock = new Block(
      lastBlock.index + 1,
      Date.now(),
      transactions,
      lastBlock.hash
    );
    
    // Mine the block
    console.log('⛏️ Mining new block...');
    const miningResult = newBlock.mineBlock(this.difficulty);
    
    // Add block to the chain
    this.chain.push(newBlock);
    
    // Clear mempool
    this.mempool = [];
    
    // Save blockchain state
    await Promise.all([
      this.saveBlockchain(),
      this.saveMempool()
    ]);
    
    return {
      blockIndex: newBlock.index,
      blockHash: newBlock.hash,
      transactionCount: transactions.length,
      miningAttemptsRequired: miningResult.attemptsRequired,
      minerAddress,
      reward: this.miningReward
    };
  }

  async getAddressBalance(address) {
    let balance = 0;
    
    // Check all transactions in all blocks
    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.from === address) {
          balance -= transaction.amount;
        }
        
        if (transaction.to === address) {
          balance += transaction.amount;
        }
      }
    }
    
    // Also check pending transactions in mempool
    for (const transaction of this.mempool) {
      if (transaction.from === address) {
        balance -= transaction.amount;
      }
      
      if (transaction.to === address) {
        balance += transaction.amount;
      }
    }
    
    return balance;
  }

  getTransactionHistory(address) {
    const history = [];
    
    // Check all blocks
    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.from === address || transaction.to === address) {
          history.push({
            ...transaction,
            blockIndex: block.index,
            blockHash: block.hash,
            confirmed: true
          });
        }
      }
    }
    
    // Add pending transactions
    for (const transaction of this.mempool) {
      if (transaction.from === address || transaction.to === address) {
        history.push({
          ...transaction,
          confirmed: false
        });
      }
    }
    
    // Sort by timestamp (newest first)
    return history.sort((a, b) => b.timestamp - a.timestamp);
  }

  getTransactionByHash(txHash) {
    // Check mempool first
    const pendingTx = this.mempool.find(tx => tx.txHash === txHash);
    if (pendingTx) {
      return {
        ...pendingTx,
        confirmed: false,
        blockIndex: null,
        blockHash: null
      };
    }
    
    // Check all blocks
    for (const block of this.chain) {
      const tx = block.transactions.find(tx => tx.txHash === txHash);
      if (tx) {
        return {
          ...tx,
          confirmed: true,
          blockIndex: block.index,
          blockHash: block.hash
        };
      }
    }
    
    return null; // Transaction not found
  }

  getBlockByIndex(index) {
    if (index < 0 || index >= this.chain.length) {
      return null;
    }
    
    return this.chain[index];
  }

  getBlockByHash(hash) {
    return this.chain.find(block => block.hash === hash);
  }

  securityMetrics() {
    // Count classical vs quantum-resistant transactions
    let classicalTxCount = 0;
    let sphincsTxCount = 0;
    let latticeTxCount = 0;
    
    // Addresses and their balances by type
    const classicalAddresses = new Map();
    const quantumAddresses = new Map(); // Combined for both SPHINCS+ and lattice
    
    // Analyze blockchain
    for (const block of this.chain) {
      for (const tx of block.transactions) {
        // Skip system transactions
        if (tx.from === 'GENESIS' || tx.from === 'MINING_REWARD') {
          continue;
        }
        
        // Count by signature type
        if (tx.signatureType === 'classical') {
          classicalTxCount++;
        } else if (tx.signatureType === 'sphincs') {
          sphincsTxCount++;
        } else if (tx.signatureType === 'lattice') {
          latticeTxCount++;
        }
        
        // Track balances by address type
        if (tx.to.startsWith('0x')) { // Classical address
          const currentBalance = classicalAddresses.get(tx.to) || 0;
          classicalAddresses.set(tx.to, currentBalance + tx.amount);
        } else if (tx.to.startsWith('qx') || tx.to.startsWith('lx')) { // Quantum address
          const currentBalance = quantumAddresses.get(tx.to) || 0;
          quantumAddresses.set(tx.to, currentBalance + tx.amount);
        }
        
        // Deduct from sender
        if (tx.from.startsWith('0x')) {
          const currentBalance = classicalAddresses.get(tx.from) || 0;
          classicalAddresses.set(tx.from, currentBalance - tx.amount);
        } else if (tx.from.startsWith('qx') || tx.from.startsWith('lx')) {
          const currentBalance = quantumAddresses.get(tx.from) || 0;
          quantumAddresses.set(tx.from, currentBalance - tx.amount);
        }
      }
    }
    
    // Calculate total tokens in each address type
    let classicalTokens = 0;
    let quantumTokens = 0;
    
    for (const balance of classicalAddresses.values()) {
      if (balance > 0) {
        classicalTokens += balance;
      }
    }
    
    for (const balance of quantumAddresses.values()) {
      if (balance > 0) {
        quantumTokens += balance;
      }
    }
    
    const totalTokens = classicalTokens + quantumTokens;
    const totalTx = classicalTxCount + sphincsTxCount + latticeTxCount;
    
    return {
      transactionCounts: {
        classical: classicalTxCount,
        sphincsPlus: sphincsTxCount,
        lattice: latticeTxCount,
        total: totalTx
      },
      percentages: {
        classical: totalTx > 0 ? (classicalTxCount / totalTx) * 100 : 0,
        sphincsPlus: totalTx > 0 ? (sphincsTxCount / totalTx) * 100 : 0,
        lattice: totalTx > 0 ? (latticeTxCount / totalTx) * 100 : 0
      },
      addresses: {
        classical: classicalAddresses.size,
        quantum: quantumAddresses.size
      },
      balances: {
        classical: classicalTokens,
        quantum: quantumTokens,
        total: totalTokens
      },
      vulnerability: {
        vulnerablePercentage: totalTokens > 0 ? (classicalTokens / totalTokens) * 100 : 0,
        securePercentage: totalTokens > 0 ? (quantumTokens / totalTokens) * 100 : 0
      }
    };
  }

  isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      
      // Verify hash
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      
      // Verify chain links
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    
    return true;
  }

  async saveBlockchain() {
    try {
      const data = JSON.stringify(this.chain, null, 2);
      await writeFile(path.join(this.dataDir, 'chain.json'), data);
    } catch (error) {
      console.error('Error saving blockchain:', error);
      throw error;
    }
  }

  async loadBlockchain() {
    try {
      const filePath = path.join(this.dataDir, 'chain.json');
      
      if (!fs.existsSync(filePath)) {
        throw new Error('Blockchain file not found');
      }
      
      const data = await readFile(filePath, 'utf8');
      const parsedData = JSON.parse(data);
      
      if (!Array.isArray(parsedData) || parsedData.length === 0) {
        throw new Error('Invalid blockchain data format');
      }
      
      this.chain = parsedData.map(blockData => {
        const block = new Block(
          blockData.index,
          blockData.timestamp,
          blockData.transactions,
          blockData.previousHash,
          blockData.nonce
        );
        block.hash = blockData.hash;
        return block;
      });
      
      if (!this.isValid()) {
        console.warn('Warning: Loaded blockchain has validation issues. Creating a new genesis block.');
        this.chain = [];
        this.createGenesisBlock();
        await this.saveBlockchain();
      } else {
        console.log(`Blockchain loaded with ${this.chain.length} blocks.`);
      }
    } catch (error) {
      console.error('Error loading blockchain:', error);
      
      this.chain = [];
      this.createGenesisBlock();
      await this.saveBlockchain();
    }
  }

  async saveMempool() {
    try {
      const data = JSON.stringify(this.mempool, null, 2);
      await writeFile(path.join(this.dataDir, 'mempool.json'), data);
    } catch (error) {
      console.error('Error saving mempool:', error);
      throw error;
    }
  }

  async loadMempool() {
    try {
      const data = await readFile(path.join(this.dataDir, 'mempool.json'), 'utf8');
      this.mempool = JSON.parse(data);
      console.log(`Mempool loaded with ${this.mempool.length} pending transactions.`);
    } catch (error) {
      console.log('No existing mempool found. Starting with empty mempool.');
      this.mempool = [];
    }
  }

  getStatus() {
    const latestBlock = this.getLatestBlock();
    
    return {
      chainLength: this.chain.length,
      latestBlockIndex: latestBlock.index,
      latestBlockHash: latestBlock.hash,
      latestBlockTimestamp: latestBlock.timestamp,
      formattedTimestamp: formatDateTime(latestBlock.timestamp),
      pendingTransactions: this.mempool.length,
      miningDifficulty: this.difficulty,
      isValid: this.isValid()
    };
  }
}

// Singleton instance
let blockchainInstance = null;

const getBlockchain = async () => {
  if (!blockchainInstance) {
    blockchainInstance = new Blockchain();
    await blockchainInstance.initialize();
  }
  
  return blockchainInstance;
};

module.exports = {
  Block,
  Blockchain,
  getBlockchain
};
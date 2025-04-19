import { Transaction, Block } from "./blockchainData";
import { ipfsService } from "./ipfsService";
import { generateTransactionHash, generateWalletAddress, getRandomBytes, bytesToHex } from "./cryptography/utils";

// IPFS CIDs for our data
let transactionsCid: string | null = null;
let blocksCid: string | null = null;
let metricsCid: string | null = null;

// Local cache to avoid constant IPFS fetches
let transactionsCache: Transaction[] = [];
let blocksCache: Block[] = [];
let metricsCache: any = {
  totalBlocks: 0,
  totalTransactions: 0,
  quantumSafePercentage: 0,
  activeAttacks: 0,
  vulnerabilitiesDetected: 0,
  mitigationSuccessRate: 100,
};

export const fetchRecentTransactions = async (): Promise<Transaction[]> => {
  try {
    // If we have a transactions CID, fetch the data
    if (transactionsCid) {
      const data = await ipfsService.retrieveData(transactionsCid);
      transactionsCache = data;
    }
    
    // Otherwise, return cached data (empty if first fetch)
    return transactionsCache.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }).slice(0, 5);
  } catch (error) {
    console.error("Error fetching transactions from IPFS:", error);
    // Return cache even on error
    return transactionsCache.slice(0, 5);
  }
};

export const fetchBlockchain = async (limit: number = 10): Promise<Block[]> => {
  try {
    // If we have a blocks CID, fetch the data
    if (blocksCid) {
      const data = await ipfsService.retrieveData(blocksCid);
      blocksCache = data;
    }
    
    // Return blocks sorted by ID (descending)
    return blocksCache
      .sort((a, b) => Number(b.id) - Number(a.id))
      .slice(0, limit);
  } catch (error) {
    console.error("Error fetching blockchain from IPFS:", error);
    return blocksCache.slice(0, limit);
  }
};

export const fetchSecurityMetrics = async () => {
  try {
    // If we have a metrics CID, fetch the data
    if (metricsCid) {
      const data = await ipfsService.retrieveData(metricsCid);
      metricsCache = data;
    }
    
    return metricsCache;
  } catch (error) {
    console.error("Error fetching security metrics from IPFS:", error);
    return metricsCache;
  }
};

// Simulate adding a new block to the blockchain
export const simulateNewBlock = async (
  quantumSafe: boolean = true
): Promise<void> => {
  try {
    // Get the latest block
    const latestBlocks = blocksCache
      .sort((a, b) => Number(b.id) - Number(a.id));
    
    const lastBlock = latestBlocks.length > 0 ? latestBlocks[0] : null;
    const newBlockNumber = lastBlock ? Number(lastBlock.id) + 1 : 1;
    const previousHash = lastBlock ? lastBlock.hash : "0000000000000000";
    const newHash = '0x' + bytesToHex(getRandomBytes(32)).substring(0, 64);

    // Generate random transactions for this block
    const txCount = Math.floor(Math.random() * 3) + 1;
    const transactions: Transaction[] = [];

    for (let i = 0; i < txCount; i++) {
      const txHash = await generateTransactionHash();
      transactions.push({
        id: txHash,
        from: generateWalletAddress(),
        to: generateWalletAddress(),
        amount: (Math.random() * 10).toFixed(4),
        timestamp: new Date().toLocaleString(),
        quantumSafe: quantumSafe,
      });
    }

    // Create the new block
    const newBlock: Block = {
      id: newBlockNumber.toString(),
      hash: newHash,
      previousHash,
      timestamp: new Date().toLocaleString(),
      quantumSafe,
      transactions,
    };

    // Update our caches
    blocksCache.push(newBlock);
    transactionsCache = [...transactionsCache, ...transactions];

    // Update metrics
    metricsCache.totalBlocks = blocksCache.length;
    metricsCache.totalTransactions = transactionsCache.length;
    
    // Calculate quantum-safe percentage with proper number conversion
    const quantumSafeBlocks = blocksCache.filter(block => block.quantumSafe).length;
    const percentage = (quantumSafeBlocks / blocksCache.length) * 100;
    metricsCache.quantumSafePercentage = Math.round(percentage); // Math.round returns a number type

    // Store updated data to IPFS
    try {
      blocksCid = await ipfsService.uploadData(blocksCache);
      transactionsCid = await ipfsService.uploadData(transactionsCache);
      metricsCid = await ipfsService.uploadData(metricsCache);
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
    }
  } catch (error) {
    console.error("Error simulating new block:", error);
    throw error;
  }
};

// Simulate a quantum attack
export const simulateQuantumAttack = async (): Promise<void> => {
  try {
    // Update security metrics to indicate attack in progress
    metricsCache.activeAttacks = 1;
    metricsCache.vulnerabilitiesDetected = 3;
    
    // Store updated metrics to IPFS
    try {
      metricsCid = await ipfsService.uploadData(metricsCache);
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error simulating quantum attack:", error);
    throw error;
  }
};

// Mitigate a quantum attack
export const mitigateQuantumAttack = async (): Promise<void> => {
  try {
    // Update security metrics to indicate attack mitigation
    metricsCache.activeAttacks = 0;
    metricsCache.quantumSafePercentage = 100;
    metricsCache.mitigationSuccessRate = 100;
    
    // Update all blocks to be quantum safe
    blocksCache = blocksCache.map(block => ({
      ...block,
      quantumSafe: true,
      transactions: block.transactions.map(tx => ({
        ...tx,
        quantumSafe: true
      }))
    }));
    
    // Update all transactions to be quantum safe
    transactionsCache = transactionsCache.map(tx => ({
      ...tx,
      quantumSafe: true
    }));
    
    // Store updated data to IPFS
    try {
      blocksCid = await ipfsService.uploadData(blocksCache);
      transactionsCid = await ipfsService.uploadData(transactionsCache);
      metricsCid = await ipfsService.uploadData(metricsCache);
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error mitigating quantum attack:", error);
    throw error;
  }
};

// Initialize with some demo data if none exists
export const initializeIpfsData = async (): Promise<void> => {
  try {
    // Only initialize if we don't have data yet
    if (blocksCache.length === 0) {
      // Generate some initial blocks and transactions
      const initialBlocks: Block[] = [];
      const initialTransactions: Transaction[] = [];
      
      for (let i = 1; i <= 5; i++) {
        const blockTransactions: Transaction[] = [];
        
        // Generate 2-4 transactions per block
        const txCount = Math.floor(Math.random() * 3) + 2;
        for (let j = 0; j < txCount; j++) {
          const txHash = '0x' + bytesToHex(getRandomBytes(32)).substring(0, 64);
          const tx: Transaction = {
            id: txHash,
            from: generateWalletAddress(),
            to: generateWalletAddress(),
            amount: (Math.random() * 10).toFixed(4),
            timestamp: new Date(Date.now() - (i * 600000) - (j * 60000)).toLocaleString(),
            quantumSafe: Math.random() > 0.3, // 70% are quantum safe
          };
          
          blockTransactions.push(tx);
          initialTransactions.push(tx);
        }
        
        initialBlocks.push({
          id: i.toString(),
          hash: '0x' + bytesToHex(getRandomBytes(32)).substring(0, 64),
          previousHash: i > 1 ? initialBlocks[i-2].hash : "0000000000000000",
          timestamp: new Date(Date.now() - (i * 600000)).toLocaleString(),
          quantumSafe: Math.random() > 0.3, // 70% are quantum safe
          transactions: blockTransactions,
        });
      }
      
      // Update caches
      blocksCache = initialBlocks;
      transactionsCache = initialTransactions;
      
      // Calculate quantum safe percentage
      const quantumSafeBlocks = initialBlocks.filter(block => block.quantumSafe).length;
      const percentage = (quantumSafeBlocks / initialBlocks.length) * 100;
      
      metricsCache = {
        totalBlocks: initialBlocks.length,
        totalTransactions: initialTransactions.length,
        quantumSafePercentage: Math.round(percentage), // Math.round returns a number type
        activeAttacks: 0,
        vulnerabilitiesDetected: 0,
        mitigationSuccessRate: 100,
      };
      
      // Store to IPFS
      try {
        blocksCid = await ipfsService.uploadData(initialBlocks);
        transactionsCid = await ipfsService.uploadData(initialTransactions);
        metricsCid = await ipfsService.uploadData(metricsCache);
      
        console.log("Initialized IPFS data storage with demo data");
      } catch (error) {
        console.error("Error uploading to IPFS:", error);
      }
    }
  } catch (error) {
    console.error("Error initializing IPFS data:", error);
  }
};

// Call initialization on module import
initializeIpfsData();

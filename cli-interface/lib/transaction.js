const crypto = require('crypto');

/**
 * Create a new transaction
 * @param {string} fromAddress - Source address
 * @param {string} toAddress - Destination address
 * @param {number} amount - Amount to transfer
 * @param {string} privateKey - Private key for signing
 * @param {string} signatureType - Type of signature (classical, sphincs, lattice)
 * @param {Function} signingFunction - Function to sign the transaction
 * @returns {Object} - Signed transaction object
 */
async function createTransaction(fromAddress, toAddress, amount, privateKey, signatureType, signingFunction) {
  // Create transaction data
  const timestamp = Date.now();
  const txData = {
    timestamp,
    from: fromAddress,
    to: toAddress,
    amount,
    nonce: crypto.randomBytes(4).toString('hex')
  };
  
  // Create string representation for signing
  const txString = JSON.stringify(txData);
  
  // Sign the transaction
  const signature = signingFunction(txString, privateKey);
  
  // Generate transaction hash
  const txHash = crypto.createHash('sha256')
    .update(txString + signature)
    .digest('hex');
  
  // Return complete transaction
  return {
    ...txData,
    txHash,
    signatureType,
    signature
  };
}

/**
 * Validate a transaction
 * @param {Object} transaction - Transaction object to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateTransaction(transaction) {
  // Check required fields
  const requiredFields = ['timestamp', 'from', 'to', 'amount', 'txHash', 'signatureType', 'signature'];
  const hasAllFields = requiredFields.every(field => transaction.hasOwnProperty(field));
  
  if (!hasAllFields) {
    return false;
  }
  
  // Check address formats
  if (transaction.from !== 'GENESIS' && transaction.from !== 'MINING_REWARD') {
    if (transaction.from.startsWith('0x')) {
      if (transaction.from.length !== 42) return false;
    } else if (transaction.from.startsWith('qx') || transaction.from.startsWith('lx')) {
      if (transaction.from.length !== 42) return false;
    } else {
      return false;
    }
  }
  
  if (transaction.to.startsWith('0x')) {
    if (transaction.to.length !== 42) return false;
  } else if (transaction.to.startsWith('qx') || transaction.to.startsWith('lx')) {
    if (transaction.to.length !== 42) return false;
  } else {
    return false;
  }
  
  // Check signature type
  if (!['classical', 'sphincs', 'lattice', 'GENESIS', 'SYSTEM'].includes(transaction.signatureType)) {
    return false;
  }
  
  // Skip signature verification for special transactions
  if (transaction.from === 'GENESIS' || transaction.from === 'MINING_REWARD') {
    return true;
  }
  
  // For real transactions, we would verify the signature here
  // But in this simulation, we'll assume all signatures are valid
  return true;
}

/**
 * Format transaction for display
 * @param {Object} transaction - Transaction to format
 * @returns {Object} - Formatted transaction
 */
function formatTransaction(transaction) {
  const { signatureType } = transaction;
  let securityLevel;
  
  // Determine security level based on signature type
  switch (signatureType) {
    case 'classical':
      securityLevel = 'Classical (vulnerable to quantum attacks)';
      break;
    case 'sphincs':
      securityLevel = 'Quantum-Resistant (SPHINCS+ hash-based)';
      break;
    case 'lattice':
      securityLevel = 'Quantum-Resistant (Lattice-based)';
      break;
    case 'GENESIS':
      securityLevel = 'GENESIS (system)';
      break;
    case 'SYSTEM':
      securityLevel = 'SYSTEM (mining reward)';
      break;
    default:
      securityLevel = 'Unknown';
  }
  
  return {
    ...transaction,
    formattedTimestamp: new Date(transaction.timestamp).toLocaleString(),
    signatureSecurity: securityLevel,
    amountFormatted: `${transaction.amount} tokens`
  };
}

/**
 * Calculate transaction fees
 * @param {Object} transaction - Transaction to calculate fee for
 * @returns {number} - Fee amount
 */
function calculateTransactionFee(transaction) {
  // In this simulation, fees depend on the signature type
  // Real-world fees might be based on transaction size or other factors
  
  switch (transaction.signatureType) {
    case 'classical':
      return 0.001; // Lowest fee for smallest signatures
    case 'sphincs':
      return 0.01; // Higher fee for larger SPHINCS+ signatures
    case 'lattice':
      return 0.005; // Medium fee for medium-sized lattice signatures
    case 'GENESIS':
    case 'SYSTEM':
      return 0; // No fee for system transactions
    default:
      return 0.01; // Default fee
  }
}

/**
 * Get the quantum security status of a transaction
 * @param {Object} transaction - Transaction to analyze
 * @returns {Object} - Security analysis
 */
function getQuantumSecurityStatus(transaction) {
  switch (transaction.signatureType) {
    case 'classical':
      return {
        isQuantumSecure: false,
        securityLevel: 'Vulnerable',
        algorithm: 'ECDSA',
        attackVector: 'Vulnerable to Shor\'s algorithm',
        recommendation: 'Migrate to quantum-resistant address'
      };
    case 'sphincs':
      return {
        isQuantumSecure: true,
        securityLevel: 'Secure',
        algorithm: 'SPHINCS+ (hash-based)',
        attackVector: 'Resistant to known quantum attacks',
        recommendation: 'Maintain current security'
      };
    case 'lattice':
      return {
        isQuantumSecure: true,
        securityLevel: 'Secure',
        algorithm: 'Lattice-based',
        attackVector: 'Resistant to known quantum attacks',
        recommendation: 'Maintain current security'
      };
    default:
      return {
        isQuantumSecure: true,
        securityLevel: 'System',
        algorithm: 'N/A',
        attackVector: 'N/A',
        recommendation: 'N/A'
      };
  }
}

module.exports = {
  createTransaction,
  validateTransaction,
  formatTransaction,
  calculateTransactionFee,
  getQuantumSecurityStatus
};
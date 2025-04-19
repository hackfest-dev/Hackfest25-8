/**
 * Configuration settings for Quantum-Chain
 */

const path = require('path');
const fs = require('fs');
const os = require('os');

// Default configuration
const defaultConfig = {
  // Blockchain settings
  blockchain: {
    difficulty: 4,            // Mining difficulty (number of leading zeros)
    miningReward: 100,        // Mining reward in tokens
    blockTimeTarget: 60 * 5,  // Target block time in seconds (5 minutes)
    maxTransactionsPerBlock: 100, // Maximum transactions per block
  },
  
  // Cryptography settings
  cryptography: {
    // SPHINCS+ parameters
    sphincs: {
      securityLevel: 256,     // Security level in bits
      h: 66,                  // Total tree height
      d: 22,                  // Number of layers
      w: 16,                  // Winternitz parameter
    },
    
    // Lattice parameters
    lattice: {
      securityLevel: 256,     // Security level in bits
      n: 1024,                // Lattice dimension
      q: 8380417,             // Modulus (typically a prime)
    },
    
    // Classical (ECDSA) parameters
    classical: {
      curve: 'secp256k1',     // Elliptic curve
    }
  },
  
  // Storage settings
  storage: {
    dataDir: path.join(process.cwd(), 'data'),
    walletDir: path.join(process.cwd(), 'data', 'wallets'),
    blockchainDir: path.join(process.cwd(), 'data', 'blockchain'),
  },
  
  // CLI settings
  cli: {
    colors: true,             // Use colors in CLI output
    debug: false,             // Enable debug output
  }
};

// User config location
const userConfigPath = path.join(os.homedir(), '.quantum-chain', 'config.json');

/**
 * Load configuration
 * Merges default config with user config if it exists
 * @returns {Object} Merged configuration
 */
function loadConfig() {
  let userConfig = {};
  
  try {
    if (fs.existsSync(userConfigPath)) {
      const userConfigData = fs.readFileSync(userConfigPath, 'utf8');
      userConfig = JSON.parse(userConfigData);
    }
  } catch (error) {
    console.warn(`Warning: Could not load user config from ${userConfigPath}. Using default settings.`);
  }
  
  // Create a deep merge of default and user configs
  return deepMerge(defaultConfig, userConfig);
}

/**
 * Deep merge two objects
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} Merged object
 */
function deepMerge(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}

/**
 * Save user configuration
 * @param {Object} config - Configuration to save
 */
function saveConfig(config) {
  try {
    // Create config directory if it doesn't exist
    const configDir = path.dirname(userConfigPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    // Save config
    fs.writeFileSync(userConfigPath, JSON.stringify(config, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error saving user config: ${error.message}`);
  }
}

module.exports = {
  loadConfig,
  saveConfig,
  defaultConfig
};
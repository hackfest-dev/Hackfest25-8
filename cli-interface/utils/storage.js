/**
 * Storage utilities for Quantum-Chain
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { loadConfig } = require('./config');

// Promisify filesystem functions
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Get config
const config = loadConfig();

/**
 * Ensure a directory exists
 * @param {string} dir - Directory path
 * @returns {Promise<void>}
 */
async function ensureDir(dir) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

/**
 * Initialize storage directories
 * @returns {Promise<void>}
 */
async function initStorage() {
  try {
    // Create data directories
    await ensureDir(config.storage.dataDir);
    await ensureDir(config.storage.walletDir);
    await ensureDir(config.storage.blockchainDir);
    
    console.log('Storage directories initialized');
  } catch (error) {
    console.error(`Error initializing storage: ${error.message}`);
    throw error;
  }
}

/**
 * Save data to a JSON file
 * @param {string} filepath - Path to file
 * @param {Object} data - Data to save
 * @returns {Promise<void>}
 */
async function saveJSON(filepath, data) {
  try {
    // Ensure parent directory exists
    await ensureDir(path.dirname(filepath));
    
    // Write data
    const jsonData = JSON.stringify(data, null, 2);
    await writeFile(filepath, jsonData, 'utf8');
  } catch (error) {
    console.error(`Error saving data to ${filepath}: ${error.message}`);
    throw error;
  }
}

/**
 * Load data from a JSON file
 * @param {string} filepath - Path to file
 * @param {Object} defaultData - Default data if file doesn't exist
 * @returns {Promise<Object>} Loaded data
 */
async function loadJSON(filepath, defaultData = null) {
  try {
    // Check if file exists
    try {
      await stat(filepath);
    } catch (error) {
      if (error.code === 'ENOENT' && defaultData !== null) {
        return defaultData; // Return default data if file doesn't exist
      }
      throw error;
    }
    
    // Read and parse data
    const data = await readFile(filepath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading data from ${filepath}: ${error.message}`);
    throw error;
  }
}

/**
 * List files in a directory
 * @param {string} dir - Directory path
 * @param {string} extension - Filter by file extension (optional)
 * @returns {Promise<string[]>} Array of file paths
 */
async function listFiles(dir, extension = null) {
  try {
    // Ensure directory exists
    await ensureDir(dir);
    
    // Read directory
    const files = await readdir(dir);
    
    // Filter by extension if provided
    if (extension) {
      return files
        .filter(file => file.endsWith(extension))
        .map(file => path.join(dir, file));
    }
    
    return files.map(file => path.join(dir, file));
  } catch (error) {
    console.error(`Error listing files in ${dir}: ${error.message}`);
    throw error;
  }
}

module.exports = {
  initStorage,
  saveJSON,
  loadJSON,
  listFiles,
  ensureDir
};
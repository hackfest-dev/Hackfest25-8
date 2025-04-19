/**
 * Formatting utilities for Quantum-Chain CLI
 */

/**
 * Format a timestamp to a human-readable date/time
 * @param {number} timestamp - Unix timestamp (milliseconds)
 * @returns {string} Formatted date/time string
 */
function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }
  
  /**
   * Format a large number with commas
   * @param {number} number - Number to format
   * @returns {string} Formatted number with commas
   */
  function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  /**
   * Format an address for display (truncate with ellipsis)
   * @param {string} address - Address to format
   * @param {number} length - Length to display from start (default: 10)
   * @returns {string} Truncated address
   */
  function formatAddress(address, length = 10) {
    if (!address) return '';
    if (address.length <= length * 2) return address;
    
    return `${address.substring(0, length)}...${address.substring(address.length - 4)}`;
  }
  
  /**
   * Format a hash for display (truncate with ellipsis)
   * @param {string} hash - Hash to format
   * @param {number} length - Length to display from start (default: 10)
   * @returns {string} Truncated hash
   */
  function formatHash(hash, length = 10) {
    if (!hash) return '';
    if (hash.length <= length * 2) return hash;
    
    return `${hash.substring(0, length)}...`;
  }
  
  /**
   * Format an amount with token name
   * @param {number} amount - Amount to format
   * @param {string} tokenName - Token name (default: "tokens")
   * @returns {string} Formatted amount with token name
   */
  function formatAmount(amount, tokenName = 'tokens') {
    return `${parseFloat(amount).toFixed(2)} ${tokenName}`;
  }
  
  /**
   * Format a security risk level
   * @param {number} percentage - Risk percentage
   * @returns {Object} Risk info with level and description
   */
  function formatRiskLevel(percentage) {
    if (percentage > 50) {
      return {
        level: 'HIGH',
        description: 'Immediate action recommended',
        color: 'red'
      };
    } else if (percentage > 20) {
      return {
        level: 'MEDIUM',
        description: 'Action recommended',
        color: 'yellow'
      };
    } else {
      return {
        level: 'LOW',
        description: 'Continue monitoring',
        color: 'green'
      };
    }
  }
  
  /**
   * Format time duration in seconds to human-readable format
   * @param {number} seconds - Duration in seconds
   * @returns {string} Formatted duration
   */
  function formatDuration(seconds) {
    if (seconds < 60) {
      return `${seconds.toFixed(1)} seconds`;
    } else if (seconds < 3600) {
      return `${(seconds / 60).toFixed(1)} minutes`;
    } else if (seconds < 86400) {
      return `${(seconds / 3600).toFixed(1)} hours`;
    } else {
      return `${(seconds / 86400).toFixed(1)} days`;
    }
  }
  
  /**
   * Format a list of items for display
   * @param {Array} items - Array of items to format
   * @param {Function} formatter - Function to format each item
   * @param {number} maxItems - Maximum number of items to display
   * @returns {string} Formatted list
   */
  function formatList(items, formatter = item => item, maxItems = 5) {
    if (!items || items.length === 0) {
      return 'None';
    }
    
    const displayItems = items.slice(0, maxItems);
    let result = displayItems.map(formatter).join('\n');
    
    if (items.length > maxItems) {
      result += `\n... and ${items.length - maxItems} more`;
    }
    
    return result;
  }
  
  /**
   * Format a percentage
   * @param {number} value - Value to format as percentage
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted percentage
   */
  function formatPercentage(value, decimals = 1) {
    return `${value.toFixed(decimals)}%`;
  }
  
  /**
   * Format a signature type with security description
   * @param {string} type - Signature type (classical, sphincs, lattice)
   * @returns {Object} Formatted info with description and security level
   */
  function formatSignatureType(type) {
    switch (type) {
      case 'classical':
        return {
          name: 'ECDSA (secp256k1)',
          description: 'Classical cryptography',
          security: 'Vulnerable to quantum attacks',
          color: 'yellow'
        };
      case 'sphincs':
        return {
          name: 'SPHINCS+ (hash-based)',
          description: 'Post-quantum cryptography',
          security: 'Resistant to quantum attacks',
          color: 'green'
        };
      case 'lattice':
        return {
          name: 'Lattice-based',
          description: 'Post-quantum cryptography',
          security: 'Resistant to quantum attacks',
          color: 'green'
        };
      default:
        return {
          name: type,
          description: 'Unknown',
          security: 'Unknown',
          color: 'white'
        };
    }
  }
  
  module.exports = {
    formatDateTime,
    formatNumber,
    formatAddress,
    formatHash,
    formatAmount,
    formatRiskLevel,
    formatDuration,
    formatList,
    formatPercentage,
    formatSignatureType
  };
const chalk = require('chalk');
const ora = require('ora');
const { getBlockchain } = require('../blockchain');

/**
 * Mine a new block
 * @param {Object} options - Command options
 * @param {string} options.rewardAddress - Address to receive mining reward
 */
async function mine(options) {
  try {
    // Validate reward address
    if (!options.rewardAddress) {
      console.error(chalk.red('Error: Reward address is required (--reward-address)'));
      process.exit(1);
    }
    
    if (!(options.rewardAddress.startsWith('0x') || 
          options.rewardAddress.startsWith('qx') || 
          options.rewardAddress.startsWith('lx'))) {
      console.error(chalk.red('Error: Invalid address format. Must start with 0x, qx, or lx'));
      process.exit(1);
    }
    
    // Get blockchain instance
    const blockchain = await getBlockchain();
    
    // Check if there are pending transactions
    const pendingCount = blockchain.mempool.length;
    
    console.log();
    console.log(chalk.cyan(`⛏️ Mining new block with ${pendingCount} pending transaction(s)...`));
    
    // Check security of reward address
    let securityWarning = false;
    if (options.rewardAddress.startsWith('0x')) {
      console.log();
      console.log(chalk.yellow('⚠️ Warning: You are mining to a classical address (0x...) that is vulnerable to quantum attacks.'));
      console.log(chalk.yellow('   Consider using a quantum-resistant address (qx... or lx...) for better security.'));
      securityWarning = true;
    }
    
    // Start mining spinner
    const spinner = ora('Mining in progress...').start();
    
    // Periodic updates for the spinner
    let dots = 0;
    const updateInterval = setInterval(() => {
      dots = (dots + 1) % 4;
      spinner.text = `Mining in progress${'.'.repeat(dots)}`;
    }, 500);
    
    // Start mining
    const startTime = Date.now();
    const miningResult = await blockchain.mineBlock(options.rewardAddress);
    const endTime = Date.now();
    const miningTime = (endTime - startTime) / 1000; // in seconds
    
    // Stop spinner updates
    clearInterval(updateInterval);
    spinner.succeed(`Block #${miningResult.blockIndex} mined successfully in ${miningTime.toFixed(2)} seconds!`);
    
    // Display mining results
    console.log();
    console.log(chalk.green(`✅ Block #${miningResult.blockIndex} mined successfully!`));
    console.log(`Block Hash: ${chalk.cyan(miningResult.blockHash)}`);
    console.log(`Transactions: ${chalk.cyan(miningResult.transactionCount)} (${pendingCount} pending + 1 mining reward)`);
    console.log(`Mining Reward: ${chalk.yellow(miningResult.reward)} tokens to ${options.rewardAddress}`);
    console.log(`Nonce Found: After ${chalk.cyan(miningResult.miningAttemptsRequired)} attempts`);
    console.log(`Time Required: ${chalk.cyan(miningTime.toFixed(2))} seconds`);
    console.log(`Hash Rate: ${chalk.cyan(Math.floor(miningResult.miningAttemptsRequired / miningTime))} hashes/second`);
    console.log();
    console.log(chalk.green('Block added to the blockchain.'));
    
    // Security reminder if mining to classical address
    if (securityWarning) {
      console.log();
      console.log(chalk.yellow('Remember: Quantum computers may eventually be able to break classical cryptography.'));
      console.log(chalk.yellow('Consider migrating your mining rewards to a quantum-resistant address.'));
    }
  } catch (error) {
    console.error(chalk.red(`Error mining block: ${error.message}`));
    process.exit(1);
  }
}

module.exports = {
  mine
};
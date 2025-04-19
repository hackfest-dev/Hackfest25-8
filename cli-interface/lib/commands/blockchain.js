const { Command } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const { getBlockchain } = require('../blockchain');
const { formatDateTime } = require('../../utils/formatting');

// Command to display blockchain status
const status = new Command('status')
  .description('Display blockchain status')
  .action(async () => {
    try {
      const spinner = ora('Loading blockchain status...').start();
      
      // Get blockchain instance
      const blockchain = await getBlockchain();
      
      // Get blockchain status
      const blockchainStatus = blockchain.getStatus();
      
      spinner.succeed('Blockchain status loaded');
      
      // Display blockchain information
      console.log();
      console.log(chalk.cyan('Blockchain Status:'));
      console.log('-'.repeat(60));
      console.log(`Chain Length: ${chalk.green(blockchainStatus.chainLength)} blocks`);
      console.log(`Latest Block: #${chalk.green(blockchainStatus.latestBlockIndex)} (${blockchainStatus.latestBlockHash.substring(0, 10)}...)`);
      console.log(`Block Time: ${chalk.green(blockchainStatus.formattedTimestamp)}`);
      console.log(`Pending Transactions: ${chalk.yellow(blockchainStatus.pendingTransactions)}`);
      console.log(`Mining Difficulty: ${chalk.cyan(blockchainStatus.miningDifficulty)} (${Math.pow(16, blockchainStatus.miningDifficulty)} hashes on average)`);
      console.log(`Chain Validation: ${blockchainStatus.isValid ? chalk.green('Valid') : chalk.red('Invalid')}`);
      
      // Get security metrics
      const securityMetrics = blockchain.securityMetrics();
      
      console.log();
      console.log(chalk.cyan('Security Metrics:'));
      console.log('-'.repeat(60));
      console.log('Transaction Distribution:');
      console.log(`  Classical: ${chalk.yellow(securityMetrics.transactionCounts.classical)} (${securityMetrics.percentages.classical.toFixed(1)}%)`);
      console.log(`  SPHINCS+: ${chalk.green(securityMetrics.transactionCounts.sphincsPlus)} (${securityMetrics.percentages.sphincsPlus.toFixed(1)}%)`);
      console.log(`  Lattice: ${chalk.green(securityMetrics.transactionCounts.lattice)} (${securityMetrics.percentages.lattice.toFixed(1)}%)`);
      
      console.log();
      console.log('Address Distribution:');
      console.log(`  Classical: ${chalk.yellow(securityMetrics.addresses.classical)}`);
      console.log(`  Quantum-Resistant: ${chalk.green(securityMetrics.addresses.quantum)}`);
      
      console.log();
      console.log('Token Security:');
      console.log(`  Vulnerable: ${chalk.yellow(securityMetrics.balances.classical)} tokens (${securityMetrics.vulnerability.vulnerablePercentage.toFixed(1)}%)`);
      console.log(`  Secure: ${chalk.green(securityMetrics.balances.quantum)} tokens (${securityMetrics.vulnerability.securePercentage.toFixed(1)}%)`);
      
      // Overall security assessment
      console.log();
      console.log('Security Assessment:');
      if (securityMetrics.vulnerability.vulnerablePercentage > 50) {
        console.log(chalk.red(`⚠️  HIGH RISK: ${securityMetrics.vulnerability.vulnerablePercentage.toFixed(1)}% of funds are vulnerable to quantum attacks.`));
      } else if (securityMetrics.vulnerability.vulnerablePercentage > 20) {
        console.log(chalk.yellow(`⚠️  MEDIUM RISK: ${securityMetrics.vulnerability.vulnerablePercentage.toFixed(1)}% of funds are vulnerable to quantum attacks.`));
      } else {
        console.log(chalk.green(`✅ LOW RISK: Only ${securityMetrics.vulnerability.vulnerablePercentage.toFixed(1)}% of funds are vulnerable to quantum attacks.`));
      }
    } catch (error) {
      console.error(chalk.red(`Error getting blockchain status: ${error.message}`));
      process.exit(1);
    }
  });

// Command to display information about a specific block
const info = new Command('info')
  .description('Display information about a specific block')
  .option('-i, --index <index>', 'Block index', parseInt)
  .option('-h, --hash <hash>', 'Block hash')
  .action(async (options) => {
    try {
      if (!options.index && !options.hash) {
        console.error(chalk.red('Error: Either block index or hash must be provided'));
        process.exit(1);
      }
      
      const spinner = ora('Loading block information...').start();
      
      // Get blockchain instance
      const blockchain = await getBlockchain();
      
      // Find block by index or hash
      let block;
      if (options.index !== undefined) {
        block = blockchain.getBlockByIndex(options.index);
      } else {
        block = blockchain.getBlockByHash(options.hash);
      }
      
      if (!block) {
        spinner.fail('Block not found');
        console.error(chalk.red(`Block ${options.index !== undefined ? `#${options.index}` : `with hash ${options.hash}`} not found.`));
        process.exit(1);
      }
      
      spinner.succeed('Block information loaded');
      
      // Calculate security metrics for the block
      const blockMetrics = block.securityMetrics();
      
      // Display block information
      console.log();
      console.log(chalk.cyan(`Block #${block.index} Information:`));
      console.log('-'.repeat(60));
      console.log(`Block Hash: ${chalk.green(block.hash)}`);
      console.log(`Previous Block: ${chalk.yellow(block.previousHash)}`);
      console.log(`Timestamp: ${chalk.cyan(formatDateTime(block.timestamp))}`);
      console.log(`Nonce: ${block.nonce}`);
      console.log(`Transactions: ${block.transactions.length}`);
      
      // Display security metrics
      console.log();
      console.log(chalk.cyan('Block Security Metrics:'));
      console.log('-'.repeat(60));
      console.log(`Classical Transactions: ${chalk.yellow(blockMetrics.classical)} (${(blockMetrics.classicalPercentage || 0).toFixed(1)}%)`);
      console.log(`SPHINCS+ Transactions: ${chalk.green(blockMetrics.sphincsPlus)} (${(blockMetrics.sphincsPlusPercentage || 0).toFixed(1)}%)`);
      console.log(`Lattice Transactions: ${chalk.green(blockMetrics.lattice)} (${(blockMetrics.latticePercentage || 0).toFixed(1)}%)`);
      
      // Display transactions
      console.log();
      console.log(chalk.cyan('Transactions:'));
      console.log('-'.repeat(60));
      
      if (block.transactions.length === 0) {
        console.log('No transactions in this block.');
      } else {
        block.transactions.forEach((tx, i) => {
          const isMiningReward = tx.from === 'MINING_REWARD';
          const isGenesis = tx.from === 'GENESIS';
          
          if (isGenesis) {
            console.log(`${i + 1}. ${chalk.cyan('GENESIS TRANSACTION')}`);
          } else if (isMiningReward) {
            console.log(`${i + 1}. ${chalk.cyan('MINING REWARD')} -> ${tx.to} (${tx.amount} tokens)`);
          } else {
            const securityLabel = tx.signatureType === 'classical' ? 
              chalk.yellow('[CLASSICAL]') : 
              tx.signatureType === 'sphincs' ?
              chalk.green('[SPHINCS+]') :
              chalk.green('[LATTICE]');
              
            console.log(`${i + 1}. ${securityLabel} ${tx.from.substr(0, 10)}... -> ${tx.to.substr(0, 10)}... (${tx.amount} tokens)`);
            console.log(`   TX: ${tx.txHash.substr(0, 15)}...`);
          }
        });
      }
      
      // Block verification
      console.log();
      const validHash = block.calculateHash() === block.hash;
      console.log(`Block Verification: ${validHash ? chalk.green('Valid ✓') : chalk.red('Invalid ✗')}`);
    } catch (error) {
      console.error(chalk.red(`Error getting block info: ${error.message}`));
      process.exit(1);
    }
  });

// Command to display security metrics
const metrics = new Command('metrics')
  .description('Display blockchain security metrics')
  .action(async () => {
    try {
      const spinner = ora('Analyzing blockchain security...').start();
      
      // Get blockchain instance
      const blockchain = await getBlockchain();
      
      // Get security metrics
      const securityMetrics = blockchain.securityMetrics();
      
      spinner.succeed('Security analysis complete');
      
      // Display detailed security metrics
      console.log();
      console.log(chalk.cyan('Quantum Security Analysis:'));
      console.log('='.repeat(80));
      
      // Transaction metrics
      console.log(chalk.cyan('Transaction Metrics:'));
      console.log('-'.repeat(80));
      console.log(`Total Transactions: ${chalk.green(securityMetrics.transactionCounts.total)}`);
      console.log();
      console.log('By Signature Type:');
      console.log(`  Classical (ECDSA): ${chalk.yellow(securityMetrics.transactionCounts.classical)} (${securityMetrics.percentages.classical.toFixed(1)}%)`);
      console.log(`  Quantum (SPHINCS+): ${chalk.green(securityMetrics.transactionCounts.sphincsPlus)} (${securityMetrics.percentages.sphincsPlus.toFixed(1)}%)`);
      console.log(`  Quantum (Lattice): ${chalk.green(securityMetrics.transactionCounts.lattice)} (${securityMetrics.percentages.lattice.toFixed(1)}%)`);
      console.log(`  Combined Quantum: ${chalk.green(securityMetrics.transactionCounts.sphincsPlus + securityMetrics.transactionCounts.lattice)} (${(securityMetrics.percentages.sphincsPlus + securityMetrics.percentages.lattice).toFixed(1)}%)`);
      
      // Address metrics
      console.log();
      console.log(chalk.cyan('Address Metrics:'));
      console.log('-'.repeat(80));
      console.log(`Total Addresses: ${chalk.green(securityMetrics.addresses.classical + securityMetrics.addresses.quantum)}`);
      console.log();
      console.log('By Address Type:');
      console.log(`  Classical (0x...): ${chalk.yellow(securityMetrics.addresses.classical)} (${((securityMetrics.addresses.classical / (securityMetrics.addresses.classical + securityMetrics.addresses.quantum)) * 100).toFixed(1)}%)`);
      console.log(`  Quantum-Resistant (qx/lx...): ${chalk.green(securityMetrics.addresses.quantum)} (${((securityMetrics.addresses.quantum / (securityMetrics.addresses.classical + securityMetrics.addresses.quantum)) * 100).toFixed(1)}%)`);
      
      // Balance metrics
      console.log();
      console.log(chalk.cyan('Balance Security Metrics:'));
      console.log('-'.repeat(80));
      console.log(`Total Tokens: ${chalk.green(securityMetrics.balances.total)}`);
      console.log();
      console.log('By Address Security:');
      console.log(`  Vulnerable (Classical): ${chalk.yellow(securityMetrics.balances.classical)} tokens (${securityMetrics.vulnerability.vulnerablePercentage.toFixed(1)}%)`);
      console.log(`  Secure (Quantum-Resistant): ${chalk.green(securityMetrics.balances.quantum)} tokens (${securityMetrics.vulnerability.securePercentage.toFixed(1)}%)`);
      
      // Security assessment
      console.log();
      console.log(chalk.cyan('Overall Security Assessment:'));
      console.log('-'.repeat(80));
      
      if (securityMetrics.vulnerability.vulnerablePercentage > 50) {
        console.log(chalk.red(`⚠️  HIGH RISK: ${securityMetrics.vulnerability.vulnerablePercentage.toFixed(1)}% of funds are vulnerable to quantum attacks.`));
        console.log(chalk.red(`             ${securityMetrics.balances.classical} tokens in ${securityMetrics.addresses.classical} classical addresses are at risk.`));
        console.log();
        console.log(chalk.yellow('Recommendation: Urgent migration of funds to quantum-resistant addresses is required.'));
      } else if (securityMetrics.vulnerability.vulnerablePercentage > 20) {
        console.log(chalk.yellow(`⚠️  MEDIUM RISK: ${securityMetrics.vulnerability.vulnerablePercentage.toFixed(1)}% of funds are vulnerable to quantum attacks.`));
        console.log(chalk.yellow(`                ${securityMetrics.balances.classical} tokens in ${securityMetrics.addresses.classical} classical addresses are at risk.`));
        console.log();
        console.log(chalk.yellow('Recommendation: Gradual migration of funds to quantum-resistant addresses is recommended.'));
      } else {
        console.log(chalk.green(`✅ LOW RISK: Only ${securityMetrics.vulnerability.vulnerablePercentage.toFixed(1)}% of funds are vulnerable to quantum attacks.`));
        console.log(chalk.green(`            ${securityMetrics.balances.classical} tokens in ${securityMetrics.addresses.classical} classical addresses are at risk.`));
        console.log();
        console.log(chalk.green('Recommendation: Continue using quantum-resistant addresses for new transactions.'));
      }
      
      // Trend analysis (simulated)
      console.log();
      console.log(chalk.cyan('Security Trend Analysis:'));
      console.log('-'.repeat(80));
      
      // Simulate some trend data based on the current metrics
      const classicalTrend = securityMetrics.percentages.classical > 50 ? 'increasing' : 'decreasing';
      const quantumTrend = securityMetrics.percentages.sphincsPlus + securityMetrics.percentages.lattice > 50 ? 'increasing' : 'decreasing';
      
      console.log(`Classical Usage: ${classicalTrend === 'decreasing' ? chalk.green('Decreasing ↓') : chalk.red('Increasing ↑')}`);
      console.log(`Quantum-Resistant Usage: ${quantumTrend === 'increasing' ? chalk.green('Increasing ↑') : chalk.red('Decreasing ↓')}`);
      
      // Mitigation advice
      console.log();
      console.log(chalk.cyan('Quantum Attack Mitigation:'));
      console.log('-'.repeat(80));
      console.log('1. Use SPHINCS+ or Lattice-based signatures for all new transactions');
      console.log('2. Migrate existing funds from classical to quantum-resistant addresses');
      console.log('3. Monitor the development of quantum computing capabilities');
      console.log(`4. Use the attack simulation tool to assess specific vulnerabilities: ${chalk.cyan('quantum-chain attack simulate')}`);
    } catch (error) {
      console.error(chalk.red(`Error analyzing security metrics: ${error.message}`));
      process.exit(1);
    }
  });

module.exports = {
  status,
  info,
  metrics
};

const { Command } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const { Wallet } = require('../wallet');
const { getBlockchain } = require('../blockchain');
const { formatTransaction } = require('../transaction');
const { formatDateTime } = require('../../utils/formatting');

// Command to create a new transaction
const create = new Command('create')
  .description('Create a new transaction')
  .requiredOption('-f, --from <id>', 'Wallet ID to send from')
  .requiredOption('-t, --to <address>', 'Recipient address (0x... or qx... or lx...)')
  .requiredOption('-a, --amount <amount>', 'Amount to send', parseFloat)
  .option('-y, --type <type>', 'Signature type (classical, sphincs, lattice)', 'classical')
  .action(async (options) => {
    try {
      // Validate amount
      if (isNaN(options.amount) || options.amount <= 0) {
        console.error(chalk.red('Error: Amount must be a positive number'));
        process.exit(1);
      }
      
      // Validate address format
      if (!(options.to.startsWith('0x') || options.to.startsWith('qx') || options.to.startsWith('lx'))) {
        console.error(chalk.red('Error: Invalid address format. Must start with 0x, qx, or lx'));
        process.exit(1);
      }
      
      // Validate signature type
      if (!['classical', 'sphincs', 'lattice'].includes(options.type)) {
        console.error(chalk.red('Error: Invalid signature type. Must be classical, sphincs, or lattice'));
        process.exit(1);
      }
      
      // Load wallet
      const spinner = ora('Loading wallet...').start();
      const wallet = await Wallet.load(options.from);
      
      // Check wallet balance
      spinner.text = 'Checking balance...';
      const balance = await wallet.getBalance();
      
      let availableBalance;
      switch (options.type) {
        case 'classical':
          availableBalance = balance.classical;
          break;
        case 'sphincs':
          availableBalance = balance.sphincsPlus;
          break;
        case 'lattice':
          availableBalance = balance.lattice;
          break;
      }
      
      if (availableBalance < options.amount) {
        spinner.fail(`Insufficient balance in ${options.type} address`);
        console.error(chalk.red(`Error: Insufficient balance. Available: ${availableBalance}, Required: ${options.amount}`));
        process.exit(1);
      }
      
      spinner.succeed('Wallet loaded and balance verified');
      
      // Get from address based on signature type
      let fromAddress;
      switch (options.type) {
        case 'classical':
          fromAddress = wallet.classicalAddress;
          break;
        case 'sphincs':
          fromAddress = wallet.sphincsPlusAddress;
          break;
        case 'lattice':
          fromAddress = wallet.latticeAddress;
          break;
      }
      
      // Display transaction information
      console.log();
      console.log(chalk.cyan('Transaction Information:'));
      console.log('-'.repeat(60));
      console.log(`From: ${chalk.yellow(fromAddress)}`);
      console.log(`To: ${chalk.green(options.to)}`);
      console.log(`Amount: ${chalk.cyan(options.amount)} tokens`);
      console.log(`Signature Type: ${options.type === 'classical' ? chalk.yellow('Classical (ECDSA)') : 
                                   options.type === 'sphincs' ? chalk.green('Quantum-Resistant (SPHINCS+)') :
                                   chalk.green('Quantum-Resistant (Lattice)')}`);
      
      // Security warning for classical signatures
      if (options.type === 'classical') {
        console.log();
        console.log(chalk.yellow('⚠️  Security Warning:'));
        console.log(chalk.yellow('This transaction uses classical cryptography that may be vulnerable to quantum attacks.'));
      }
      
      // Prompt for password
      const { password } = await inquirer.prompt([
        {
          type: 'password',
          name: 'password',
          message: 'Enter wallet password:',
          validate: input => input ? true : 'Password is required'
        }
      ]);
      
      // Sign and create transaction
      spinner.text = options.type === 'classical' ? 
        'Signing transaction with ECDSA (classical)...' : 
        options.type === 'sphincs' ?
        'Signing transaction with SPHINCS+ (quantum-resistant)...' :
        'Signing transaction with Lattice (quantum-resistant)...';
      spinner.start();
      
      const tx = await wallet.createTransaction(options.to, options.amount, options.type, password);
      
      spinner.succeed('Transaction created and signed!');
      
      // Display transaction results
      console.log();
      console.log(chalk.green('Transaction created and signed!'));
      console.log(`Transaction Hash: ${chalk.cyan(tx.txHash)}`);
      console.log(`Status: ${chalk.yellow('Pending')} (waiting to be mined)`);
      console.log();
      console.log(`Type '${chalk.cyan(`quantum-chain tx info --hash ${tx.txHash.substring(0, 8)}...`)}' to check status.`);
    } catch (error) {
      console.error(chalk.red(`Error creating transaction: ${error.message}`));
      process.exit(1);
    }
  });

// Command to display transaction information
const info = new Command('info')
  .description('Show transaction information')
  .requiredOption('-h, --hash <hash>', 'Transaction hash')
  .action(async (options) => {
    try {
      const spinner = ora('Looking up transaction...').start();
      
      // Get blockchain instance
      const blockchain = await getBlockchain();
      
      // Find transaction
      const tx = blockchain.getTransactionByHash(options.hash);
      
      if (!tx) {
        spinner.fail('Transaction not found');
        console.error(chalk.red(`Transaction with hash ${options.hash} not found.`));
        process.exit(1);
      }
      
      spinner.succeed('Transaction found');
      
      // Format transaction data
      const formattedTx = formatTransaction(tx);
      
      // Display transaction information
      console.log();
      console.log(chalk.cyan('Transaction Information:'));
      console.log('-'.repeat(60));
      console.log(`Transaction Hash: ${chalk.cyan(tx.txHash)}`);
      console.log(`Status: ${tx.confirmed ? chalk.green('Confirmed') : chalk.yellow('Pending')}`);
      
      if (tx.confirmed) {
        console.log(`Block: #${chalk.cyan(tx.blockIndex)} (${tx.blockHash.substring(0, 10)}...)`);
      }
      
      console.log(`Timestamp: ${chalk.cyan(formattedTx.formattedTimestamp)}`);
      console.log();
      console.log(`From: ${chalk.yellow(tx.from)}`);
      console.log(`To: ${chalk.green(tx.to)}`);
      console.log(`Amount: ${chalk.cyan(tx.amount)} tokens`);
      console.log();
      console.log(`Signature Type: ${formattedTx.signatureSecurity}`);
      
      // Display security information based on signature type
      console.log();
      console.log(chalk.cyan('Security Information:'));
      console.log('-'.repeat(60));
      
      if (tx.signatureType === 'classical') {
        console.log(chalk.yellow('⚠️  This transaction uses classical ECDSA signatures.'));
        console.log(chalk.yellow('    It is potentially vulnerable to attacks from quantum computers.'));
        console.log(chalk.yellow('    Consider using quantum-resistant signatures for future transactions.'));
        
        const classicalCrypto = require('../cryptography/classical');
        const securityLevel = classicalCrypto.getSecurityLevel();
        console.log();
        console.log(`Classical Security: ${chalk.green(securityLevel.classical)} bits`);
        console.log(`Quantum Security: ${chalk.red(securityLevel.quantum)} bits`);
        console.log();
        console.log('Vulnerability: High - Shor\'s algorithm can break ECDSA efficiently on a quantum computer.');
      } else if (tx.signatureType === 'sphincs') {
        console.log(chalk.green('✅ This transaction uses quantum-resistant SPHINCS+ signatures.'));
        console.log(chalk.green('   It is secure against known quantum computing attacks.'));
        
        const sphincsCrypto = require('../cryptography/sphincs');
        const securityLevel = sphincsCrypto.getSecurityLevel();
        console.log();
        console.log(`Security Level: ${chalk.green(securityLevel)} bits`);
        console.log();
        console.log('Vulnerability: Low - SPHINCS+ is designed to be secure against quantum computers.');
        console.log('Algorithm: Hash-based signature scheme, resistant to Shor\'s algorithm.');
      } else if (tx.signatureType === 'lattice') {
        console.log(chalk.green('✅ This transaction uses quantum-resistant lattice-based signatures.'));
        console.log(chalk.green('   It is secure against known quantum computing attacks.'));
        
        const latticeCrypto = require('../cryptography/lattice');
        const securityLevel = latticeCrypto.getSecurityLevel();
        console.log();
        console.log(`Security Level: ${chalk.green(securityLevel)} bits`);
        console.log();
        console.log('Vulnerability: Low - Lattice-based cryptography is designed to be secure against quantum computers.');
        console.log('Algorithm: Based on the hardness of lattice problems, resistant to Shor\'s algorithm.');
      }
    } catch (error) {
      console.error(chalk.red(`Error getting transaction info: ${error.message}`));
      process.exit(1);
    }
  });

module.exports = {
  create,
  info
};
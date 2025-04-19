const { Command } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const { Wallet } = require('../wallet');
const { formatDateTime } = require('../../utils/formatting');

// Command to create a new wallet
const create = new Command('create')
  .description('Create a new wallet with classical and quantum-resistant keys')
  .option('-n, --name <name>', 'Wallet name')
  .option('-p, --password <password>', 'Wallet password (not recommended for production use)')
  .action(async (options) => {
    try {
      // Prompt for name if not provided
      if (!options.name) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: 'Enter a name for your new wallet:',
            validate: input => input.trim() ? true : 'Wallet name is required'
          }
        ]);
        options.name = answers.name;
      }
      
      // Prompt for password if not provided
      if (!options.password) {
        const answers = await inquirer.prompt([
          {
            type: 'password',
            name: 'password',
            message: 'Enter a password to encrypt your wallet:',
            validate: input => input.length >= 8 ? true : 'Password must be at least 8 characters'
          },
          {
            type: 'password',
            name: 'confirmPassword',
            message: 'Confirm your password:',
            validate: (input, answers) => input === answers.password ? true : 'Passwords do not match'
          }
        ]);
        options.password = answers.password;
      }
      
      // Create wallet with spinner
      const spinner = ora('Creating wallet with quantum-resistant keys...').start();
      
      const wallet = await Wallet.create(options.name, options.password);
      
      spinner.succeed('Wallet created successfully!');
      
      // Display wallet info
      console.log();
      console.log(chalk.green('✅ Wallet created successfully!'));
      console.log();
      console.log(`Wallet ID: ${chalk.cyan(wallet.id)}`);
      console.log(`Name: ${chalk.cyan(wallet.name)}`);
      console.log();
      console.log(`Classical Address: ${chalk.yellow(wallet.classicalAddress)}`);
      console.log(`Quantum Address (SPHINCS+): ${chalk.green(wallet.sphincsPlusAddress)}`);
      console.log(`Quantum Address (Lattice): ${chalk.green(wallet.latticeAddress)}`);
      console.log();
      console.log(chalk.yellow('Your wallet has been encrypted and saved.'));
      console.log(chalk.yellow('Keep your password and Wallet ID safe!'));
    } catch (error) {
      console.error(chalk.red(`Error creating wallet: ${error.message}`));
      process.exit(1);
    }
  });

// Command to display wallet info
const info = new Command('info')
  .description('Display wallet information')
  .requiredOption('-i, --id <id>', 'Wallet ID')
  .action(async (options) => {
    try {
      const spinner = ora('Loading wallet information...').start();
      
      // Load wallet
      const wallet = await Wallet.load(options.id);
      
      // Get balance
      const balance = await wallet.getBalance();
      
      // Get transaction history
      const txHistory = await wallet.getTransactionHistory();
      
      spinner.succeed('Wallet information loaded');
      
      // Display wallet info
      console.log();
      console.log(chalk.cyan('Wallet Information:'));
      console.log('-'.repeat(40));
      console.log(`Wallet ID: ${chalk.cyan(wallet.id)}`);
      console.log(`Name: ${chalk.cyan(wallet.name)}`);
      console.log();
      
      // Display addresses
      console.log(chalk.cyan('Addresses:'));
      console.log(`Classical (ECDSA): ${chalk.yellow(wallet.classicalAddress)}`);
      console.log(`Quantum (SPHINCS+): ${chalk.green(wallet.sphincsPlusAddress)}`);
      console.log(`Quantum (Lattice): ${chalk.green(wallet.latticeAddress)}`);
      console.log();
      
      // Display balances
      console.log(chalk.cyan('Balances:'));
      console.log(`Classical: ${chalk.yellow(balance.classical)} tokens`);
      console.log(`Quantum (SPHINCS+): ${chalk.green(balance.sphincsPlus)} tokens`);
      console.log(`Quantum (Lattice): ${chalk.green(balance.lattice)} tokens`);
      console.log(chalk.cyan('-'.repeat(20)));
      console.log(`Total: ${chalk.cyan(balance.total)} tokens`);
      console.log();
      
      // Display recent transactions
      console.log(chalk.cyan('Recent Transactions:'));
      if (txHistory.length === 0) {
        console.log('No transactions found.');
      } else {
        // Display the 5 most recent transactions
        const recentTx = txHistory.slice(0, 5);
        
        recentTx.forEach(tx => {
          const isIncoming = tx.to === wallet.classicalAddress || 
                             tx.to === wallet.sphincsPlusAddress ||
                             tx.to === wallet.latticeAddress;
          
          const amount = isIncoming ? chalk.green(`+${tx.amount}`) : chalk.red(`-${tx.amount}`);
          const status = tx.confirmed ? chalk.green('Confirmed') : chalk.yellow('Pending');
          const date = formatDateTime(tx.timestamp);
          
          console.log(`${date} | ${amount} | ${status}`);
          console.log(`  ${isIncoming ? 'From' : 'To'}: ${isIncoming ? tx.from.substring(0, 10) + '...' : tx.to.substring(0, 10) + '...'}`);
          console.log(`  Type: ${tx.signatureType === 'classical' ? chalk.yellow('Classical') : chalk.green('Quantum')}`);
          console.log(`  TX: ${tx.txHash.substring(0, 10)}...`);
          console.log();
        });
        
        if (txHistory.length > 5) {
          console.log(`... and ${txHistory.length - 5} more transactions`);
        }
      }
      
      // Display security warning for classical balance
      if (balance.classical > 0) {
        console.log();
        console.log(chalk.yellow('⚠️  Security Warning:'));
        console.log(chalk.yellow(`You have ${balance.classical} tokens in a classical address that is vulnerable to quantum attacks.`));
        console.log(chalk.yellow(`Consider migrating these funds to a quantum-resistant address using:`));
        console.log(chalk.cyan(`quantum-chain wallet migrate --id "${wallet.id}"`));
      }
    } catch (error) {
      console.error(chalk.red(`Error getting wallet info: ${error.message}`));
      process.exit(1);
    }
  });

// Command to list all wallets
const list = new Command('list')
  .description('List all wallets')
  .action(async () => {
    try {
      const spinner = ora('Loading wallets...').start();
      
      // Get all wallets
      const wallets = await Wallet.listWallets();
      
      spinner.succeed(`Found ${wallets.length} wallet(s)`);
      
      // Display wallets
      console.log();
      console.log(chalk.cyan('Available Wallets:'));
      console.log('-'.repeat(80));
      
      if (wallets.length === 0) {
        console.log('No wallets found. Create one with "quantum-chain wallet create"');
      } else {
        console.log(chalk.cyan('ID                                   | Name                | Classical Address | Quantum Addresses'));
        console.log('-'.repeat(80));
        
        for (const wallet of wallets) {
          const classicalShort = wallet.classicalAddress.substring(0, 10) + '...';
          const sphincsShort = wallet.sphincsPlusAddress.substring(0, 10) + '...';
          
          console.log(`${wallet.id} | ${wallet.name.padEnd(19)} | ${classicalShort} | ${sphincsShort}`);
        }
      }
    } catch (error) {
      console.error(chalk.red(`Error listing wallets: ${error.message}`));
      process.exit(1);
    }
  });

// Command to show wallet balance
const balance = new Command('balance')
  .description('Show wallet balance')
  .option('-i, --id <id>', 'Wallet ID')
  .option('-a, --address <address>', 'Address to check (0x... or qx... or lx...)')
  .action(async (options) => {
    try {
      if (!options.id && !options.address) {
        console.error(chalk.red('Error: Either wallet ID or address must be provided'));
        process.exit(1);
      }
      
      const spinner = ora('Retrieving balance...').start();
      
      let balance;
      
      if (options.id) {
        // Load wallet and get its balance
        const wallet = await Wallet.load(options.id);
        balance = await wallet.getBalance();
        
        spinner.succeed('Balance retrieved successfully');
        
        // Display balances
        console.log();
        console.log(chalk.cyan(`Balance for wallet "${wallet.name}" (${wallet.id}):`));
        console.log('-'.repeat(40));
        console.log(`Classical (${wallet.classicalAddress.substring(0, 10)}...): ${chalk.yellow(balance.classical)} tokens`);
        console.log(`Quantum SPHINCS+ (${wallet.sphincsPlusAddress.substring(0, 10)}...): ${chalk.green(balance.sphincsPlus)} tokens`);
        console.log(`Quantum Lattice (${wallet.latticeAddress.substring(0, 10)}...): ${chalk.green(balance.lattice)} tokens`);
        console.log('-'.repeat(40));
        console.log(`Total: ${chalk.cyan(balance.total)} tokens`);
        
        // Security warning
        if (balance.classical > 0) {
          console.log();
          console.log(chalk.yellow('⚠️  Security Warning:'));
          console.log(chalk.yellow(`${balance.classical} tokens (${((balance.classical/balance.total)*100).toFixed(1)}% of your funds) are in a classical address vulnerable to quantum attacks.`));
        }
      } else {
        // Get balance for a specific address
        const { getBlockchain } = require('../blockchain');
        const blockchain = await getBlockchain();
        const addressBalance = await blockchain.getAddressBalance(options.address);
        
        spinner.succeed('Balance retrieved successfully');
        
        // Display balance
        console.log();
        console.log(chalk.cyan(`Balance for address ${options.address}:`));
        console.log('-'.repeat(40));
        console.log(`Balance: ${chalk.cyan(addressBalance)} tokens`);
        
        // Security warning for classical addresses
        if (options.address.startsWith('0x')) {
          console.log();
          console.log(chalk.yellow('⚠️  Security Warning:'));
          console.log(chalk.yellow('This is a classical address vulnerable to quantum computing attacks.'));
        }
      }
    } catch (error) {
      console.error(chalk.red(`Error retrieving balance: ${error.message}`));
      process.exit(1);
    }
  });

// Command to migrate from classical to quantum address
const migrate = new Command('migrate')
  .description('Migrate funds from classical to quantum-resistant address')
  .requiredOption('-i, --id <id>', 'Wallet ID')
  .option('-t, --to-quantum <type>', 'Type of quantum address (sphincs, lattice)', 'sphincs')
  .action(async (options) => {
    try {
      // First get wallet info
      const spinner = ora('Loading wallet information...').start();
      const wallet = await Wallet.load(options.id);
      const balance = await wallet.getBalance();
      
      spinner.succeed('Wallet information loaded');
      
      // Check if there are funds to migrate
      if (balance.classical <= 0) {
        console.log(chalk.yellow('No funds to migrate. Classical address balance is 0.'));
        process.exit(0);
      }
      
      // Confirm migration
      console.log();
      console.log(chalk.cyan('Migration Information:'));
      console.log('-'.repeat(60));
      console.log(`From: ${chalk.yellow(wallet.classicalAddress)} (Classical)`);
      
      let toAddress;
      if (options.toQuantum === 'sphincs') {
        toAddress = wallet.sphincsPlusAddress;
        console.log(`To: ${chalk.green(toAddress)} (Quantum SPHINCS+)`);
      } else if (options.toQuantum === 'lattice') {
        toAddress = wallet.latticeAddress;
        console.log(`To: ${chalk.green(toAddress)} (Quantum Lattice)`);
      } else {
        console.error(chalk.red(`Invalid quantum type: ${options.toQuantum}. Use 'sphincs' or 'lattice'.`));
        process.exit(1);
      }
      
      console.log(`Amount: ${chalk.cyan(balance.classical)} tokens`);
      console.log();
      
      // Prompt for confirmation
      const confirm = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: 'Do you want to proceed with the migration?',
          default: true
        }
      ]);
      
      if (!confirm.proceed) {
        console.log(chalk.yellow('Migration cancelled.'));
        process.exit(0);
      }
      
      // Prompt for password
      const { password } = await inquirer.prompt([
        {
          type: 'password',
          name: 'password',
          message: 'Enter your wallet password:',
          validate: input => input ? true : 'Password is required'
        }
      ]);
      
      // Perform migration
      spinner.text = 'Migrating funds...';
      spinner.start();
      
      const result = await wallet.migrateToQuantum(password, options.toQuantum);
      
      spinner.succeed('Migration initiated successfully');
      
      // Display result
      console.log();
      console.log(chalk.green('✅ Migration transaction created!'));
      console.log(`Transaction Hash: ${chalk.cyan(result.transactionHash)}`);
      console.log(`From: ${chalk.yellow(result.from)}`);
      console.log(`To: ${chalk.green(result.to)}`);
      console.log(`Amount: ${chalk.cyan(result.amount)} tokens`);
      console.log();
      console.log(chalk.yellow('The transaction has been added to the mempool and will be mined in the next block.'));
      console.log(chalk.yellow(`Check status with: quantum-chain tx info --hash "${result.transactionHash}"`));
    } catch (error) {
      console.error(chalk.red(`Error migrating funds: ${error.message}`));
      process.exit(1);
    }
  });

module.exports = {
  create,
  info,
  list,
  balance,
  migrate
};
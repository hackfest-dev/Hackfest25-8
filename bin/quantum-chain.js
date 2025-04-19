
const program = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const { version } = require('../package.json');

const walletCommands = require('../lib/commands/wallet');
const transactionCommands = require('../lib/commands/transaction');
const blockchainCommands = require('../lib/commands/blockchain');
const miningCommands = require('../lib/commands/mining');
const attackCommands = require('../lib/commands/attack');

// Display CLI banner
console.log(
  chalk.cyan(
    figlet.textSync('Quantum-Chain', { horizontalLayout: 'full' })
  )
);

program
  .version(version)
  .description('A quantum-resistant blockchain implementation with attack simulation capabilities');

program
  .command('wallet')
  .description('Wallet management commands')
  .addCommand(walletCommands.create)
  .addCommand(walletCommands.info)
  .addCommand(walletCommands.list)
  .addCommand(walletCommands.balance)
  .addCommand(walletCommands.migrate);

// Transaction Commands
program
  .command('tx')
  .description('Transaction operations')
  .addCommand(transactionCommands.create)
  .addCommand(transactionCommands.info);

// Blockchain Commands
program
  .command('chain')
  .description('Blockchain operations')
  .addCommand(blockchainCommands.status);

program
  .command('block')
  .description('Block operations')
  .addCommand(blockchainCommands.info);

// Mining Commands
// program
//   .command('mine')
//   .description('Mining operations')
//   .action(miningCommands.mine);

program
  .command('mine')
  .description('Mine a new block and receive a mining reward')
  .option('-r, --reward-address <address>', 'Address to receive the mining reward')
  .action(async (options) => {
    try {
      // FIX: Change this line from options.rewardAddress to options.rewardAddress
      if (!options.rewardAddress) {
        throw new Error('Reward address is required (--reward-address)');
      }
      
      const ora = require('ora'); // Add this line to import ora
      const { getBlockchain } = require('../lib/blockchain'); // Add this line to import getBlockchain
      
      const spinner = ora('Mining new block...').start();
      
      const blockchain = await getBlockchain();
      const result = await blockchain.mineBlock(options.rewardAddress);
      
      spinner.succeed('Block mined successfully!');
      
      console.log('\n✅ Block #' + result.blockIndex + ' mined successfully!');
      console.log('Block Hash: ' + result.blockHash);
      console.log('Transactions: ' + result.transactionCount);
      console.log('Mining Reward: ' + result.reward + ' tokens to ' + result.minerAddress);
      console.log('Nonce Found: After ' + result.miningAttemptsRequired + ' attempts');
      console.log('\nBlock added to the blockchain.');
    } catch (error) {
      console.error('\n❌ Error mining block:', error.message);
    }
  });

// Security Commands
program
  .command('security')
  .description('Security operations')
  .addCommand(blockchainCommands.metrics);

// Attack Simulation Commands
program
  .command('attack')
  .description('Quantum attack simulation')
  .addCommand(attackCommands.analyze)
  .addCommand(attackCommands.simulate)
  .addCommand(attackCommands.report);

// Add global help information
program.on('--help', () => {
  console.log('');
  console.log('Examples:');
  console.log('  $ quantum-chain wallet create --name "MyWallet" --password "securepassword"');
  console.log('  $ quantum-chain tx create --from "wallet-uuid" --to "0x123..." --amount 10 --type classical');
  console.log('  $ quantum-chain mine --reward-address "qx456..."');
  console.log('  $ quantum-chain attack simulate --qubits 4000 --target "0x789..."');
});

program.parse(process.argv);

// If no arguments provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
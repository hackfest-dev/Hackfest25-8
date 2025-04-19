
import Web3 from 'web3';

export interface MetaMaskAccount {
  address: string;
  balance: string;
}

export const metaMaskService = {
  /**
   * Check if MetaMask is installed
   */
  isMetaMaskInstalled(): boolean {
    return typeof window !== 'undefined' && window.ethereum !== undefined;
  },

  /**
   * Request connection to MetaMask
   * @returns Connected account information
   */
  async connectWallet(): Promise<MetaMaskAccount> {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const web3 = new Web3(window.ethereum as any);
      const balance = await web3.eth.getBalance(accounts[0]);
      const balanceInEth = web3.utils.fromWei(balance, 'ether');

      return {
        address: accounts[0],
        balance: balanceInEth
      };
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      throw error;
    }
  },

  /**
   * Get the current connected account
   * @returns Connected account or null if not connected
   */
  async getCurrentAccount(): Promise<MetaMaskAccount | null> {
    if (!this.isMetaMaskInstalled()) {
      return null;
    }

    try {
      const web3 = new Web3(window.ethereum as any);
      const accounts = await web3.eth.getAccounts();
      
      if (accounts.length === 0) {
        return null;
      }

      const balance = await web3.eth.getBalance(accounts[0]);
      const balanceInEth = web3.utils.fromWei(balance, 'ether');

      return {
        address: accounts[0],
        balance: balanceInEth
      };
    } catch (error) {
      console.error('Error getting current account:', error);
      return null;
    }
  },

  /**
   * Sign a message with MetaMask
   * @param address Address to sign with
   * @param message Message to sign
   * @returns Signature
   */
  async signMessage(address: string, message: string): Promise<string> {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }

    try {
      const web3 = new Web3(window.ethereum as any);
      const messageHex = web3.utils.utf8ToHex(message);
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [messageHex, address],
      });
      
      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  }
};

export default metaMaskService;

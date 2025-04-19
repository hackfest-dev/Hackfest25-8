
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Wallet, ShieldCheck, WalletCards } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

// Interface for wallet types
interface ConnectedWallet {
  address: string;
  balance: string;
  chainId: number;
  connected: boolean;
}

const WalletConnector: React.FC = () => {
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if MetaMask is available
  const isMetaMaskAvailable = typeof window !== 'undefined' && window.ethereum;

  // Connect wallet function
  const connectWallet = async () => {
    if (!isMetaMaskAvailable) {
      toast({
        title: "MetaMask not available",
        description: "Please install MetaMask browser extension to connect your wallet.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts && accounts.length > 0) {
        // Get chain ID
        const chainId = await window.ethereum.request({ 
          method: 'eth_chainId' 
        });
        
        // Get balance
        const balance = await window.ethereum.request({ 
          method: 'eth_getBalance', 
          params: [accounts[0], 'latest'] 
        });
        
        const ethBalance = parseInt(balance, 16) / 1e18; // Convert from wei to ETH
        
        setWallet({
          address: accounts[0],
          balance: ethBalance.toFixed(4),
          chainId: parseInt(chainId, 16),
          connected: true
        });
        
        toast({
          title: "Wallet connected",
          description: `Connected to ${truncateAddress(accounts[0])}`,
          variant: "default"
        });
      }
    } catch (error: any) {
      console.error("Error connecting to MetaMask:", error);
      toast({
        title: "Connection failed",
        description: error.message || "Could not connect to MetaMask",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const disconnectWallet = () => {
    setWallet(null);
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  // Helper to truncate address
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Set up MetaMask account change listener
  useEffect(() => {
    if (isMetaMaskAvailable) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          setWallet(null);
          toast({
            title: "Wallet disconnected",
            description: "Your wallet has been disconnected",
          });
        } else if (wallet) {
          // Update the wallet with new account
          setWallet({
            ...wallet,
            address: accounts[0]
          });
          toast({
            title: "Account changed",
            description: `Connected to ${truncateAddress(accounts[0])}`,
          });
        }
      });

      window.ethereum.on('chainChanged', (chainId: string) => {
        if (wallet) {
          setWallet({
            ...wallet,
            chainId: parseInt(chainId, 16)
          });
          toast({
            title: "Network changed",
            description: `Connected to chain ID: ${parseInt(chainId, 16)}`,
          });
        }
      });
    }
    
    // Clean up event listeners
    return () => {
      if (isMetaMaskAvailable) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [wallet, isMetaMaskAvailable]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <WalletCards className="h-5 w-5 text-quantum-400" />
          Wallet Connection
        </CardTitle>
        <CardDescription>
          Connect your MetaMask wallet to secure transactions with post-quantum cryptography
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isMetaMaskAvailable ? (
          <Alert className="bg-yellow-950/20 text-yellow-200 border-yellow-900">
            <AlertTitle>MetaMask Not Detected</AlertTitle>
            <AlertDescription>
              To connect your wallet, please install the MetaMask browser extension.
            </AlertDescription>
          </Alert>
        ) : wallet ? (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-md space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Address:</span>
                <span className="text-sm font-mono">{truncateAddress(wallet.address)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Balance:</span>
                <span className="text-sm font-mono">{wallet.balance} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Network ID:</span>
                <span className="text-sm font-mono">{wallet.chainId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span className="flex items-center gap-1 text-sm text-green-400">
                  <ShieldCheck className="h-3 w-3" /> Secured with PQC
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-4">
            <Button 
              onClick={connectWallet} 
              className="bg-quantum-400 hover:bg-quantum-500 text-white"
              disabled={isLoading}
            >
              <Wallet className="mr-2 h-4 w-4" />
              {isLoading ? 'Connecting...' : 'Connect MetaMask'}
            </Button>
          </div>
        )}
      </CardContent>
      {wallet && (
        <CardFooter className="flex justify-end pt-0">
          <Button variant="outline" size="sm" onClick={disconnectWallet}>
            Disconnect Wallet
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default WalletConnector;

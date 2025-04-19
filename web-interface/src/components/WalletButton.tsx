
import React, { useState, useEffect } from "react";
import { Wallet, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { metaMaskService } from "@/services/metaMaskService";

interface WalletButtonProps {
  onWalletChange?: (address: string | null) => void;
}

const WalletButton: React.FC<WalletButtonProps> = ({
  onWalletChange,
}) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");

  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      try {
        const account = await metaMaskService.getCurrentAccount();
        if (account) {
          setWalletConnected(true);
          setWalletAddress(account.address);
          setWalletBalance(account.balance);
          onWalletChange?.(account.address);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };

    checkConnection();

    // Setup event listeners for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          handleDisconnect();
        } else {
          // Account changed
          setWalletAddress(accounts[0]);
          onWalletChange?.(accounts[0]);
        }
      });
    }

    return () => {
      // Clean up listeners
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, [onWalletChange]);

  const handleConnect = async () => {
    try {
      if (!metaMaskService.isMetaMaskInstalled()) {
        toast("MetaMask Not Found", {
          description: "Please install MetaMask browser extension to connect your wallet",
        });
        return;
      }

      const account = await metaMaskService.connectWallet();
      setWalletConnected(true);
      setWalletAddress(account.address);
      setWalletBalance(account.balance);
      onWalletChange?.(account.address);

      toast("Wallet Connected", {
        description: "Your wallet has been successfully connected",
      });
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast("Connection Failed", {
        description: error.message || "Failed to connect wallet",
      });
    }
  };

  const handleDisconnect = () => {
    // MetaMask doesn't actually have a disconnect method, but we can update our UI
    setWalletConnected(false);
    setWalletAddress("");
    setWalletBalance("");
    onWalletChange?.(null);
    
    toast("Wallet Disconnected", {
      description: "Your wallet has been disconnected from this application",
    });
  };

  if (walletConnected) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center px-4 py-2 rounded-md bg-green-900/30 border border-green-700 text-green-400">
          <Wallet className="h-4 w-4 mr-2" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
            </span>
            <span className="text-xs">{parseFloat(walletBalance).toFixed(4)} ETH</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-red-700 text-red-400 hover:bg-red-900/30 hover:text-red-300"
          onClick={handleDisconnect}
        >
          <LogOut className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <Button 
      className="quantum-button px-4 py-2 rounded-md flex items-center gap-2"
      onClick={handleConnect}
    >
      <Wallet className="h-4 w-4" />
      Connect MetaMask
    </Button>
  );
};

export default WalletButton;

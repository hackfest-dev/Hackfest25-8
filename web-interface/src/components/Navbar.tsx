
import React, { useState, useEffect } from "react";
import { Shield, Lock, Search, LayoutGrid, Wallet, PackageCheck, FileText, History, Copy } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import WalletButton from "./WalletButton";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // This handles keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearch = (value: string) => {
    setOpen(false);
    
    // Navigate to the appropriate page based on the search selection
    navigate(value);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-purple-500" />
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold quantum-text-gradient">
              QuantumSafe
              <span className="text-white">Ledger</span>
            </h1>
          </Link>
        </div>

        <div className="relative hidden md:block w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search transactions, blocks, addresses..."
            className="w-full py-2 pl-10 pr-4 rounded-md bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            onClick={() => setOpen(true)}
            readOnly
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-green-400">
            <Lock className="h-4 w-4" />
            <span className="text-sm font-medium">Quantum Secure</span>
          </div>
          
          <WalletButton onWalletChange={(address) => {
            console.log("Wallet changed:", address);
          }} />
        </div>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search transactions, blocks, addresses..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem onSelect={() => handleSearch("/")}>
              <LayoutGrid className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSearch("/blockchain")}>
              <PackageCheck className="mr-2 h-4 w-4" />
              <span>Blockchain</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSearch("/transactions")}>
              <History className="mr-2 h-4 w-4" />
              <span>Transactions</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSearch("/contracts")}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Smart Contracts</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Sample Addresses">
            <CommandItem 
              onSelect={() => copyToClipboard("0x71C7656EC7ab88b098defB751B7401B5f6d8976F")}
              className="flex justify-between"
            >
              <div className="flex items-center">
                <Wallet className="mr-2 h-4 w-4" />
                <span className="font-mono">0x71C7...976F</span>
              </div>
              <Copy className="h-3 w-3 text-slate-400" />
            </CommandItem>
            <CommandItem 
              onSelect={() => copyToClipboard("0x742d35Cc6634C0532925a3b844Bc454e4438f44e")}
              className="flex justify-between"
            >
              <div className="flex items-center">
                <Wallet className="mr-2 h-4 w-4" />
                <span className="font-mono">0x742d...f44e</span>
              </div>
              <Copy className="h-3 w-3 text-slate-400" />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
};

export default Navbar;

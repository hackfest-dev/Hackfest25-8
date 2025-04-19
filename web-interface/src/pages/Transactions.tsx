
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { fetchRecentTransactions } from "../services/supabaseData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, AlertTriangle, Filter, RefreshCw, ExternalLink, Clock, ArrowUpRight, ArrowDownLeft, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  timestamp: string;
  quantumSafe: boolean;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuantumSafe, setShowQuantumSafe] = useState(true);
  const [showClassical, setShowClassical] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await fetchRecentTransactions();
      setTransactions(data);
      toast({
        title: "Transactions refreshed",
        description: `Loaded ${data.length} transactions`,
      });
    } catch (error) {
      console.error("Error loading transactions:", error);
      toast({
        title: "Error loading transactions",
        description: "Could not fetch transaction data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();

    // Set up polling to refresh transactions every 10 seconds
    const intervalId = setInterval(loadTransactions, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  const filteredTransactions = transactions.filter(tx => 
    (showQuantumSafe && tx.quantumSafe) || (showClassical && !tx.quantumSafe)
  );

  const refreshTransactions = () => {
    loadTransactions();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Transaction hash copied",
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const viewTransactionDetails = (tx: Transaction) => {
    setSelectedTransaction(tx);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold quantum-text-gradient">Transactions</h1>
            <p className="text-slate-400">
              Explore transactions in the quantum-safe blockchain network
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={refreshTransactions}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-white"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <Sheet>
              <SheetTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-white">
                  <Filter className="h-4 w-4" />
                  Filter
                </button>
              </SheetTrigger>
              <SheetContent className="bg-slate-900 border-slate-700">
                <SheetHeader>
                  <SheetTitle className="text-white">Filter Transactions</SheetTitle>
                </SheetHeader>
                <div className="py-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-white">Security Type</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="quantum-safe"
                          checked={showQuantumSafe}
                          onChange={() => setShowQuantumSafe(!showQuantumSafe)}
                          className="mr-2 h-4 w-4 rounded border-slate-700 bg-slate-800"
                        />
                        <label htmlFor="quantum-safe" className="flex items-center text-slate-300">
                          <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                          Quantum-Safe
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="classical"
                          checked={showClassical}
                          onChange={() => setShowClassical(!showClassical)}
                          className="mr-2 h-4 w-4 rounded border-slate-700 bg-slate-800"
                        />
                        <label htmlFor="classical" className="flex items-center text-slate-300">
                          <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                          Classical
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Transaction List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 p-12 text-center quantum-card rounded-xl">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
              <p className="mt-4 text-slate-400">Loading transaction data...</p>
            </div>
          ) : filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx) => (
              <Card key={tx.id} className="quantum-card overflow-hidden hover:border-purple-500/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        {tx.quantumSafe ? (
                          <div className="flex items-center">
                            <ShieldCheck className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-xs text-green-500">Quantum-Safe</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-xs text-yellow-500">Classical</span>
                          </div>
                        )}
                        <span className="text-xs text-slate-400">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {formatTime(tx.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center mt-1 group cursor-pointer" onClick={() => copyToClipboard(tx.id)}>
                        <span className="font-mono text-xs text-slate-300 truncate max-w-[180px]">
                          {tx.id}
                        </span>
                        <Copy className="h-3 w-3 ml-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-medium text-white">{tx.amount} ETH</span>
                      <div className="text-xs text-slate-400">{formatDate(tx.timestamp)}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between border-t border-slate-800 pt-3 pb-1">
                    <div className="space-y-2 flex-1">
                      <div>
                        <div className="text-xs text-slate-400">From</div>
                        <div className="font-mono text-sm text-slate-300 truncate max-w-[180px]">{tx.from}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">To</div>
                        <div className="font-mono text-sm text-slate-300 truncate max-w-[180px]">{tx.to}</div>
                      </div>
                    </div>
                    <div>
                      <button 
                        onClick={() => viewTransactionDetails(tx)}
                        className="flex items-center gap-1 px-3 py-1.5 mt-2 rounded-md bg-slate-800 hover:bg-slate-700 text-white text-xs"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Details
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-2 p-12 text-center quantum-card rounded-xl text-slate-400">
              <p>No transactions found.</p>
              <p className="mt-2">Try changing your filters or add some blocks from the dashboard to create transactions.</p>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Details Dialog */}
      {selectedTransaction && (
        <Dialog open={!!selectedTransaction} onOpenChange={(open) => !open && setSelectedTransaction(null)}>
          <DialogContent className="bg-slate-900 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl">Transaction Details</DialogTitle>
              <DialogDescription className="text-slate-400">
                Complete information about this blockchain transaction
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Transaction Hash</h3>
                <div className="flex items-center">
                  {selectedTransaction.quantumSafe ? (
                    <div className="flex items-center bg-green-900/30 text-green-500 px-3 py-1 rounded-full">
                      <ShieldCheck className="h-4 w-4 mr-1" />
                      <span className="text-xs">Quantum-Safe</span>
                    </div>
                  ) : (
                    <div className="flex items-center bg-yellow-900/30 text-yellow-500 px-3 py-1 rounded-full">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      <span className="text-xs">Classical</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 bg-slate-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-sm text-slate-300 break-all">{selectedTransaction.id}</div>
                  <button 
                    onClick={() => copyToClipboard(selectedTransaction.id)}
                    className="p-1 bg-slate-700 hover:bg-slate-600 rounded"
                  >
                    <Copy className="h-4 w-4 text-slate-300" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-slate-400 mb-1">Amount</h4>
                  <div className="text-xl font-bold">{selectedTransaction.amount} ETH</div>
                </div>
                <div>
                  <h4 className="text-sm text-slate-400 mb-1">Timestamp</h4>
                  <div>{selectedTransaction.timestamp}</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm text-slate-400 mb-1">From Address</h4>
                <div className="p-3 bg-slate-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-sm text-slate-300 break-all">{selectedTransaction.from}</div>
                    <button 
                      onClick={() => copyToClipboard(selectedTransaction.from)}
                      className="p-1 bg-slate-700 hover:bg-slate-600 rounded"
                    >
                      <Copy className="h-4 w-4 text-slate-300" />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm text-slate-400 mb-1">To Address</h4>
                <div className="p-3 bg-slate-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-sm text-slate-300 break-all">{selectedTransaction.to}</div>
                    <button 
                      onClick={() => copyToClipboard(selectedTransaction.to)}
                      className="p-1 bg-slate-700 hover:bg-slate-600 rounded"
                    >
                      <Copy className="h-4 w-4 text-slate-300" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-slate-400">Security Status</div>
                  <div className="text-sm">
                    {selectedTransaction.quantumSafe ? (
                      <span className="text-green-500">Secure against quantum attacks</span>
                    ) : (
                      <span className="text-yellow-500">Vulnerable to quantum attacks</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
};

export default Transactions;

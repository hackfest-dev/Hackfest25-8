import React, { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, AlertTriangle, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchRecentTransactions } from "@/services/blockchainIpfsData";
import { utils, sphincsPlus } from "@/services/cryptography";

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  timestamp: string;
  quantumSafe: boolean;
  signature?: string;
}

interface TransactionsListProps {
  transactions?: Transaction[];
  loading?: boolean;
  demoCounts?: { quantum: number, classical: number };
}

const TransactionsList: React.FC<TransactionsListProps> = ({ 
  transactions: propTransactions, 
  loading: propLoading = false,
  demoCounts 
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(propLoading);

  useEffect(() => {
    // If transactions are provided as props, use them
    if (propTransactions) {
      setTransactions(propTransactions);
      return;
    }

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        // Fetch transactions from IPFS
        const fetchedTransactions = await fetchRecentTransactions();
        
        if (fetchedTransactions && fetchedTransactions.length > 0) {
          setTransactions(fetchedTransactions);
        } else {
          // If no data from IPFS, generate demo transactions
          await generateDemoTransactions();
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        // Generate demo transactions if fetch fails
        await generateDemoTransactions();
      } finally {
        setLoading(false);
      }
    };

    const generateDemoTransactions = async () => {
      try {
        console.log("Generating demo transactions with real SPHINCS+ and Kyber implementations");
        
        // Define counts
        const quantumCount = demoCounts?.quantum || 3;
        const classicalCount = demoCounts?.classical || 2;
        
        const demoTransactions: Transaction[] = [];
        
        // Generate quantum-safe transactions with real SPHINCS+ signatures
        for (let i = 0; i < quantumCount; i++) {
          const from = utils.generateWalletAddress();
          const to = utils.generateWalletAddress();
          const amount = (0.1 + Math.random() * 9.9).toFixed(3);
          
          // Generate a real SPHINCS+ keypair and signature
          const keys = await sphincsPlus.generateKeypair();
          const txData = { from, to, amount, timestamp: new Date().toISOString() };
          const signature = await sphincsPlus.sign(JSON.stringify(txData), keys.privateKey);
          
          demoTransactions.push({
            id: utils.bytesToHex(utils.getRandomBytes(16)),
            from,
            to,
            amount,
            timestamp: new Date(Date.now() - i * 3600000).toLocaleString(),
            quantumSafe: true,
            signature: signature.substring(0, 64)
          });
        }
        
        // Generate classical transactions
        for (let i = 0; i < classicalCount; i++) {
          const from = utils.generateWalletAddress();
          const to = utils.generateWalletAddress();
          const amount = (0.1 + Math.random() * 4.9).toFixed(3);
          
          // For classical, we'll use a simpler signature
          const message = JSON.stringify({ from, to, amount });
          const hash = await crypto.subtle.digest('SHA-256', utils.stringToBytes(message));
          const signature = utils.bytesToHex(new Uint8Array(hash));
          
          demoTransactions.push({
            id: utils.bytesToHex(utils.getRandomBytes(16)),
            from,
            to,
            amount,
            timestamp: new Date(Date.now() - (i + quantumCount) * 3600000).toLocaleString(),
            quantumSafe: false,
            signature: signature.substring(0, 64)
          });
        }
        
        // Sort by timestamp (newest first)
        demoTransactions.sort((a, b) => {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
        
        setTransactions(demoTransactions);
      } catch (error) {
        console.error("Error generating demo transactions:", error);
        // Fallback to very simple demo data
        setTransactions([
          {
            id: "0x3f5e9a726d3b8f",
            from: "0x7cF4b1230934dFef",
            to: "0x8e5D921F6a77bCf",
            amount: "3.245",
            timestamp: new Date().toLocaleString(),
            quantumSafe: true
          },
          {
            id: "0x2a1d8b635c4a7e",
            from: "0x9aB87c5d34Bcf",
            to: "0x5Cf1e45b67a8",
            amount: "1.08",
            timestamp: new Date(Date.now() - 3600000).toLocaleString(),
            quantumSafe: false
          },
          {
            id: "0x7d9c4e518f2b3a",
            from: "0x2Fc7e45b67a89c",
            to: "0x1eA5d92C8b7f",
            amount: "0.5",
            timestamp: new Date(Date.now() - 7200000).toLocaleString(),
            quantumSafe: true
          }
        ]);
      }
    };

    fetchTransactions();
  }, [propTransactions, demoCounts]);

  return (
    <div className="quantum-card rounded-xl overflow-hidden">
      <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Recent Transactions</h3>
        <Link to="/transactions" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
          View All
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
      <div>
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
            <p className="mt-2 text-slate-400">Loading transactions...</p>
          </div>
        ) : transactions.length > 0 ? (
          transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors flex items-center"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs text-slate-400">
                    {tx.id.substring(0, 10)}...
                  </span>
                  {tx.quantumSafe ? (
                    <div className="flex items-center">
                      <ShieldCheck className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-500 ml-1">Quantum-safe</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="text-xs text-yellow-500 ml-1">Classical</span>
                    </div>
                  )}
                </div>
                <div className="mt-1 flex items-center text-sm">
                  <span className="font-mono text-slate-400 truncate max-w-[100px]">
                    {tx.from.substring(0, 8)}...
                  </span>
                  <ArrowRight className="h-3 w-3 mx-2 text-slate-500" />
                  <span className="font-mono text-slate-400 truncate max-w-[100px]">
                    {tx.to.substring(0, 8)}...
                  </span>
                </div>
                {tx.signature && (
                  <div className="mt-1">
                    <span className="font-mono text-xs text-slate-500">
                      Sig: {tx.signature.substring(0, 16)}...
                    </span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-white font-medium">{tx.amount} ETH</div>
                <div className="text-xs text-slate-400">{tx.timestamp}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-400">
            No transactions found. Add a block to create transactions.
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsList;

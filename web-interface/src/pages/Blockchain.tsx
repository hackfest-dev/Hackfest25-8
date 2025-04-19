
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { fetchBlockchain } from "../services/supabaseData";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const Blockchain = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadBlocks = async () => {
      try {
        setLoading(true);
        const data = await fetchBlockchain(20);
        setBlocks(data);
      } catch (error) {
        console.error("Error loading blockchain data:", error);
        toast({
          title: "Error loading blockchain",
          description: "Could not fetch blockchain data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadBlocks();
  }, [toast]);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold quantum-text-gradient">Blockchain Explorer</h1>
        <p className="text-slate-400">
          View and explore blocks in the quantum-safe blockchain
        </p>
        
        <div className="quantum-card rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
              <p className="mt-4 text-slate-400">Loading blockchain data...</p>
            </div>
          ) : blocks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Block</TableHead>
                  <TableHead>Hash</TableHead>
                  <TableHead>Previous Hash</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Security</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blocks.map((block) => (
                  <TableRow key={block.id} className="hover:bg-slate-800/30">
                    <TableCell className="font-medium">{block.id}</TableCell>
                    <TableCell className="font-mono text-xs truncate max-w-[120px]">
                      {block.hash}
                    </TableCell>
                    <TableCell className="font-mono text-xs truncate max-w-[120px]">
                      {block.previousHash}
                    </TableCell>
                    <TableCell>{block.timestamp}</TableCell>
                    <TableCell>{block.transactions.length}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {block.quantumSafe ? (
                          <>
                            <ShieldCheck className="h-4 w-4 text-green-500" />
                            <span className="text-green-500">Quantum-Safe</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <span className="text-yellow-500">Classical</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center text-slate-400">
              <p>No blockchain blocks found.</p>
              <p className="mt-2">Add some blocks from the dashboard to get started.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Blockchain;
